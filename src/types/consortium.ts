export type VehicleType = 
  | 'Carro Zero Km'
  | 'Carro Seminovo'
  | 'SUV / Crossover'
  | 'Picape / Utilitário'
  | 'Moto de Alta Cilindrada';

export type LeadStatus = 'novo' | 'em_atendimento' | 'proposta_enviada' | 'aprovado' | 'contemplado';

export interface ConsortiumLead {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string;
  valor_carta: number;
  prazo_meses: number;
  tipo_veiculo: VehicleType;
  parcela_estimada: number;
  melhor_horario?: string;
  status: LeadStatus;
  observacoes?: string;
  documento_url?: string;
  origem?: 'supabase' | 'local';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
  isConnected: boolean;
  lastChecked?: string;
  errorMessage?: string;
}

export interface SimulationParameters {
  valorCarta: number;
  prazoMeses: number;
  tipoVeiculo: VehicleType;
}
