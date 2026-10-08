import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowDown, Database, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/hero_car_consortium_1791497003811.jpg';

interface HeroProps {
  onOpenSupabaseModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSupabaseModal }) => {
  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Copy on left, Hero visual asset on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Kicker without pill enclosing */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SISTEMA REGULAMENTADO E FISCALIZADO PELO BANCO CENTRAL DO BRASIL</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.08] [text-wrap:balance]">
              Conquiste seu carro novo <span className="text-amber-600">sem juros</span> de financiamento.
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              Planejamento inteligente para veículos zero km, seminovos e utilitários.
              Cartas de crédito de <strong>R$ 40 mil a R$ 250 mil</strong> com parcelas até 50% menores 
              do que um financiamento bancário e poder de compra à vista no momento da contemplação.
            </p>

            {/* Quick Proof Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="border-l-2 border-amber-500 pl-3">
                <div className="text-xs text-neutral-500 font-medium">Economia Real</div>
                <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">0% Juros</div>
                <div className="text-[11px] text-neutral-500">Apenas taxa adm. diluída</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-xs text-neutral-500 font-medium">Prazos Flexíveis</div>
                <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">36 a 100x</div>
                <div className="text-[11px] text-neutral-500">Parcelas acessíveis</div>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-xs text-neutral-500 font-medium">Lance & Sorteio</div>
                <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">Contemplação</div>
                <div className="text-[11px] text-neutral-500">Mensal com lance embutido</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <a
                href="#simulador"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98]"
              >
                <span>Simular e Fazer Inscrição</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenSupabaseModal}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-sm"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Acessar Banco de Dados Supabase</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sem taxa de adesão antecipada
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Atendimento 100% online
              </span>
            </div>

          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-neutral-100 group">
              <img
                src={heroImage}
                alt="Veículos modernos em rodovia - AutoPlan Consórcio"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle glass overlay card with live simulation teaser */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-900/85 backdrop-blur-md text-white border border-white/10">
                <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Exemplo de Carta Popular
                  </span>
                  <span className="font-mono text-amber-400">R$ 100.000</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums">R$ 1.340</span>
                    <span className="text-xs text-neutral-300 ml-1">/mês em 84x</span>
                  </div>
                  <a
                    href="#simulador"
                    className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    Personalizar →
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
