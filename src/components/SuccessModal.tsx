import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  X,
  Share2,
  PhoneCall,
  Database,
  Calendar,
  Car,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ConsortiumLead } from '../types/consortium';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ConsortiumLead | null;
  source: 'supabase' | 'local';
  onOpenSupabaseModal: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  lead,
  source,
  onOpenSupabaseModal,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97706', '#059669', '#2563eb', '#10b981'],
        });
      } catch (err) {
        // fallback if canvas-confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const protocolo = lead.id.toUpperCase().replace('LEAD-', 'CONS-2026-');

  // WhatsApp link preparation
  const encodedMsg = encodeURIComponent(
    `Olá! Acabei de me inscrever no Consórcio de Veículos AutoPlan com o protocolo *#${protocolo}*.\n\n` +
      `*Nome:* ${lead.nome}\n` +
      `*Carta de Crédito:* R$ ${lead.valor_carta.toLocaleString('pt-BR')},00\n` +
      `*Prazo:* ${lead.prazo_meses} meses\n` +
      `*Veículo:* ${lead.tipo_veiculo}\n` +
      `Gostaria de receber a simulação oficial detalhada no meu WhatsApp!`
  );

  const cleanPhone = lead.telefone.replace(/\D/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5511999998888&text=${encodedMsg}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with success badge */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-black text-neutral-900">
            Inscrição Realizada com Sucesso!
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600">
            Parabéns, <strong>{lead.nome}</strong>. Sua vaga preliminar no próximo grupo de consórcio foi registrada.
          </p>
        </div>

        {/* Voucher / Protocol Ticket Card */}
        <div className="bg-neutral-50 rounded-xl p-4 sm:p-5 border border-neutral-200 mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
            <span className="text-neutral-500 font-medium">Protocolo Oficial:</span>
            <span className="font-mono font-bold text-neutral-900 bg-neutral-200/80 px-2.5 py-1 rounded">
              #{protocolo}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-500 block">Carta Solicitada:</span>
              <strong className="text-neutral-900 font-mono text-sm">
                R$ {lead.valor_carta.toLocaleString('pt-BR')},00
              </strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Prazo Escolhido:</span>
              <strong className="text-neutral-900 font-mono text-sm">
                {lead.prazo_meses} meses
              </strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Categoria:</span>
              <span className="text-neutral-800 font-medium">{lead.tipo_veiculo}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Parcela Estimada:</span>
              <strong className="text-emerald-700 font-mono text-sm">
                R$ {lead.parcela_estimada.toLocaleString('pt-BR')}/mês
              </strong>
            </div>
          </div>

          {/* Database status banner */}
          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-600">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Armazenamento:</span>
            </div>
            {source === 'supabase' ? (
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                ● Gravado no Supabase
              </span>
            ) : (
              <span className="font-medium text-amber-700 flex items-center gap-1">
                ● Salvo localmente (Pronto para sync)
              </span>
            )}
          </div>
        </div>

        {/* Next Steps & Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Falar no WhatsApp com o Consultor Agora</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSupabaseModal();
              }}
              className="flex-1 py-2.5 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-neutral-600" />
              <span>Ver no Banco de Dados</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
