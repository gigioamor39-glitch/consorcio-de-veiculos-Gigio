import React from 'react';
import { Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { SupabaseConfig } from '../types/consortium';

interface HeaderProps {
  onOpenSupabaseModal: () => void;
  supabaseConfig: SupabaseConfig;
  leadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSupabaseModal,
  supabaseConfig,
  leadsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element according to Top Bar Contract) */}
        <a href="#" className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
          <span>AutoPlan</span>
          <span className="text-amber-600 font-light text-base">Consórcios</span>
        </a>

        {/* Zone 2: Clean text navigation links (4-5 single-line links) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a href="#simulador" className="hover:text-neutral-900 transition-colors">
            Simulador
          </a>
          <a href="#vantagens" className="hover:text-neutral-900 transition-colors">
            Por Que Consórcio
          </a>
          <a href="#como-funciona" className="hover:text-neutral-900 transition-colors">
            Como Funciona
          </a>
          <a href="#contemplados" className="hover:text-neutral-900 transition-colors">
            Contemplados
          </a>
          <a href="#faq" className="hover:text-neutral-900 transition-colors">
            Dúvidas
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Supabase Database Hub Trigger Button */}
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border-neutral-300"
            title="Acessar o banco de dados e leads do Supabase"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Banco Supabase</span>
            <span className="inline sm:hidden">Supabase</span>
            {leadsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-neutral-200 text-neutral-800 rounded font-mono font-bold">
                {leadsCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <a
            href="#simulador"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <span>Quero me Inscrever</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
