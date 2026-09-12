// Serviço de Sincronização em Nuvem em Tempo Real (Acessível de qualquer navegador/dispositivo)

const CLOUD_STORAGE_KEY = "vendas_marykay_cloud_master_db_v1";
const CLOUD_API_ENDPOINT = "https://api.jsonbin.io/v3/b";

// Chave da nuvem pública para o aplicativo Mary Kay
const PUBLIC_BIN_ID = "67c3fe80ad19ca34f8a84617"; 

// 1. Salvar dados na nuvem global
export const saveToCloud = async (data) => {
  if (!data) return;
  try {
    // 1. Backup Local no Navegador
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));

    // 2. Atualização em Nuvem (para acesso remoto de qualquer navegador/celular)
    await fetch(`https://api.myjson.online/v1/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: CLOUD_STORAGE_KEY, value: data })
    });
  } catch (err) {
    // Silencioso se offline
  }
};

// 2. Buscar dados atualizados da nuvem
export const fetchFromCloud = async () => {
  try {
    const res = await fetch(`https://api.myjson.online/v1/records/${CLOUD_STORAGE_KEY}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.value) {
        localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(json.value));
        return json.value;
      }
    }
  } catch (err) {
    // Usar cache local se offline
  }

  const local = localStorage.getItem(CLOUD_STORAGE_KEY) || localStorage.getItem('mk_app_data');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return null;
};
