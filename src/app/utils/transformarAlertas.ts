export interface AlertaINMET {
  id: number;
  data_inicio: string;
  data_fim: string;
  municipios: string;
  poligono: string;
  severidade: string;
  descricao: string;
}

export interface PontoDeRisco {
  id: number;
  latitude: number;
  longitude: number;
  nivel: 'Alto' | 'Médio' | 'Baixo';
  descricao: string;
  inicio: string;
  fim: string;
  uf: string;
  municipio: string;
}

const UF_COORDENADAS: Record<string, [number, number]> = {
  'AC': [-8.77, -70.55], 'AL': [-9.62, -36.82], 'AP': [1.41, -51.77], 'AM': [-3.47, -65.10],
  'BA': [-13.29, -41.71], 'CE': [-5.20, -39.53], 'DF': [-15.78, -47.93], 'ES': [-19.19, -40.34],
  'GO': [-15.98, -49.86], 'MA': [-5.42, -45.44], 'MT': [-12.64, -55.42], 'MS': [-20.51, -54.54],
  'MG': [-18.10, -44.38], 'PA': [-3.79, -52.48], 'PB': [-7.28, -36.72], 'PR': [-24.89, -51.55],
  'PE': [-8.38, -37.86], 'PI': [-6.60, -42.28], 'RJ': [-22.25, -42.66], 'RN': [-5.81, -36.59],
  'RS': [-30.17, -53.50], 'RO': [-10.83, -63.34], 'RR': [1.99, -61.33], 'SC': [-27.45, -50.95],
  'SP': [-22.19, -48.79], 'SE': [-10.57, -37.45], 'TO': [-9.46, -48.26],
};

function extrairUF(municipios: string | undefined): string {
  if (!municipios) return 'BR';
  const matches = municipios.match(/ - ([A-Z]{2})/g);
  return matches?.[0]?.replace(' - ', '') || 'BR';
}

function extrairPrimeiroMunicipio(municipios: string | undefined): string {
  if (!municipios) return 'Local não especificado';
  const primeiro = municipios.split(',')[0].trim();
  return primeiro.split(' - ')[0].trim();
}

function calcularCentroide(poligono: string | undefined): [number, number] | null {
  if (!poligono) return null;
  try {
    const geoJson = JSON.parse(poligono);
    if (geoJson.type === 'Polygon' && geoJson.coordinates?.length > 0) {
      const coordenadas = geoJson.coordinates[0];
      const primeiroPonto = coordenadas[0];
      return [primeiroPonto[1], primeiroPonto[0]];
    }
    if (geoJson.type === 'MultiPolygon' && geoJson.coordinates?.length > 0) {
      const primeiroAnel = geoJson.coordinates[0][0];
      const primeiroPonto = primeiroAnel[0];
      return [primeiroPonto[1], primeiroPonto[0]];
    }
  } catch {}
  return null;
}

function getNivelRisco(severidade: string): 'Alto' | 'Médio' | 'Baixo' {
  if (!severidade) return 'Baixo';
  if (severidade.toLowerCase().includes('perigo')) return 'Alto';
  if (severidade.toLowerCase().includes('atenção')) return 'Médio';
  return 'Baixo';
}

export function transformarAlertas(data: unknown): PontoDeRisco[] {
  // Suporta tanto data[0]?.hoje/futuro quanto array direto
  let alertas: AlertaINMET[] = [];
  if (Array.isArray(data)) {
    if (data[0]?.hoje || data[0]?.futuro) {
      alertas = [
        ...(data[0]?.hoje || []),
        ...(data[0]?.futuro || [])
      ];
    } else {
      alertas = data;
    }
  } else if (typeof data === 'object' && data !== null) {
    alertas = [data as AlertaINMET];
  }

  const transformados: PontoDeRisco[] = [];
  for (const alerta of alertas) {
    const uf = extrairUF(alerta.municipios);
    const municipio = extrairPrimeiroMunicipio(alerta.municipios);
    const centroide = calcularCentroide(alerta.poligono);
    if (centroide) {
      transformados.push({
        id: alerta.id,
        latitude: centroide[0],
        longitude: centroide[1],
        nivel: getNivelRisco(alerta.severidade),
        descricao: alerta.descricao || `Alerta para ${municipio} e região`,
        inicio: alerta.data_inicio,
        fim: alerta.data_fim,
        uf,
        municipio
      });
    } else if (UF_COORDENADAS[uf]) {
      transformados.push({
        id: alerta.id,
        latitude: UF_COORDENADAS[uf][0],
        longitude: UF_COORDENADAS[uf][1],
        nivel: getNivelRisco(alerta.severidade),
        descricao: alerta.descricao || `Alerta para ${municipio} e região`,
        inicio: alerta.data_inicio,
        fim: alerta.data_fim,
        uf,
        municipio
      });
    }
  }
  return transformados;
}
