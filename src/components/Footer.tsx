import React from 'react';
import { Database, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabaseModal }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12 sm:py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <a href="#" className="font-display text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>AutoPlan</span>
              <span className="text-amber-500 font-light text-base">Consórcios</span>
            </a>
            <p className="text-xs text-neutral-400 mt-1 max-w-md">
              Plataforma oficial de simulação e inscrição em consórcios automotivos. Economia real sem juros para aquisição do seu veículo novo.
            </p>
          </div>

          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 hover:border-neutral-600 transition-all shadow-sm"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Acessar Banco de Dados Supabase</span>
          </button>
        </div>

        {/* Legal & Regulatory Notice */}
        <div className="text-[11px] text-neutral-500 leading-relaxed space-y-2 max-w-4xl">
          <p className="flex items-center gap-1.5 font-medium text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fiscalização & Normas Legais</span>
          </p>
          <p>
            O sistema de consórcios é regulamentado e fiscalizado pelo Banco Central do Brasil (BACEN) sob a Lei Federal nº 11.795/2008 e Circulares vigentes. As contemplações ocorrem por sorteio baseado na Loteria Federal ou pela oferta de lances livres e embutidos em assembleias mensais.
          </p>
          <p>
            Valores de parcelas e taxas de administração calculados são simulações de referência e podem variar conforme regras específicas do grupo no momento da adesão formal.
          </p>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} AutoPlan Consórcios Automotivos. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#simulador" className="hover:text-white transition-colors">Simulador</a>
            <span>·</span>
            <a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a>
            <span>·</span>
            <a href="#faq" className="hover:text-white transition-colors">Ajuda</a>
            <span>·</span>
            <button onClick={onOpenSupabaseModal} className="hover:text-emerald-400 transition-colors">
              Supabase Lead Manager
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
