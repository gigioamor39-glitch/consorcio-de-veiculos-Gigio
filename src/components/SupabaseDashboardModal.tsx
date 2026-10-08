import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Trash2,
  Phone,
  Mail,
  Send,
  PlusCircle,
  FileCode,
  Key,
  Layers,
  Sparkles,
  Check,
  Paperclip,
} from 'lucide-react';
import { ConsortiumLead, LeadStatus, SupabaseConfig } from '../types/consortium';
import {
  fetchAllLeads,
  updateLeadStatus,
  deleteLead,
  testSupabaseConnection,
  saveStoredConfig,
  getStoredConfig,
  syncLocalLeadsToSupabase,
  getSqlSchemaScript,
  exportLeadsToCSV,
  submitRegistration,
} from '../services/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadsUpdated: () => void;
}

type TabType = 'tabela' | 'conexao' | 'sql' | 'sincronizar';

export const SupabaseDashboardModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onLeadsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('tabela');
  const [leads, setLeads] = useState<ConsortiumLead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Supabase Config form state
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    tableFound?: boolean;
  }>({ tested: false });
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResultMsg, setSyncResultMsg] = useState<string | null>(null);

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);

  // Load leads and config when opened
  useEffect(() => {
    if (isOpen) {
      loadData();
      const cfg = getStoredConfig();
      setUrlInput(cfg.url || '');
      setKeyInput(cfg.anonKey || '');
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoadingLeads(true);
    try {
      const data = await fetchAllLeads();
      setLeads(data);
      onLeadsUpdated();
    } catch (err) {
      console.error('Erro ao carregar leads:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult({ tested: false });
    try {
      const res = await testSupabaseConnection(urlInput, keyInput);
      setTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        tableFound: res.tableFound,
      });

      if (res.success) {
        saveStoredConfig({
          url: urlInput.trim(),
          anonKey: keyInput.trim(),
          isConnected: true,
          lastChecked: new Date().toISOString(),
        });
        setSaveSuccessMsg('Credenciais salvas com sucesso no aplicativo!');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
        loadData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro na requisição';
      setTestResult({
        tested: true,
        success: false,
        message: `Falha: ${msg}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = () => {
    saveStoredConfig({
      url: urlInput.trim(),
      anonKey: keyInput.trim(),
    });
    setSaveSuccessMsg('Configurações salvas localmente!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    loadData();
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    onLeadsUpdated();
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Tem certeza que deseja remover esta inscrição?')) {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      onLeadsUpdated();
    }
  };

  const handleSyncLeads = async () => {
    setIsSyncing(true);
    setSyncResultMsg(null);
    try {
      const result = await syncLocalLeadsToSupabase();
      setSyncResultMsg(
        `Sincronização concluída! ${result.syncedCount} inscrições enviadas para o Supabase.${
          result.totalErrors > 0 ? ` (${result.totalErrors} erros)` : ''
        }`
      );
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro na sincronização';
      setSyncResultMsg(`Erro: ${msg}. Verifique se a conexão está ativa e a tabela criada.`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleInsertTestLead = async () => {
    try {
      const res = await submitRegistration({
        nome: 'Lead de Teste Supabase',
        email: `teste.${Date.now().toString(36)}@exemplo.com`,
        telefone: '(11) 99999-0000',
        valor_carta: 150000,
        prazo_meses: 72,
        tipo_veiculo: 'SUV / Crossover',
        parcela_estimada: 2350,
        melhor_horario: 'Manhã',
        observacoes: 'Registro gerado pelo painel para validar escrita no banco',
      });
      alert(res.message);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro';
      alert('Falha ao inserir teste: ' + msg);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSqlSchemaScript());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'todos' ? true : lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalValorCartas = leads.reduce((acc, l) => acc + l.valor_carta, 0);
  const leadsSupabaseCount = leads.filter((l) => l.origem === 'supabase').length;
  const leadsLocalCount = leads.filter((l) => l.origem !== 'supabase').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-neutral-300 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <span>Painel do Banco de Dados Supabase</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  consorcio_inscricoes
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Gerencie as inscrições de consórcio e conecte diretamente ao seu projeto Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-neutral-200 bg-neutral-50 flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('tabela')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'tabela'
                ? 'bg-white border-neutral-900 text-neutral-900 shadow-sm'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4 text-neutral-500" />
            <span>Inscrições Recebidas ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conexao')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'conexao'
                ? 'bg-white border-neutral-900 text-neutral-900 shadow-sm'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-600" />
            <span>Configurar Conexão Supabase</span>
            {urlInput && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'bg-white border-neutral-900 text-neutral-900 shadow-sm'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>Script SQL (Criar Tabela)</span>
          </button>

          <button
            onClick={() => setActiveTab('sincronizar')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'sincronizar'
                ? 'bg-white border-neutral-900 text-neutral-900 shadow-sm'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Sincronização & Backup ({leadsLocalCount} pendentes)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          
          {/* TAB 1: TABELA DE LEADS */}
          {activeTab === 'tabela' && (
            <div className="space-y-4">
              
              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500">Total de Cadastros</div>
                  <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">{leads.length}</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500">Volume Total em Cartas</div>
                  <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                    R$ {(totalValorCartas / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500">Gravados no Supabase</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 tabular-nums">{leadsSupabaseCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500">Armazenamento Local</div>
                  <div className="text-xl font-bold font-mono text-amber-600 tabular-nums">{leadsLocalCount}</div>
                </div>
              </div>

              {/* Action and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
                
                <div className="flex flex-1 gap-2 items-center">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, e-mail ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none font-medium text-neutral-700"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="novo">Novos</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="proposta_enviada">Proposta Enviada</option>
                    <option value="aprovado">Aprovados</option>
                    <option value="contemplado">Contemplados</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportLeadsToCSV(leads)}
                    className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                    title="Exportar dados para Excel/CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>

                  <button
                    onClick={loadData}
                    disabled={isLoadingLeads}
                    className="p-2 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                    title="Atualizar lista"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                  </button>
                </div>

              </div>

              {/* Data Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[420px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-semibold sticky top-0 border-b border-neutral-200 z-10">
                      <tr>
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-3">Nome / Contato</th>
                        <th className="py-2.5 px-3">Telefone</th>
                        <th className="py-2.5 px-3">Carta / Prazo</th>
                        <th className="py-2.5 px-3">Parcela</th>
                        <th className="py-2.5 px-3">Veículo</th>
                        <th className="py-2.5 px-3">Origem</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-normal">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-neutral-500">
                            Nenhuma inscrição encontrada com os filtros selecionados.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const dateFormatted = new Date(lead.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                          const cleanPhone = lead.telefone.replace(/\D/g, '');
                          const whatsappMsg = encodeURIComponent(
                            `Olá ${lead.nome}! Sou da equipe AutoPlan Consórcios sobre sua simulação de carta de R$ ${lead.valor_carta.toLocaleString('pt-BR')},00.`
                          );
                          const waLink = `https://wa.me/55${cleanPhone}?text=${whatsappMsg}`;

                          return (
                            <tr key={lead.id} className="hover:bg-neutral-50/80 transition-colors">
                              <td className="py-2.5 px-3 text-neutral-500 font-mono whitespace-nowrap">
                                {dateFormatted}
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-neutral-900">{lead.nome}</div>
                                <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{lead.email}</span>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{lead.telefone}</span>
                                </a>
                              </td>

                              <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                                <span className="font-bold text-neutral-900">
                                  R$ {lead.valor_carta.toLocaleString('pt-BR')}
                                </span>
                                <span className="text-neutral-500 text-[11px] block">{lead.prazo_meses} meses</span>
                              </td>

                              <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700 whitespace-nowrap">
                                R$ {lead.parcela_estimada.toLocaleString('pt-BR')}
                              </td>

                              <td className="py-2.5 px-3 text-neutral-700 whitespace-nowrap">
                                {lead.tipo_veiculo}
                              </td>

                              <td className="py-2.5 px-3 whitespace-nowrap">
                                {lead.origem === 'supabase' ? (
                                  <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                                    <Database className="w-3 h-3" /> Supabase
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-amber-700 font-medium">
                                    Local
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                  className="text-[11px] py-1 px-2 rounded-md font-medium border border-neutral-300 bg-white"
                                >
                                  <option value="novo">Novo</option>
                                  <option value="em_atendimento">Em Atendimento</option>
                                  <option value="proposta_enviada">Proposta Enviada</option>
                                  <option value="aprovado">Aprovado</option>
                                  <option value="contemplado">Contemplado</option>
                                </select>
                              </td>

                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {lead.documento_url && (
                                    <a
                                      href={lead.documento_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                                      title="Visualizar Documento no Supabase Storage"
                                    >
                                      <Paperclip className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700"
                                    title="Abrir WhatsApp com o Lead"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={`mailto:${lead.email}?subject=Simulação Consórcio AutoPlan - Carta R$ ${lead.valor_carta}`}
                                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                                    title="Enviar E-mail"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1.5 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                                    title="Excluir Registro"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CONECTAR SUPABASE */}
          {activeTab === 'conexao' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                  <Database className="w-4 h-4 text-emerald-700" />
                  Conexão Direta com seu Projeto Supabase
                </div>
                <p>
                  Insira abaixo as credenciais do seu projeto Supabase. Os leads enviados no formulário serão gravados automaticamente na tabela <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">consorcio_inscricoes</code>.
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {saveSuccessMsg}
                </div>
              )}

              {testResult.tested && (
                <div
                  className={`p-4 rounded-xl text-xs border ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2 mb-1">
                    {testResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{testResult.success ? 'Conexão Estabelecida!' : 'Falha na Conexão'}</span>
                  </div>
                  <p>{testResult.message}</p>
                </div>
              )}

              <div className="space-y-4 bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Supabase Project URL (URL do Projeto)
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Localize em Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Supabase Anon Public Key (Chave Anônima / Pública)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full p-3 text-xs font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Localize em Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys &gt; anon public
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !urlInput || !keyInput}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testando Conexão...' : 'Testar Conexão em Tempo Real'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    Salvar no Navegador
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertTestLead}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inserir Registro de Teste</span>
                  </button>
                </div>

              </div>

              {/* Instructions Link */}
              <div className="text-xs text-neutral-500 text-center">
                Ainda não tem um projeto no Supabase? Crie gratuitamente em{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold underline inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          )}

          {/* TAB 3: SCRIPT SQL */}
          {activeTab === 'sql' && (
            <div className="max-w-3xl mx-auto space-y-5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span>Script SQL com Políticas de Armazenamento & RLS Ativadas</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-semibold px-2 py-0.5 rounded">
                      Storage + Table RLS
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Este script cria a tabela de inscrições com RLS, o bucket de arquivos <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">documentos-consorcio</code> e todas as políticas de upload/download do Supabase Storage.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código SQL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Informative Security Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Políticas da Tabela (RLS) Ativadas</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Permite inserção pública anônima pelo formulário e leitura/gestão administrativa completa com Row Level Security.
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Políticas de Armazenamento (Storage) Ativadas</span>
                  </div>
                  <div className="text-[11px] text-blue-800">
                    Cria o bucket <code className="font-mono font-semibold">documentos-consorcio</code> e ativa políticas de upload seguro (INSERT, SELECT, UPDATE, DELETE).
                  </div>
                </div>
              </div>

              {/* Step By Step Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1">1. Acesse o Supabase</div>
                  <div className="text-neutral-500">Abra seu projeto no painel oficial do Supabase.</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1">2. Vá em SQL Editor</div>
                  <div className="text-neutral-500">No menu lateral esquerdo, clique no ícone do SQL Editor.</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1">3. Cole e clique em Run</div>
                  <div className="text-neutral-500">Cole o código abaixo e clique no botão verde RUN para executar.</div>
                </div>
              </div>

              {/* Code display */}
              <div className="relative rounded-xl overflow-hidden border border-neutral-300 bg-neutral-900 text-neutral-200 font-mono text-xs p-4 shadow-inner max-h-[360px] overflow-y-auto">
                <pre>{getSqlSchemaScript()}</pre>
              </div>

            </div>
          )}

          {/* TAB 4: SINCRONIZAR & BACKUP */}
          {activeTab === 'sincronizar' && (
            <div className="max-w-xl mx-auto space-y-6">
              
              <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl mx-auto flex items-center justify-center">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900">
                  Sincronização Bidirecional
                </h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  Caso visitantes tenham se inscrito antes de você configurar a chave do Supabase, você pode enviar todos os leads pendentes agora com um clique.
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleSyncLeads}
                    disabled={isSyncing}
                    className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Leads Pendentes com Supabase'}</span>
                  </button>
                </div>
              </div>

              {syncResultMsg && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs">
                  {syncResultMsg}
                </div>
              )}

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Backup Automático Ativo
                </div>
                <p>
                  Mesmo se houver instabilidade ou ausência de conexão temporária com a internet, o sistema armazena com segurança qualquer inscrição realizada para que nenhum lead seja perdido.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sistema AutoPlan Consórcios · Banco Supabase Pronto</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
};
