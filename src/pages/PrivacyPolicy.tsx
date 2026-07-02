import React from 'react';
import { ChevronLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrivacyPolicyContent } from '../components/PrivacyPolicyContent';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="pb-32 px-5 pt-8 space-y-8 max-w-md mx-auto min-h-screen text-ink relative">
      <header className="flex items-center gap-4 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink shadow-sm border border-crease-light active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 -ml-1" />
        </button>
        <h1 className="text-2xl font-heading text-ink">Privacy Policy</h1>
      </header>

      <main className="bg-paper-light rounded-[2rem] p-6 shadow-sm border border-crease overflow-hidden relative z-0 mt-4">
        <div className="w-16 h-16 rounded-[1.5rem] bg-paper border border-crease shadow-sm flex items-center justify-center text-accent mb-8 mx-auto">
           <Shield className="w-8 h-8" />
        </div>
        
        <PrivacyPolicyContent />
      </main>
    </div>
  );
}
