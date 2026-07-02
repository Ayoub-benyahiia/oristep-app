import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Shield, Info, Mail, RotateCcw,
  Trash2, FileText, CheckCircle2, ChevronRight, X, Vibrate
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAchievements } from '../context/AchievementContext';
import { usePaperStash } from '../context/PaperStashContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { PrivacyPolicyContent } from '../components/PrivacyPolicyContent';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4 pt-2">
    <h2 className="text-sm font-bold tracking-widest uppercase text-ink-light px-2">{title}</h2>
    <div className="bg-paper rounded-[2rem] shadow-sm border border-crease overflow-hidden divide-y divide-crease-light">
      {children}
    </div>
  </div>
);

export function Settings() {
  const { data, resetAllProgress, resetFavorites, resetAllData, toggleHaptics } = useProgress();
  const { resetAchievements } = useAchievements();
  const { resetPaperStash } = usePaperStash();
  const { theme, setTheme } = useTheme();

  const [onboardingData, setOnboardingData] = useState<{level: string, interests: string[]} | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oristep:onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completed) {
          setOnboardingData({ level: parsed.level || 'Not set', interests: parsed.interests || [] });
        }
      }
    } catch {}
  }, []);

  const handleResetOnboarding = () => {
    if (window.confirm('Are you sure you want to reset your onboarding preferences? You will be guided through setup again next time.')) {
      try { localStorage.removeItem('oristep:onboarding'); } catch {}
      window.location.href = '/';
    }
  };

  const confirmReset = (action: string, fn: () => void) => {
    if (window.confirm(`Are you sure you want to ${action}? This action cannot be undone.`)) fn();
  };



  return (
    <div className="pb-32 px-5 pt-12 space-y-10 max-w-md mx-auto min-h-screen text-ink">
      <header className="space-y-4">
        <h1 className="text-3xl font-heading text-ink">Settings</h1>
      </header>

      <Section title="Appearance & Experience">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-crease-light">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-bold text-sm text-ink">Theme</p>
              <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Light / Dark</p>
            </div>
          </div>
          <div className="flex bg-paper-light rounded-full p-1 border border-crease-light">
             <button
               onClick={() => setTheme('light')}
               className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", theme === 'light' ? "bg-paper shadow-sm text-ink" : "text-ink-light")}
             >
               Light
             </button>
             <button
               onClick={() => setTheme('dark')}
               className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", theme === 'dark' ? "bg-paper shadow-sm text-ink" : "text-ink-light")}
             >
               Dark
             </button>
          </div>
        </div>
        
        {/* Haptics Toggle */}
        <div className="p-5 flex items-center justify-between hover:bg-paper-light transition-colors cursor-pointer" onClick={toggleHaptics}>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-crease-light">
              <Vibrate className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-ink">Haptic Feedback</p>
              <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Vibrations on action</p>
            </div>
          </div>
          <div className="flex bg-paper-light rounded-full p-1 border border-crease-light">
            <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-300", data.settings?.hapticsEnabled ?? true ? "bg-accent" : "bg-crease")}>
              <motion.div 
                layout
                className="w-5 h-5 bg-paper rounded-full absolute top-[2px] shadow-sm"
                animate={{ left: data.settings?.hapticsEnabled ?? true ? "26px" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Folding Preferences">
        {onboardingData && (
          <>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-ink">Skill Level</p>
                <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">{onboardingData.level}</p>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-ink">Interests</p>
                <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">
                  {onboardingData.interests.length > 0 ? onboardingData.interests.join(', ') : 'None selected'}
                </p>
              </div>
            </div>
          </>
        )}
        <button 
          onClick={handleResetOnboarding}
          className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-crease-light">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-ink">Reset Onboarding</p>
              <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Change preferences</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-light/50" />
        </button>
        <Link to="/stash" className="p-5 flex items-center justify-between hover:bg-paper-light transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-crease-light">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-ink">Paper Stash</p>
              <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Manage your origami paper</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-light/50" />
        </Link>
      </Section>

      <Section title="Data & Storage">
        <button onClick={() => confirmReset('reset your progress', resetAllProgress)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left">
          <div>
            <p className="font-bold text-sm text-ink">Reset Progress</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Clear all started projects</p>
          </div>
          <Trash2 className="w-4 h-4 text-ink-light/70" />
        </button>
        <button onClick={() => confirmReset('clear all favorites', resetFavorites)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left">
          <div>
            <p className="font-bold text-sm text-ink">Reset Favorites</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Remove saved patterns</p>
          </div>
          <Trash2 className="w-4 h-4 text-ink-light/70" />
        </button>
        <button onClick={() => confirmReset('reset your paper stash', resetPaperStash)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left">
          <div>
            <p className="font-bold text-sm text-ink">Reset Paper Stash</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Clear all saved paper</p>
          </div>
          <Trash2 className="w-4 h-4 text-ink-light/70" />
        </button>
        <button onClick={() => confirmReset('reset your achievements', resetAchievements)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left">
           <div>
            <p className="font-bold text-sm text-ink">Reset Achievements</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Clear unlocked badges</p>
          </div>
          <Trash2 className="w-4 h-4 text-ink-light/70" />
        </button>
        <button onClick={() => confirmReset('delete ALL your data', () => { resetAllData(); })} className="w-full p-5 flex items-center justify-between hover:bg-red-500/10 transition-colors text-left">
          <div>
            <p className="font-bold text-sm text-red-600">Reset All Local Data</p>
            <p className="text-[10px] uppercase tracking-widest text-red-500/70 font-bold mt-1">Completely clear everything Oristep</p>
          </div>
          <Trash2 className="w-4 h-4 text-red-500/70" />
        </button>
      </Section>

      <Section title="About App">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-paper-light shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-ink">Oristep</p>
              <p className="text-[10px] uppercase tracking-widest text-ink-light font-bold mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowAbout(true)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left group">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-transparent group-hover:border-crease-light transition-colors">
              <Info className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-ink">About Oristep</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-light/50" />
        </button>
        <button onClick={() => setShowPrivacy(true)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left group">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-transparent group-hover:border-crease-light transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-ink">Privacy Policy</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-light/50" />
        </button>
        <button onClick={() => setShowContact(true)} className="w-full p-5 flex items-center justify-between hover:bg-paper-light transition-colors text-left group">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-paper-light flex items-center justify-center text-ink border border-transparent group-hover:border-crease-light transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-ink">Contact / Feedback</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-light/50" />
        </button>
      </Section>
      
      <p className="text-center text-xs text-ink-light/50 font-medium pb-8 mt-12">Crafted with precision</p>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-paper rounded-[2.5rem] p-8 text-center shadow-2xl border border-crease text-ink"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-[1.5rem] bg-paper-light text-ink flex items-center justify-center shadow-inner border border-crease-light">
                 <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-heading mb-3">Oristep</h2>
              <p className="text-ink-light font-medium text-[15px] leading-relaxed mb-6 px-2">
                A mobile-first origami learning app that loads published folding patterns from Supabase while keeping your personal progress on this device.
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-ink/50 mb-8 px-2">Version 1.0.0</p>
              <button onClick={() => setShowAbout(false)}
                className="w-full py-4 rounded-full bg-ink text-paper-light font-bold tracking-widest uppercase text-xs shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all"
              >Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-paper rounded-[2.5rem] p-8 text-center shadow-2xl border border-crease text-ink relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-accent/10 -z-10" />
              <div className="w-20 h-20 mx-auto mb-6 rounded-[1.5rem] bg-paper text-accent flex items-center justify-center shadow-md border border-crease">
                 <Mail className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-heading mb-3">Get in Touch</h2>
              <p className="text-ink-light font-medium text-[14px] leading-relaxed mb-6 px-2">
                Have questions, feedback, or need help? We'd love to hear from you.
              </p>
              
              <div className="bg-paper-light border border-crease-light rounded-2xl p-4 mb-8">
                <p className="text-[10px] uppercase font-bold tracking-widest text-ink-light mb-2">Email Address</p>
                <a href="mailto:ouhsineabdelali@gmail.com" className="text-[15px] font-bold text-accent break-all hover:underline">
                  ouhsineabdelali@gmail.com
                </a>
              </div>

              <button onClick={() => setShowContact(false)}
                className="w-full py-4 rounded-full bg-ink text-paper-light font-bold tracking-widest uppercase text-xs shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all"
              >Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-paper-light flex flex-col md:rounded-[2.5rem] md:overflow-hidden"
          >
            <div className="shrink-0 w-full px-6 py-5 flex items-center justify-between bg-paper-light/90 backdrop-blur-md z-10 border-b border-crease-light">
               <h2 className="font-heading text-xl text-ink">Privacy Policy</h2>
               <button 
                 onClick={() => setShowPrivacy(false)}
                 className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink shadow-sm border border-crease-light active:scale-95 transition-all"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="max-w-md mx-auto w-full space-y-6 text-[15px] leading-relaxed font-medium text-ink-light">
                <div className="w-16 h-16 rounded-[1.5rem] bg-paper border border-crease shadow-sm flex items-center justify-center text-ink mb-8">
                   <Shield className="w-8 h-8" />
                </div>
                
                <PrivacyPolicyContent />
              </div>
            </div>

            <div className="shrink-0 p-6 bg-paper-light border-t border-crease-light">
              <div className="max-w-md mx-auto w-full">
                <button onClick={() => setShowPrivacy(false)}
                  className="w-full py-4 bg-ink text-paper-light rounded-[1.5rem] font-bold tracking-widest uppercase text-xs shadow-xl border border-crease hover:bg-ink-dark transition-all"
                >Understood</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
