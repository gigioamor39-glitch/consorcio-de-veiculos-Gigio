import React from 'react';
import {
  Percent,
  CheckCircle,
  Coins,
  KeyRound,
  Shield,
  Layers,
  Award,
  TrendingUp,
} from 'lucide-react';

export const WhyConsortium: React.FC = () => {
  return (
    <section id="vantagens" className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold tracking-wide text-amber-700 uppercase mb-2">
            Inteligência Financeira
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight [text-wrap:balance]">
            Por que escolher o consórcio em vez de financiar seu carro?
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Enquanto no financiamento comum você paga até o valor de dois carros e meio devido aos juros compostos, no consórcio seu dinheiro trabalha com planejamento real.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Large Spanning Bento Card - Sem Juros */}
          <div className="md:col-span-7 bg-white rounded-2xl p-7 sm:p-9 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                Zero Juros Compostos: Apenas Taxa de Administração Diluída
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                No financiamento bancário tradicional, as taxas de juros (CET) chegam a 24% a 32% ao ano. No consórcio, não existem juros! Há apenas uma taxa administrativa previsível, diluída ao longo de todos os meses do grupo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
              <div>
                <span className="text-neutral-500 block">Financiamento Bancário</span>
                <span className="text-neutral-900 font-bold font-mono text-base block mt-0.5">2 a 2.5x o valor</span>
                <span className="text-red-700 text-[11px]">Você paga o dobro em juros</span>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <span className="text-neutral-500 block">Consórcio AutoPlan</span>
                <span className="text-emerald-700 font-bold font-mono text-base block mt-0.5">Apenas ~1.15x</span>
                <span className="text-emerald-700 text-[11px]">Economia de dezenas de milhares</span>
              </div>
            </div>
          </div>

          {/* Card 2: Poder de Compra à Vista */}
          <div className="md:col-span-5 bg-white rounded-2xl p-7 sm:p-9 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900 mb-3">
                Poder de Negociação à Vista
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Quando contemplado, o valor total da sua carta de crédito é disponibilizado para compra à vista na concessionária ou revendedora. Isso permite negociar descontos expressivos de 5% a 12% no preço do veículo.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
              Negocie como se tivesse o dinheiro vivo em mãos no showroom.
            </div>
          </div>

          {/* Card 3: Lance Livre e Lance Embutido */}
          <div className="md:col-span-4 bg-white rounded-2xl p-7 border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
              Lance Livre & Lance Embutido
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Não quer esperar apenas o sorteio? Você pode ofertar lances mensais com recursos próprios ou utilizar até 30% da própria carta como lance embutido para antecipar sua retirada.
            </p>
          </div>

          {/* Card 4: Flexibilidade de Escolha */}
          <div className="md:col-span-4 bg-white rounded-2xl p-7 border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
              Liberdade Total de Escolha
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Você não fica preso a uma marca ou modelo específico. Na contemplação, utilize sua carta para carros zero km ou seminovos com até 5 anos de uso de qualquer montadora.
            </p>
          </div>

          {/* Card 5: Proteção pelo Banco Central */}
          <div className="md:col-span-4 bg-white rounded-2xl p-7 border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
              Segurança Jurídica BACEN
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              O sistema de consórcios no Brasil é regulado pela Lei nº 11.795/2008 e fiscalizado diretamente pelo Banco Central do Brasil, garantindo total transparência e integridade do seu patrimônio.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
