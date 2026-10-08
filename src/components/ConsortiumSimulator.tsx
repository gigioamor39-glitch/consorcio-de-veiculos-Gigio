import React, { useState } from 'react';
import {
  Car,
  Calculator,
  Send,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  Clock,
  Coins,
  TrendingDown,
  Database,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { VehicleType, ConsortiumLead } from '../types/consortium';
import { submitRegistration, uploadDocumentToSupabase } from '../services/supabase';
import { Upload, FileCheck, Paperclip } from 'lucide-react';

interface SimulatorProps {
  onLeadSubmitted: (lead: ConsortiumLead, source: 'supabase' | 'local') => void;
  onOpenSupabaseModal: () => void;
}

const VEHICLE_OPTIONS: { type: VehicleType; label: string; min: number; max: number; popular: number }[] = [
  { type: 'Carro Zero Km', label: 'Carro 0km', min: 60000, max: 200000, popular: 90000 },
  { type: 'Carro Seminovo', label: 'Seminovo', min: 40000, max: 150000, popular: 65000 },
  { type: 'SUV / Crossover', label: 'SUV / Crossover', min: 90000, max: 260000, popular: 140000 },
  { type: 'Picape / Utilitário', label: 'Picape / Trabalho', min: 110000, max: 320000, popular: 180000 },
  { type: 'Moto de Alta Cilindrada', label: 'Moto Premium', min: 35000, max: 120000, popular: 55000 },
];

const PRESET_PLANS = [
  { valor: 60000, label: 'R$ 60 Mil' },
  { valor: 90000, label: 'R$ 90 Mil' },
  { valor: 120000, label: 'R$ 120 Mil' },
  { valor: 160000, label: 'R$ 160 Mil' },
  { valor: 220000, label: 'R$ 220 Mil' },
];

const MONTHS_OPTIONS = [36, 48, 60, 72, 84, 100];

export const ConsortiumSimulator: React.FC<SimulatorProps> = ({
  onLeadSubmitted,
  onOpenSupabaseModal,
}) => {
  // Simulator State
  const [valorCarta, setValorCarta] = useState<number>(100000);
  const [prazoMeses, setPrazoMeses] = useState<number>(72);
  const [tipoVeiculo, setTipoVeiculo] = useState<VehicleType>('Carro Zero Km');

  // Form State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [melhorHorario, setMelhorHorario] = useState('Qualquer');
  const [observacoes, setObservacoes] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [aceitouTermos, setAceitouTermos] = useState(true);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Financial calculations
  // Taxa de adm total estimada: ~14.5% no período todo (típica do mercado de consórcio auto)
  // Fundo de reserva: ~1.5%
  // Custo total consórcio: 1.16x valor da carta
  const custoTotalConsorcio = valorCarta * 1.16;
  const parcelaConsorcio = Math.round(custoTotalConsorcio / prazoMeses);

  // Financiamento tradicional bancário de veículo (CET ~ 1.85% a.m. tabela Price)
  // Coeficiente aprox: i / (1 - (1+i)^-n)
  const taxaJurosMensal = 0.0185;
  const parcelaFinanciamento = Math.round(
    (valorCarta * taxaJurosMensal) / (1 - Math.pow(1 + taxaJurosMensal, -prazoMeses))
  );
  const custoTotalFinanciamento = parcelaFinanciamento * prazoMeses;
  const economiaTotal = custoTotalFinanciamento - custoTotalConsorcio;

  // Phone mask helper for Brazilian formats (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);

    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    setTelefone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validations
    if (!nome.trim() || nome.trim().split(' ').length < 2) {
      setErrorMsg('Por favor, informe seu nome completo (nome e sobrenome).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    const digitsOnly = telefone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Por favor, informe um telefone/WhatsApp válido com DDD (mínimo 10 dígitos).');
      return;
    }

    if (!aceitouTermos) {
      setErrorMsg('É necessário concordar com os termos para prosseguir.');
      return;
    }

    setIsSubmitting(true);

    try {
      let docUrl: string | undefined = undefined;

      if (documentFile) {
        const uploadRes = await uploadDocumentToSupabase(documentFile);
        if (uploadRes.success && uploadRes.publicUrl) {
          docUrl = uploadRes.publicUrl;
        }
      }

      const response = await submitRegistration({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        valor_carta: valorCarta,
        prazo_meses: prazoMeses,
        tipo_veiculo: tipoVeiculo,
        parcela_estimada: parcelaConsorcio,
        melhor_horario: melhorHorario,
        observacoes: observacoes.trim(),
        documento_url: docUrl,
      });

      if (response.success) {
        onLeadSubmitted(response.lead, response.source);
        // Clear form
        setNome('');
        setEmail('');
        setTelefone('');
        setObservacoes('');
        setDocumentFile(null);
      } else {
        setErrorMsg('Não foi possível registrar agora. Tente novamente em alguns instantes.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado na conexão';
      setErrorMsg(`Erro ao salvar inscrição: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="simulador" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Simulador Interativo & Cadastro Oficial</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight [text-wrap:balance]">
            Escolha o valor do seu próximo veículo e faça sua inscrição
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Ajuste a carta de crédito e o prazo abaixo. Preencha seus dados para garantir sua vaga no próximo grupo e enviar seus dados diretamente ao banco de dados Supabase.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Simulator Engine on Left, Lead Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Financial Simulation Engine */}
          <div className="lg:col-span-7 bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-7">
            
            <div>
              <label className="text-xs font-bold text-neutral-700 tracking-wide uppercase mb-3 block">
                1. Categoria do Veículo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VEHICLE_OPTIONS.map((opt) => {
                  const isActive = tipoVeiculo === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        setTipoVeiculo(opt.type);
                        setValorCarta(opt.popular);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left border ${
                        isActive
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/50'
                      }`}
                    >
                      <div className="font-semibold">{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Média R$ {(opt.popular / 1000).toFixed(0)}k
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider: Valor da Carta de Crédito */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-700 tracking-wide uppercase">
                  2. Valor da Carta de Crédito
                </label>
                <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                  R$ {valorCarta.toLocaleString('pt-BR')},00
                </div>
              </div>

              <input
                type="range"
                min={40000}
                max={250000}
                step={5000}
                value={valorCarta}
                onChange={(e) => setValorCarta(Number(e.target.value))}
                className="w-full h-2.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
              />

              <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1.5">
                <span>R$ 40.000</span>
                <span>R$ 150.000</span>
                <span>R$ 250.000</span>
              </div>

              {/* Fast presets */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-[11px] text-neutral-500 self-center mr-1">Atalhos:</span>
                {PRESET_PLANS.map((plan) => (
                  <button
                    key={plan.valor}
                    type="button"
                    onClick={() => setValorCarta(plan.valor)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors ${
                      valorCarta === plan.valor
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {plan.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prazo em Meses */}
            <div>
              <label className="text-xs font-bold text-neutral-700 tracking-wide uppercase mb-3 block">
                3. Prazo do Plano
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {MONTHS_OPTIONS.map((m) => {
                  const isSelected = prazoMeses === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPrazoMeses(m)}
                      className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      {m} meses
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Comparison Box */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <div className="text-xs text-neutral-500 font-medium">Parcela Estimada no Consórcio</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 tabular-nums">
                    R$ {parcelaConsorcio.toLocaleString('pt-BR')}<span className="text-sm font-normal text-neutral-500">/mês</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-400 line-through">Financiamento Bancário</div>
                  <div className="text-lg font-mono font-semibold text-neutral-400 line-through tabular-nums">
                    R$ {parcelaFinanciamento.toLocaleString('pt-BR')}/mês
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  Economia total estimada de juros:
                </span>
                <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                  R$ {economiaTotal.toLocaleString('pt-BR')},00
                </span>
              </div>
              
              <div className="text-[11px] text-neutral-500 leading-tight">
                * Simulação com taxa administrativa média diluída no prazo total, sem juros bancários.
                Poder de compra à vista após contemplação por sorteio ou lance livre.
              </div>
            </div>

          </div>

          {/* Right Column: Registration Form (Nome, E-mail, Telefone) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-lg relative">
            
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-neutral-900">
                  Formulário de Inscrição
                </h3>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Vagas Abertas
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Seus dados serão gravados no banco de dados e um especialista fará o contato com sua proposta personalizada.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field 1: Nome Completo */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva Santos"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Field 2: E-mail */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Field 3: Telefone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Telefone / WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={telefone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Field 4: Melhor Horário */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <label className="col-span-3 text-xs font-semibold text-neutral-800">
                  Melhor Horário para Atendimento
                </label>
                {['Manhã', 'Tarde', 'Noite'].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setMelhorHorario(h)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      melhorHorario === h
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              {/* Field 5: Observações / Modelo de Interesse (Opcional) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Modelo ou Detalhes de Preferência (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tenho R$ 20.000 para dar de lance nos primeiros 2 meses..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-neutral-900 placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* Field 6: Anexo de Documento / CNH (Opcional - Supabase Storage) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
                    Anexar Documento ou CNH (Opcional)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">Supabase Storage</span>
                </label>
                <div className="relative border border-dashed border-neutral-300 rounded-xl p-3 bg-neutral-50 hover:bg-neutral-100/60 transition-colors text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDocumentFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {documentFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold">
                      <FileCheck className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{documentFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocumentFile(null);
                        }}
                        className="text-neutral-400 hover:text-red-500 text-xs ml-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Clique para anexar foto da CNH ou comprovante (PDF/JPG)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary of chosen simulation in the form */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-1">
                <div className="flex justify-between">
                  <span>Carta escolhida:</span>
                  <strong className="text-neutral-900 font-mono">R$ {valorCarta.toLocaleString('pt-BR')},00</strong>
                </div>
                <div className="flex justify-between">
                  <span>Prazo / Categoria:</span>
                  <span className="text-neutral-900 font-medium">{prazoMeses}x · {tipoVeiculo}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold pt-1 border-t border-neutral-200">
                  <span>Parcela prevista:</span>
                  <span className="font-mono">R$ {parcelaConsorcio.toLocaleString('pt-BR')}/mês</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-[11px] text-neutral-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                />
                <span>
                  Concordo em receber o contato da assessoria com a simulação detalhada e autorizo o armazenamento dos dados de acordo com a LGPD.
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gravando no Banco de Dados...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Concluir Inscrição no Consórcio</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onOpenSupabaseModal}
                  className="text-[11px] text-neutral-500 hover:text-neutral-800 underline inline-flex items-center gap-1.5"
                >
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Ver registros no banco de dados Supabase</span>
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
