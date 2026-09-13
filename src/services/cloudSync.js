// Serviço de Sincronização em Nuvem em Tempo Real & Persistência Local Garantida
// Chave Master do Banco de Dados
const CLOUD_STORAGE_KEY = "vendas_marykay_cloud_master_db_v1";
const SECONDARY_KEY = "mk_app_data";

// 1. Salvar dados de forma síncrona no localStorage local e em background na nuvem
export const saveToCloud = async (data) => {
  if (!data) return;
  try {
    const jsonStr = JSON.stringify(data);
    localStorage.setItem(CLOUD_STORAGE_KEY, jsonStr);
    localStorage.setItem(SECONDARY_KEY, jsonStr);

    // 2. Backup assíncrono em Nuvem em background (para sincronização entre múltiplos dispositivos)
    fetch(`https://api.myjson.online/v1/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: CLOUD_STORAGE_KEY, value: data })
    }).catch(() => {});
  } catch (err) {
    console.warn('[CloudSync] Erro no backup local/nuvem:', err);
  }
};

// 2. Buscar dados priorizando ESTRITAMENTE o localStorage local do usuário
export const fetchFromCloud = async () => {
  // 1. Tentar ler os dados locais do localStorage primeiro
  const localMaster = localStorage.getItem(CLOUD_STORAGE_KEY) || localStorage.getItem(SECONDARY_KEY);
  let localData = null;

  if (localMaster) {
    try {
      localData = JSON.parse(localMaster);
    } catch (e) {}
  }

  // Se houver dados válidos salvos localmente no navegador, retornar imediatamente!
  if (localData && (
    (Array.isArray(localData.clients) && localData.clients.length > 0) ||
    (Array.isArray(localData.carts) && localData.carts.length > 0) ||
    (Array.isArray(localData.products) && localData.products.length > 0) ||
    localData.consultant
  )) {
    // Tentar atualização em nuvem em background sem sobrescrever o local
    fetch(`https://api.myjson.online/v1/records/${CLOUD_STORAGE_KEY}`)
      .then(res => res.json())
      .then(json => {
        if (json && json.value && Array.isArray(json.value.clients)) {
          // Apenas atualizar o cache secundário se a nuvem contiver dados válidos
          localStorage.setItem('mk_cloud_remote_backup', JSON.stringify(json.value));
        }
      })
      .catch(() => {});

    return localData;
  }

  // 2. Se não houver dados locais, buscar da nuvem remota
  try {
    const res = await fetch(`https://api.myjson.online/v1/records/${CLOUD_STORAGE_KEY}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.value) {
        localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(json.value));
        localStorage.setItem(SECONDARY_KEY, JSON.stringify(json.value));
        return json.value;
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Falha na consulta em nuvem:', err);
  }

  return localData;
};
