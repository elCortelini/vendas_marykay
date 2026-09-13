// Módulo de Integração Direta com a API Pública de Catálogo VTEX da Mary Kay Brasil
// URL Base: https://loja.marykay.com.br/api/catalog_system/pub/products/search

const VTEX_SEARCH_URL = 'https://loja.marykay.com.br/api/catalog_system/pub/products/search';

/**
 * Converte a estrutura de produto retornada pela API VTEX nos objetos padronizados da aplicação
 */
export function parseVtexProducts(vtexProductsArray) {
  const result = [];
  if (!Array.isArray(vtexProductsArray)) return result;

  for (const prod of vtexProductsArray) {
    const rawCategories = Array.isArray(prod.categories) && prod.categories.length > 0
      ? prod.categories[0]
      : '';
    const catLower = rawCategories.toLowerCase();

    // Mapeamento inteligente de categorias
    let category = 'Maquiagem (Bases, Batons, Olhos)';
    if (catLower.includes('base') || catLower.includes('matte') || prod.productName.toLowerCase().includes('base')) {
      category = 'Bases Matte TimeWise® 3D';
    } else if (catLower.includes('pele') || catLower.includes('timewise') || catLower.includes('cuidados')) {
      category = 'Cuidados com a Pele (TimeWise 3D)';
    } else if (catLower.includes('repair') || catLower.includes('volu-firm')) {
      category = 'Linha Repair & Volu-Firm';
    } else if (catLower.includes('batom') || catLower.includes('labio') || catLower.includes('gloss')) {
      category = 'Maquiagem (Batons & Gloss)';
    } else if (catLower.includes('olho') || catLower.includes('corretivo') || catLower.includes('mascara')) {
      category = 'Maquiagem (Olhos & Corretivos)';
    } else if (catLower.includes('fragran') && (catLower.includes('homem') || catLower.includes('masculin') || prod.productName.toLowerCase().includes('hero') || prod.productName.toLowerCase().includes('upscale'))) {
      category = 'Fragrâncias Masculinas';
    } else if (catLower.includes('fragran')) {
      category = 'Fragrâncias Femininas';
    }

    if (Array.isArray(prod.items)) {
      for (const item of prod.items) {
        const refIdObj = Array.isArray(item.referenceId) ? item.referenceId.find(r => r.Key === 'RefId') : null;
        const sku = (refIdObj && refIdObj.Value) || item.itemId || prod.productId;
        const cleanSku = String(sku).trim();
        
        let name = item.nameComplete || `${prod.productName} ${item.name || ''}`.trim();
        name = name.replace(/\s+/g, ' ');

        const seller = item.sellers && item.sellers[0];
        const price = seller?.commertialOffer?.Price || 84.90;
        
        let image = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80';
        if (Array.isArray(item.images) && item.images.length > 0) {
          image = item.images[0].imageUrl || image;
        }

        const rawDesc = prod.description ? prod.description.replace(/<[^>]*>?/gm, '').trim() : '';
        const description = rawDesc || `Produto oficial Mary Kay® Brasil: ${name}. Código SKU: ${cleanSku}.`;

        result.push({
          id: 'mk-' + cleanSku.toLowerCase(),
          sku: cleanSku,
          name: name,
          category: category,
          price: Number(price),
          costPrice: Number((price * 0.6).toFixed(2)),
          image: image,
          description: description,
          isBestSeller: true
        });
      }
    }
  }
  return result;
}

/**
 * Busca todos os produtos ativos do catálogo oficial via API VTEX paginada (_from e _to)
 */
export async function fetchAllVtexProducts(pageSize = 50, maxPages = 8) {
  console.log('[VTEX API Service] Iniciando sincronização via API Pública VTEX (loja.marykay.com.br)...');
  const allProducts = [];

  for (let page = 0; page < maxPages; page++) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const url = `${VTEX_SEARCH_URL}?_from=${from}&_to=${to}`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      if (!res.ok && res.status !== 206) {
        console.warn(`[VTEX API Service] Página ${page} retornou status ${res.status}`);
        break;
      }

      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) {
        console.log(`[VTEX API Service] Fim dos dados na página ${page}. Total de produtos VTEX extraídos.`);
        break;
      }

      const parsedSlice = parseVtexProducts(json);
      allProducts.push(...parsedSlice);
      console.log(`[VTEX API Service] Página ${page} (_from=${from}&_to=${to}) processada: ${parsedSlice.length} itens extraídos.`);
    } catch (err) {
      console.error(`[VTEX API Service] Erro ao buscar página ${page}:`, err.message);
      break;
    }
  }

  // Remover duplicados por SKU
  const uniqueProductsMap = new Map();
  for (const prod of allProducts) {
    if (!uniqueProductsMap.has(prod.sku)) {
      uniqueProductsMap.set(prod.sku, prod);
    }
  }

  const finalProducts = Array.from(uniqueProductsMap.values());
  console.log(`[VTEX API Service] Sincronização concluída! Total de ${finalProducts.length} SKUs únicos obtidos via VTEX API.`);
  return finalProducts;
}

/**
 * Busca produto específico por SKU/Código na API VTEX em tempo real
 */
export async function fetchVtexProductBySku(sku) {
  const cleanSku = String(sku || '').trim();
  const cleanDigits = cleanSku.replace(/\D/g, '');

  console.log(`[VTEX API Service] Buscando SKU #${cleanSku} na API VTEX...`);

  // 1. Tentar busca direta com _from=0&_to=49 (primeira página contendo os principais SKUs)
  try {
    const res = await fetch(`${VTEX_SEARCH_URL}?_from=0&_to=49`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    if (res.ok || res.status === 206) {
      const json = await res.json();
      const parsed = parseVtexProducts(json);
      const found = parsed.find(p => p.sku === cleanSku || (cleanDigits && p.sku.replace(/\D/g, '') === cleanDigits));
      if (found) {
        return found;
      }
    }
  } catch (err) {
    console.error('[VTEX API Service] Erro na busca rápida de SKU:', err.message);
  }

  // 2. Se não encontrou na primeira página, buscar varrendo as páginas até encontrar
  const allVtex = await fetchAllVtexProducts(50, 8);
  const matched = allVtex.find(p => p.sku === cleanSku || (cleanDigits && p.sku.replace(/\D/g, '') === cleanDigits));
  
  return matched || null;
}
