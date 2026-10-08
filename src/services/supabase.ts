import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConsortiumLead, SupabaseConfig, LeadStatus } from '../types/consortium';

const CONFIG_STORAGE_KEY = 'autoplan_supabase_config';
const LOCAL_LEADS_KEY = 'autoplan_local_leads';

const DEFAULT_CONFIG: SupabaseConfig = {
  url: (import.meta.env.VITE_SUPABASE_URL as string) || '',
  anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
  tableName: 'consorcio_inscricoes',
  isConnected: false,
};

// Initial sample leads for immediate visualization when opening the dashboard
const SAMPLE_LEADS: ConsortiumLead[] = [
  {
    id: 'lead-sample-1',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    nome: 'Carlos Eduardo Silveira',
    email: 'carlos.silveira@email.com',
    telefone: '(11) 98765-4321',
    valor_carta: 120000,
    prazo_meses: 72,
    tipo_veiculo: 'SUV / Crossover',
    parcela_estimada: 1883,
    melhor_horario: 'Tarde',
    status: 'novo',
    observacoes: 'Interesse em Jeep Compass ou Corolla Cross',
    origem: 'local',
  },
  {
    id: 'lead-sample-2',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    nome: 'Mariana Guimarães Rocha',
    email: 'mariana.rocha@advocacia.com',
    telefone: '(21) 99123-9876',
    valor_carta: 80000,
    prazo_meses: 60,
    tipo_veiculo: 'Carro Zero Km',
    parcela_estimada: 1506,
    melhor_horario: 'Manhã',
    status: 'em_atendimento',
    observacoes: 'Deseja ofertar lance de 30% em 3 meses',
    origem: 'local',
  },
  {
    id: 'lead-sample-3',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    nome: 'Rodrigo Mendonça Dias',
    email: 'rodrigo.dias@agro.com.br',
    telefone: '(31) 98844-5511',
    valor_carta: 220000,
    prazo_meses: 84,
    tipo_veiculo: 'Picape / Utilitário',
    parcela_estimada: 2957,
    melhor_horario: 'Noite',
    status: 'proposta_enviada',
    observacoes: 'Picape Hilux para trabalho no campo',
    origem: 'local',
  },
];

let supabaseInstance: SupabaseClient | null = null;

export function getStoredConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.error('Erro ao ler config do Supabase:', err);
  }
  return DEFAULT_CONFIG;
}

export function saveStoredConfig(config: Partial<SupabaseConfig>): SupabaseConfig {
  const current = getStoredConfig();
  const updated: SupabaseConfig = {
    ...current,
    ...config,
  };
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
  supabaseInstance = null; // force re-instantiation
  return updated;
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  // Validate URL format
  if (!config.url.startsWith('https://') || !config.url.includes('supabase.co')) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url.trim(), config.anonKey.trim(), {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.error('Falha ao criar cliente Supabase:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function getLocalLeads(): ConsortiumLead[] {
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Initialize with sample leads if empty
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(SAMPLE_LEADS));
    return SAMPLE_LEADS;
  } catch (err) {
    console.error('Erro ao ler leads locais:', err);
    return SAMPLE_LEADS;
  }
}

export function saveLocalLead(lead: ConsortiumLead): void {
  const existing = getLocalLeads();
  const updated = [lead, ...existing.filter((l) => l.id !== lead.id)];
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
}

export async function testSupabaseConnection(urlInput?: string, keyInput?: string): Promise<{
  success: boolean;
  message: string;
  tableFound?: boolean;
}> {
  const url = (urlInput || getStoredConfig().url || '').trim();
  const key = (keyInput || getStoredConfig().anonKey || '').trim();

  if (!url || !key) {
    return {
      success: false,
      message: 'URL do Projeto e Anon Key são obrigatórios.',
    };
  }

  if (!url.startsWith('https://')) {
    return {
      success: false,
      message: 'A URL do Supabase deve iniciar com https:// (ex: https://xyz.supabase.co)',
    };
  }

  try {
    const testClient = createClient(url, key, {
      auth: { persistSession: false },
    });

    // Test querying the table
    const { data, error } = await testClient
      .from('consorcio_inscricoes')
      .select('id')
      .limit(1);

    if (error) {
      // Check if it's table does not exist
      if (error.code === '42P01' || error.message.includes('relation "consorcio_inscricoes" does not exist')) {
        return {
          success: true,
          tableFound: false,
          message: 'Conectado ao Supabase com sucesso! A tabela "consorcio_inscricoes" ainda precisa ser criada. Utilize o script SQL abaixo.',
        };
      }
      return {
        success: false,
        message: `Erro do Supabase: ${error.message} (${error.code || 'sem código'})`,
      };
    }

    return {
      success: true,
      tableFound: true,
      message: 'Conexão perfeita! Supabase autenticado e tabela "consorcio_inscricoes" pronta para receber leads.',
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro de rede desconhecido';
    return {
      success: false,
      message: `Falha de rede ou credenciais inválidas: ${errorMessage}`,
    };
  }
}

export async function submitRegistration(leadData: Omit<ConsortiumLead, 'id' | 'created_at' | 'status' | 'origem'>): Promise<{
  success: boolean;
  lead: ConsortiumLead;
  source: 'supabase' | 'local';
  message: string;
}> {
  const id = 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const newLead: ConsortiumLead = {
    ...leadData,
    id,
    created_at: now,
    status: 'novo',
    origem: 'local',
  };

  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('consorcio_inscricoes')
        .insert([
          {
            nome: leadData.nome,
            email: leadData.email,
            telefone: leadData.telefone,
            valor_carta: leadData.valor_carta,
            prazo_meses: leadData.prazo_meses,
            tipo_veiculo: leadData.tipo_veiculo,
            parcela_estimada: leadData.parcela_estimada,
            melhor_horario: leadData.melhor_horario || 'Qualquer',
            status: 'novo',
            observacoes: leadData.observacoes || '',
            documento_url: leadData.documento_url || null,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const supabaseLead: ConsortiumLead = {
          ...newLead,
          id: data.id || id,
          origem: 'supabase',
        };
        // Also save copy locally for offline cache
        saveLocalLead(supabaseLead);
        return {
          success: true,
          lead: supabaseLead,
          source: 'supabase',
          message: 'Inscrição gravada diretamente no banco de dados do Supabase!',
        };
      } else {
        console.warn('Erro ao inserir no Supabase, salvando localmente:', error?.message);
      }
    } catch (err) {
      console.warn('Exceção ao inserir no Supabase, usando fallback local:', err);
    }
  }

  // Fallback: save in local storage
  saveLocalLead(newLead);
  return {
    success: true,
    lead: newLead,
    source: 'local',
    message: 'Inscrição confirmada com sucesso! (Salva localmente no armazenamento seguro)',
  };
}

export async function fetchAllLeads(): Promise<ConsortiumLead[]> {
  const client = getSupabaseClient();
  const localLeads = getLocalLeads();

  if (client) {
    try {
      const { data, error } = await client
        .from('consorcio_inscricoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const supabaseLeads: ConsortiumLead[] = data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at || new Date().toISOString(),
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          valor_carta: Number(item.valor_carta),
          prazo_meses: Number(item.prazo_meses),
          tipo_veiculo: item.tipo_veiculo || 'Carro Zero Km',
          parcela_estimada: Number(item.parcela_estimada || 0),
          melhor_horario: item.melhor_horario || '',
          status: (item.status as LeadStatus) || 'novo',
          observacoes: item.observacoes || '',
          documento_url: item.documento_url || undefined,
          origem: 'supabase',
        }));

        // Merge any local leads that haven't been pushed to Supabase yet
        const supabaseIds = new Set(supabaseLeads.map((l) => l.id));
        const nonSyncedLocal = localLeads.filter((l) => !supabaseIds.has(l.id) && l.origem === 'local');

        return [...supabaseLeads, ...nonSyncedLocal];
      }
    } catch (err) {
      console.warn('Erro ao buscar leads do Supabase, retornando locais:', err);
    }
  }

  return localLeads;
}

export async function updateLeadStatus(id: string, newStatus: LeadStatus): Promise<boolean> {
  // Update locally first
  const local = getLocalLeads();
  const updated = local.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client
        .from('consorcio_inscricoes')
        .update({ status: newStatus })
        .eq('id', id);

      if (!error) return true;
    } catch (err) {
      console.error('Erro ao atualizar status no Supabase:', err);
    }
  }

  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const local = getLocalLeads();
  const updated = local.filter((l) => l.id !== id);
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('consorcio_inscricoes').delete().eq('id', id);
    } catch (err) {
      console.error('Erro ao deletar lead no Supabase:', err);
    }
  }

  return true;
}

export async function syncLocalLeadsToSupabase(): Promise<{
  syncedCount: number;
  totalErrors: number;
}> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase não está configurado.');
  }

  const localLeads = getLocalLeads();
  const pending = localLeads.filter((l) => l.origem === 'local');

  let syncedCount = 0;
  let totalErrors = 0;

  for (const lead of pending) {
    try {
      const { error } = await client.from('consorcio_inscricoes').insert([
        {
          nome: lead.nome,
          email: lead.email,
          telefone: lead.telefone,
          valor_carta: lead.valor_carta,
          prazo_meses: lead.prazo_meses,
          tipo_veiculo: lead.tipo_veiculo,
          parcela_estimada: lead.parcela_estimada,
          melhor_horario: lead.melhor_horario,
          status: lead.status,
          observacoes: lead.observacoes,
        },
      ]);

      if (!error) {
        lead.origem = 'supabase';
        syncedCount++;
      } else {
        totalErrors++;
      }
    } catch {
      totalErrors++;
    }
  }

  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(localLeads));
  return { syncedCount, totalErrors };
}

export function getSqlSchemaScript(): string {
  return `-- ============================================================
-- SCRIPT COMPLETO COM POLÍTICAS DE ARMAZENAMENTO E RLS (SUPABASE)
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- ------------------------------------------------------------
-- PARTE 1: TABELA DE INSCRIÇÕES COM RLS ATIVADO
-- ------------------------------------------------------------

-- 1. Criação da tabela de inscrições de consórcio
CREATE TABLE IF NOT EXISTS public.consorcio_inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  valor_carta NUMERIC NOT NULL DEFAULT 80000,
  prazo_meses INTEGER NOT NULL DEFAULT 72,
  tipo_veiculo TEXT NOT NULL DEFAULT 'Carro Zero Km',
  parcela_estimada NUMERIC DEFAULT 0,
  melhor_horario TEXT DEFAULT 'Qualquer',
  status TEXT NOT NULL DEFAULT 'novo',
  observacoes TEXT,
  documento_url TEXT
);

-- 2. Índices para performance nas consultas
CREATE INDEX IF NOT EXISTS idx_consorcio_email ON public.consorcio_inscricoes(email);
CREATE INDEX IF NOT EXISTS idx_consorcio_telefone ON public.consorcio_inscricoes(telefone);
CREATE INDEX IF NOT EXISTS idx_consorcio_created_at ON public.consorcio_inscricoes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consorcio_status ON public.consorcio_inscricoes(status);

-- 3. Habilitação de RLS na tabela de inscrições
ALTER TABLE public.consorcio_inscricoes ENABLE ROW LEVEL SECURITY;

-- 4. Política: Permitir inserção pública de inscrições (Visitantes anônimos)
DROP POLICY IF EXISTS "Permitir inscricao publica" ON public.consorcio_inscricoes;
CREATE POLICY "Permitir inscricao publica"
ON public.consorcio_inscricoes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Política: Permitir leitura das inscrições para o painel
DROP POLICY IF EXISTS "Permitir leitura de inscricoes" ON public.consorcio_inscricoes;
CREATE POLICY "Permitir leitura de inscricoes"
ON public.consorcio_inscricoes
FOR SELECT
TO anon, authenticated
USING (true);

-- 6. Política: Permitir atualização de status
DROP POLICY IF EXISTS "Permitir atualizacao de status" ON public.consorcio_inscricoes;
CREATE POLICY "Permitir atualizacao de status"
ON public.consorcio_inscricoes
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 7. Política: Permitir exclusão de registros
DROP POLICY IF EXISTS "Permitir exclusao de inscricoes" ON public.consorcio_inscricoes;
CREATE POLICY "Permitir exclusao de inscricoes"
ON public.consorcio_inscricoes
FOR DELETE
TO anon, authenticated
USING (true);


-- ------------------------------------------------------------
-- PARTE 2: BUCKET DE ARMAZENAMENTO (STORAGE) E POLÍTICAS DE ARQUIVOS
-- ------------------------------------------------------------

-- 8. Criação do Bucket de Armazenamento para Documentos de Consórcio
-- (CNH, RG, Comprovantes de Renda ou Residência)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos-consorcio',
  'documentos-consorcio',
  true,
  10485760, -- Limite de 10MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- NOTA: storage.objects já possui RLS ativado nativamente pelo Supabase.
-- Não execute "ALTER TABLE storage.objects", pois o usuário 'postgres' não é o dono da tabela.

-- 9. POLÍTICA DE ARMAZENAMENTO: UPLOAD (INSERT)
-- Permite que visitantes façam upload de documentos no bucket 'documentos-consorcio'
DROP POLICY IF EXISTS "Permitir upload publico em documentos-consorcio" ON storage.objects;
CREATE POLICY "Permitir upload publico em documentos-consorcio"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'documentos-consorcio'
);

-- 10. POLÍTICA DE ARMAZENAMENTO: LEITURA / DOWNLOAD (SELECT)
-- Permite leitura e visualização de arquivos do bucket de documentos
DROP POLICY IF EXISTS "Permitir visualizacao publica de documentos-consorcio" ON storage.objects;
CREATE POLICY "Permitir visualizacao publica de documentos-consorcio"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'documentos-consorcio'
);

-- 11. POLÍTICA DE ARMAZENAMENTO: ATUALIZAÇÃO (UPDATE)
DROP POLICY IF EXISTS "Permitir atualizacao em documentos-consorcio" ON storage.objects;
CREATE POLICY "Permitir atualizacao em documentos-consorcio"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (
  bucket_id = 'documentos-consorcio'
)
WITH CHECK (
  bucket_id = 'documentos-consorcio'
);

-- 12. POLÍTICA DE ARMAZENAMENTO: EXCLUSÃO (DELETE)
DROP POLICY IF EXISTS "Permitir exclusao em documentos-consorcio" ON storage.objects;
CREATE POLICY "Permitir exclusao em documentos-consorcio"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (
  bucket_id = 'documentos-consorcio'
);
`;
}

export async function uploadDocumentToSupabase(file: File): Promise<{
  success: boolean;
  publicUrl?: string;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase não configurado. O arquivo será ignorado ou gravado localmente.',
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `inscricoes/${fileName}`;

    const { data, error } = await client.storage
      .from('documentos-consorcio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        message: `Erro ao fazer upload no bucket: ${error.message}`,
      };
    }

    const { data: publicUrlData } = client.storage
      .from('documentos-consorcio')
      .getPublicUrl(filePath);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      message: 'Documento enviado com sucesso para o Supabase Storage!',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro no envio do documento';
    return {
      success: false,
      message: `Falha: ${msg}`,
    };
  }
}

export function exportLeadsToCSV(leads: ConsortiumLead[]): void {
  const headers = [
    'ID',
    'Data de Inscrição',
    'Nome Completo',
    'E-mail',
    'Telefone',
    'Valor da Carta (R$)',
    'Prazo (Meses)',
    'Tipo de Veículo',
    'Parcela Estimada (R$)',
    'Melhor Horário',
    'Status',
    'Origem',
    'Observações',
  ];

  const rows = leads.map((l) => [
    l.id,
    new Date(l.created_at).toLocaleString('pt-BR'),
    `"${l.nome.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${l.telefone.replace(/"/g, '""')}"`,
    l.valor_carta.toFixed(2),
    l.prazo_meses,
    `"${l.tipo_veiculo.replace(/"/g, '""')}"`,
    l.parcela_estimada.toFixed(2),
    `"${(l.melhor_horario || '').replace(/"/g, '""')}"`,
    l.status,
    l.origem || 'local',
    `"${(l.observacoes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' +
    [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `inscricoes_consorcio_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
