import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Hero } from './components/Hero';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Layout, BarChart3, Calculator, Home, Github, Linkedin, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Instantiate single React Query client
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'hero' | 'dashboard' | 'analytics'>('hero');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col justify-between font-inter select-none">
        
        {/* Navigation Header Bar */}
        <header className="sticky top-0 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Branding Logo */}
            <button 
              onClick={() => setCurrentPage('hero')} 
              className="flex items-center gap-2 text-white font-extrabold font-outfit tracking-wider text-lg hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="w-6 h-6 rounded-lg bg-brand-indigo flex items-center justify-center font-bold text-sm text-white">V</span>
              VALUATION.AI
            </button>

            {/* Menu options (hidden if on hero/landing page unless requested) */}
            {currentPage !== 'hero' && (
              <nav className="flex items-center gap-2 sm:gap-4 bg-slate-950/60 p-1 border border-brand-border rounded-xl">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${
                    currentPage === 'dashboard' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calculator size={13} /> Evaluate
                </button>
                <button
                  onClick={() => setCurrentPage('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${
                    currentPage === 'analytics' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 size={13} /> Statistics
                </button>
              </nav>
            )}

            {/* GitHub & LinkedIn Socials */}
            <div className="flex items-center gap-3.5">
              <a
                href="https://github.com/burgerbeast7"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github size={17} />
              </a>
              <a
                href="https://www.linkedin.com/in/kunal-chauhan-7a7539287/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin size={17} />
              </a>
              {currentPage === 'hero' && (
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo/90 text-xs font-bold tracking-wide rounded-xl text-white transition-colors shadow-glass-glow"
                >
                  Launch App
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Section Content Area */}
        <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full"
            >
              {currentPage === 'hero' && (
                <Hero onStart={() => setCurrentPage('dashboard')} />
              )}
              {currentPage === 'dashboard' && (
                <Dashboard />
              )}
              {currentPage === 'analytics' && (
                <Analytics />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer info bar */}
        <footer className="border-t border-brand-border bg-slate-950/40 py-8 text-center text-xs text-slate-500 font-mono select-none">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p>© {new Date().getFullYear()} Valuation.AI by <a href="https://www.linkedin.com/in/kunal-chauhan-7a7539287/" target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">Kunal Chauhan</a>. All Rights Reserved.</p>
            <p className="flex justify-center items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal" /> Ordinary Least Squares Model Active
            </p>
          </div>
        </footer>

      </div>
    </QueryClientProvider>
  );
};

export default App;
// Trigger build deploy
