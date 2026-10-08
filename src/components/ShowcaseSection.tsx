import React from 'react';
import { Star, CheckCircle, Car, ArrowRight } from 'lucide-react';
import deliveryImage from '../assets/images/consortium_delivery_1791497023479.jpg';

export const ShowcaseSection: React.FC = () => {
  return (
    <section id="contemplados" className="py-16 sm:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Customer Handover Real Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200 group">
              <img
                src={deliveryImage}
                alt="Cliente recebendo chaves do veículo novo contemplado por consórcio"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm sm:text-base font-medium italic text-neutral-100">
                  "Contemplei no 4º mês com lance embutido de 25%! Peguei meu SUV zero na concessionária sem pagar nem um centavo de juros bancários."
                </blockquote>
                <div className="mt-2 text-xs text-neutral-300 font-semibold">
                  Beatriz Silveira · São Paulo, SP · Carta de R$ 135.000
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quantified Proof & Real Stories */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Casos Reais & Entrega Garantida
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight [text-wrap:balance]">
              Mais de 2.400 veículos entregues nos últimos 12 meses
            </h2>

            <p className="text-base text-neutral-600 leading-relaxed">
              Todos os meses, centenas de participantes realizam o sonho do carro novo através de sorteios da Loteria Federal e lances estratégicos assessorados pela nossa equipe.
            </p>

            {/* Testimonials List */}
            <div className="space-y-4 pt-2">
              
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-neutral-900">Marcos Vinicius Pereira</div>
                  <span className="text-[11px] text-neutral-500">Contemplado em 5 meses</span>
                </div>
                <p className="text-neutral-600">
                  "A simulação no site foi exatamente o que contratei. Minha parcela ficou em R$ 1.480 para uma carta de R$ 90 mil. No banco a parcela seria R$ 2.300 no financiamento."
                </p>
                <div className="text-[11px] text-amber-800 font-medium">
                  Veículo adquirido: Toyota Yaris XLS 0km · Curitiba, PR
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-neutral-900">Juliana & Fernando Costa</div>
                  <span className="text-[11px] text-neutral-500">Contemplados por Sorteio</span>
                </div>
                <p className="text-neutral-600">
                  "Fomos sorteados logo no início! Escolhemos uma picape para nossa empresa rural e conseguimos desconto à vista na concessionária com a carta."
                </p>
                <div className="text-[11px] text-amber-800 font-medium">
                  Veículo adquirido: Ford Ranger XLT · Ribeirão Preto, SP
                </div>
              </div>

            </div>

            <div className="pt-2">
              <a
                href="#simulador"
                className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-amber-700 transition-colors"
              >
                <span>Fazer simulação para o seu próximo carro</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
