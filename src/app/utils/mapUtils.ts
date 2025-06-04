import L from 'leaflet';
import type { RiskLevel } from './types';

// Mapeamento de coordenadas por UF (fallback)
export const UF_COORDENADAS: Record<string, [number, number]> = {
  'AC': [-8.77, -70.55],
  'AL': [-9.62, -36.82],
  'AP': [1.41, -51.77],
  'AM': [-3.47, -65.10],
  'BA': [-13.29, -41.71],
  'CE': [-5.20, -39.53],
  'DF': [-15.78, -47.93],
  'ES': [-19.19, -40.34],
  'GO': [-15.98, -49.86],
  'MA': [-5.42, -45.44],
  'MT': [-12.64, -55.42],
  'MS': [-20.51, -54.54],
  'MG': [-18.10, -44.38],
  'PA': [-3.79, -52.48],
  'PB': [-7.28, -36.72],
  'PR': [-24.89, -51.55],
  'PE': [-8.38, -37.86],
  'PI': [-6.60, -42.28],
  'RJ': [-22.25, -42.66],
  'RN': [-5.81, -36.59],
  'RS': [-30.17, -53.50],
  'RO': [-10.83, -63.34],
  'RR': [1.99, -61.33],
  'SC': [-27.45, -50.95],
  'SP': [-22.19, -48.79],
  'SE': [-10.57, -37.45],
  'TO': [-9.46, -48.26],
};

// Centro aproximado do Brasil
export const center: [number, number] = [-15.788, -47.929];

// Configuração do ícone padrão do Leaflet
export const configureDefaultIcon = () => {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Ícones personalizados por nível de risco
export const getIconForRiskLevel = (nivel: RiskLevel) => {
  const icons = {
    'Alto': '/risco_alto.png',
    'Médio': '/risco_medio.png',
    'Baixo': '/risco_baixo.png'
  };

  return new L.Icon({
    iconUrl: icons[nivel],
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Função para extrair UF do campo municipios
export const extrairUF = (municipios: string | undefined): string => {
  if (!municipios) return 'BR';
  const matches = municipios.match(/ - ([A-Z]{2})/g);
  return matches?.[0]?.replace(' - ', '') || 'BR';
};

// Função para extrair o primeiro município
export const extrairPrimeiroMunicipio = (municipios: string | undefined): string => {
  if (!municipios) return 'Local não especificado';
  const primeiro = municipios.split(',')[0].trim();
  return primeiro.split(' - ')[0].trim();
};

// Função simplificada para calcular centroide
export const calcularCentroide = (poligono: string | undefined): [number, number] | null => {
  if (!poligono) return null;

  try {
    const geoJson = JSON.parse(poligono);

    if (geoJson.type === 'Polygon' && geoJson.coordinates?.length > 0) {
      const coordenadas = geoJson.coordinates[0];
      const primeiroPonto = coordenadas[0];
      return [primeiroPonto[1], primeiroPonto[0]]; // [lat, lng]
    }

    if (geoJson.type === 'MultiPolygon' && geoJson.coordinates?.length > 0) {
      const primeiroAnel = geoJson.coordinates[0][0];
      const primeiroPonto = primeiroAnel[0];
      return [primeiroPonto[1], primeiroPonto[0]]; // [lat, lng]
    }
  } catch (e) {
    console.error('Erro ao processar polígono:', e);
  }
  return null;
};

// Função para determinar nível de risco
export const getNivelRisco = (severidade: string): RiskLevel => {
  if (!severidade) return 'Baixo';
  if (severidade.toLowerCase().includes('perigo')) return 'Alto';
  if (severidade.toLowerCase().includes('atenção')) return 'Médio';
  return 'Baixo';
}; 