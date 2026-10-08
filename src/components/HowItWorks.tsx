import React from 'react';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Simulação & Inscrição',
    description:
      'Você define o valor da carta de crédito do carro que deseja e o prazo ideal das parcelas para o seu orçamento mensal.',
  },
  {
    number: '02',
    title: 'Adesão ao Grupo Oficial',
    description:
      'Sua cota ingressa em um grupo oficial de consórcio devidamente fiscalizado pelo Banco Central, com assembleias mensais pré-agendadas.',
  },
  {
    number: '03',
    title: 'Sorteios e Lances Mensais',
    description:
      'Todo mês ocorrem assembleias onde cotistas são contemplados pela Loteria Federal ou por lances livres e embutidos.',
  },
  {
    number: '04',
    title: 'Contemplação & Faturamento',
    description:
      'Ao ser contemplado, você escolhe qualquer carro zero km ou seminovo em qualquer loja ou particular do Brasil e compra à vista.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
            Passo a Passo Transparente
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight [text-wrap:balance]">
            Como funciona o consórcio de veículo do início à entrega da chave
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Sem segredos, burocracia desnecessária ou letras miúdas. Entenda cada etapa da sua jornada até o veículo novo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="font-display text-3xl font-black text-amber-600 font-mono mb-4">
                  {step.number}
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-[11px] font-semibold text-neutral-500">
                <span>Etapa {step.number} de 04</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#simulador"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <span>Iniciar Minha Inscrição Agora</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
