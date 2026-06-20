import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldCheck, Database, Compass } from 'lucide-react';
import { FADE_IN } from '../utils/motionConfig';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  // Generate random floating particles for the background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * -20,
  }));

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden select-none">
      
      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-indigo/10 blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Radiant ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-indigo/20 to-brand-purple/5 blur-[120px] pointer-events-none z-0" />

      {/* Main hero card */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Category Chip */}
        <motion.div 
          variants={FADE_IN}
          initial="initial"
          animate="animate"
          transition={{ ...FADE_IN.transition, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-semibold tracking-wider text-brand-indigo uppercase mb-8 shadow-glass"
        >
          <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
          Production-Grade Valuation Model
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={FADE_IN}
          initial="initial"
          animate="animate"
          transition={{ ...FADE_IN.transition, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-outfit text-white mb-6 leading-[1.1] max-w-4xl"
        >
          California Housing <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-indigo">
            Valuation Dashboard
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={FADE_IN}
          initial="initial"
          animate="animate"
          transition={{ ...FADE_IN.transition, delay: 0.3 }}
          className="text-lg md:text-xl font-normal font-inter text-slate-400 mb-10 max-w-3xl leading-relaxed"
        >
          Explore how machine learning estimates housing values using demographic and geographic characteristics derived from California census districts.
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          variants={FADE_IN}
          initial="initial"
          animate="animate"
          transition={{ ...FADE_IN.transition, delay: 0.4 }}
          className="mb-16"
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-dark rounded-xl font-bold tracking-wide hover:bg-slate-100 transition-all duration-300 shadow-glass focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 focus:ring-offset-brand-dark overflow-hidden"
          >
            {/* Hover reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            Start Analysis
            <Play size={18} className="fill-brand-dark transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Mini Features List */}
        <motion.div
          variants={FADE_IN}
          initial="initial"
          animate="animate"
          transition={{ ...FADE_IN.transition, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl border-t border-brand-border pt-12"
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 px-4">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-brand-border">
              <Database className="text-brand-indigo" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold font-outfit text-sm">20,640 Districts</h3>
              <p className="text-xs text-slate-400 mt-1">Trained on the official US Census spatial block group dataset.</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 px-4">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-brand-border">
              <ShieldCheck className="text-brand-teal" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold font-outfit text-sm">Explainable AI</h3>
              <p className="text-xs text-slate-400 mt-1">Interpretable valuations showing OLS feature impact calculations.</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 px-4">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-brand-border">
              <Compass className="text-brand-gold" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold font-outfit text-sm">Spatial Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1">Coordinate indexing mapping predictions directly to locations.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
