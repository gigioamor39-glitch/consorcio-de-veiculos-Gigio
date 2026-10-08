import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'O consórcio de veículo realmente não tem juros?',
    a: 'Sim, é 100% livre de juros compostos. Diferente dos bancos que cobram juros sobre juros no financiamento tradicional, no consórcio existe apenas uma taxa de administração fixa e pré-definida, diluída igualitariamente em todas as parcelas do plano.',
  },
  {
    q: 'O que é o lance embutido e como ele acelera a retirada do carro?',
    a: 'O lance embutido permite que você use até 25% a 30% do próprio valor da sua carta de crédito como lance na assembleia. Ou seja, você não precisa desembolsar dinheiro do seu bolso para ofertar esse lance; caso seja contemplado, o valor é deduzido do saldo ou das parcelas.',
  },
  {
    q: 'Posso comprar carro seminovo ou apenas zero quilômetro?',
    a: 'Você tem total liberdade! A carta de crédito pode ser usada para carros novos zero km de qualquer marca, ou seminovos com até 5 anos de fabricação, adquiridos de concessionárias, lojas multimarcas ou até de pessoa física após vistoria.',
  },
  {
    q: 'O que acontece se eu for contemplado logo no início do grupo?',
    a: 'Você já pode retirar o veículo imediatamente! O bem fica alienado ao consórcio como garantia e você continua pagando normalmente as parcelas restantes do seu plano, sem qualquer cobrança antecipada de juros.',
  },
  {
    q: 'Como funciona a integração com o banco de dados Supabase deste sistema?',
    a: 'Neste aplicativo, as inscrições feitas no formulário (Nome, E-mail, Telefone, Carta e detalhes) são gravadas diretamente no banco de dados Supabase na tabela `consorcio_inscricoes`. O administrador pode abrir o painel pelo botão "Banco Supabase" no topo para visualizar os cadastros, alterar status, exportar relatórios em CSV e configurar suas credenciais.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight [text-wrap:balance]">
            Perguntas Frequentes sobre Consórcio de Veículos
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Tudo o que você precisa saber antes de fazer sua inscrição no grupo.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-xl overflow-hidden transition-all bg-neutral-50/50"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 text-sm sm:text-base hover:bg-neutral-100/60 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-3 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
