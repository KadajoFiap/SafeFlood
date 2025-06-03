// /app/api/inmet-alertas/route.ts
import { NextResponse } from 'next/server';

// Cache simples em memória
const geoCache: Record<string, [number, number]> = {};

interface AlertaINMET {
  municipio?: string;
  uf?: string;
  // outros campos se necessário
}

export async function GET() {
  try {
    const response = await fetch('https://apiprevmet3.inmet.gov.br/avisos/ativos');
    
    if (!response.ok) {
      throw new Error(`INMET API error: ${response.status}`);
    }

    const data = await response.json();
    const dataArray = Array.isArray(data) ? data : [data];

    // Função de geocoding com cache
    const geocodeLocation = async (municipio: string, uf: string): Promise<[number, number] | null> => {
      const cacheKey = `${municipio}-${uf}`.toLowerCase();
      
      // Verifica cache
      if (geoCache[cacheKey]) {
        return geoCache[cacheKey];
      }

      try {
        // Tenta primeiro com a API do IBGE
        const ibgeResponse = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipio}`);
        const ibgeData = await ibgeResponse.json();
        
        if (ibgeData && ibgeData.latitude && ibgeData.longitude) {
          const coords: [number, number] = [parseFloat(ibgeData.latitude), parseFloat(ibgeData.longitude)];
          geoCache[cacheKey] = coords;
          return coords;
        }
      } catch (ibgeError) {
        console.warn(`IBGE API error for ${municipio}:`, ibgeError);
      }

      try {
        // Fallback para OpenStreetMap
        const osmResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(municipio)},${uf},Brasil`
        );
        const osmData = await osmResponse.json();
        
        if (osmData && osmData.length > 0) {
          const coords: [number, number] = [
            parseFloat(osmData[0].lat),
            parseFloat(osmData[0].lon)
          ];
          geoCache[cacheKey] = coords;
          return coords;
        }
      } catch (osmError) {
        console.error(`OSM Geocoding error for ${municipio}:`, osmError);
      }

      return null;
    };

    // Processar alertas com geocoding
    const processedData = await Promise.all(
      dataArray.map(async (alerta: AlertaINMET) => {
        let latitude = null;
        let longitude = null;
        
        if (alerta.municipio && alerta.uf) {
          const coords = await geocodeLocation(alerta.municipio, alerta.uf);
          if (coords) {
            [latitude, longitude] = coords;
          }
        }
        
        return {
          ...alerta,
          latitude,
          longitude
        };
      })
    );

    return NextResponse.json(processedData);
  } catch (err) {
    console.error('Erro ao buscar dados do INMET:', err);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do INMET' },
      { status: 500 }
    );
  }
}