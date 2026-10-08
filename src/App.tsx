import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ConsortiumSimulator } from './components/ConsortiumSimulator';
import { WhyConsortium } from './components/WhyConsortium';
import { HowItWorks } from './components/HowItWorks';
import { ShowcaseSection } from './components/ShowcaseSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SuccessModal } from './components/SuccessModal';
import { SupabaseDashboardModal } from './components/SupabaseDashboardModal';
import { ConsortiumLead, SupabaseConfig } from './types/consortium';
import { getStoredConfig, fetchAllLeads } from './services/supabase';
import { Database, Shield } from 'lucide-react';

export default function App() {
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getStoredConfig());
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [latestLead, setLatestLead] = useState<ConsortiumLead | null>(null);
  const [latestSource, setLatestSource] = useState<'supabase' | 'local'>('local');
  const [leadsCount, setLeadsCount] = useState<number>(0);

  const refreshLeadsCount = async () => {
    try {
      const all = await fetchAllLeads();
      setLeadsCount(all.length);
      setSupabaseConfig(getStoredConfig());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshLeadsCount();
  }, []);

  const handleLeadSubmitted = (lead: ConsortiumLead, source: 'supabase' | 'local') => {
    setLatestLead(lead);
    setLatestSource(source);
    setIsSuccessModalOpen(true);
    refreshLeadsCount();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Navigation conforming to Top Bar Contract */}
      <Header
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        supabaseConfig={supabaseConfig}
        leadsCount={leadsCount}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)} />

        {/* Consortium Simulator & Registration Form (Nome, E-mail, Telefone) */}
        <ConsortiumSimulator
          onLeadSubmitted={handleLeadSubmitted}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        {/* Why Consortium: Bento-Grid financial benefits */}
        <WhyConsortium />

        {/* How it works: 4-step process */}
        <HowItWorks />

        {/* Real Customer Handover Showcase */}
        <ShowcaseSection />

        {/* FAQ Accordion */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)} />

      {/* Floating Supabase Database Quick Access Badge */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-xl border border-neutral-700/80 transition-all hover:scale-105 active:scale-95 text-xs font-bold"
          title="Abrir painel administrativo e banco de dados Supabase"
        >
          <div className="relative">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span>Acesso ao Supabase</span>
          {leadsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
              {leadsCount}
            </span>
          )}
        </button>
      </div>

      {/* Success Voucher Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        lead={latestLead}
        source={latestSource}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Full Supabase Database Management Modal */}
      <SupabaseDashboardModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onLeadsUpdated={refreshLeadsCount}
      />

    </div>
  );
}
