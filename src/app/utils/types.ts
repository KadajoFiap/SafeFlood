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

export type RiskLevel = 'Alto' | 'Médio' | 'Baixo'; 