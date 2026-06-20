import React, { useState, useEffect } from 'react';
import { ValuationForm } from '../components/ValuationForm';
import { Explainability } from '../components/Explainability';
import { CaliforniaMap } from '../components/CaliforniaMap';
import { Education } from '../components/Education';
import { usePrediction } from '../hooks/usePrediction';
import { ModelInput, PredictionResponse } from '../types';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Compass, HelpCircle, Layers, CheckCircle } from 'lucide-react';
import { FADE_IN } from '../utils/motionConfig';

export const Dashboard: React.FC = () => {
  const { mutate: predict, isLoading: isPredicting, data: result } = usePrediction();
  const [currentInput, setCurrentInput] = useState<ModelInput | null>(null);
  
  // Cinematic prediction loader steps state
  const [loaderStep, setLoaderStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'explain' | 'map'>('details');

  const handleFormSubmit = (data: ModelInput) => {
    setCurrentInput(data);
    setLoaderStep(1);
    
    // Staged timing: Step 1 (0ms) -> Step 2 (600ms) -> Step 3 (1200ms) -> API execution (1800ms)
    setTimeout(() => setLoaderStep(2), 600);
    setTimeout(() => setLoaderStep(3), 1200);
    setTimeout(() => {
      predict(data);
      setLoaderStep(0); // clear loader when results load
    }, 1800);
  };

  // Helper to format price values
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Export triggers using POST payload and Blob download
  const handleExport = async (type: 'pdf' | 'csv') => {
    if (!currentInput) return;
    try {
      const response = await api.post(`/export/${type}`, currentInput, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] as string });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `valuation_report.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Error generating export file: " + err);
    }
  };

  // Custom animated count-up for estimated valuation
  const AnimatedValuation: React.FC<{ value: number }> = ({ value }) => {
    const [count, setCount] = useState<number>(value * 0.7);

    useEffect(() => {
      let start = value * 0.7;
      const end = value;
      const duration = 1200; // ms
      const increment = (end - start) / (duration / 16); // ~60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return <span>{formatPrice(count)}</span>;
  };

  return (
    <motion.div 
      variants={FADE_IN as any}
      initial="initial"
      animate="animate"
      className="space-y-12 select-none pb-20"
    >
      {/* Top Title Description */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
          District Valuation Simulator
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Enter socioeconomic variables below to run a Multiple Linear Regression index simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Form inputs (Span 5 on large screen) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-glass">
            <ValuationForm onSubmit={handleFormSubmit} isLoading={isPredicting || loaderStep > 0} />
          </div>
        </div>

        {/* Right Column Results display (Span 7 on large screen) */}
        <div className="lg:col-span-7 space-y-8 min-h-[500px]">
          
          {/* Staged cinematic loaders */}
          <AnimatePresence>
            {loaderStep > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] text-center shadow-glass-glow border-brand-indigo/30"
              >
                <div className="w-10 h-10 rounded-full border-2 border-brand-indigo/20 border-t-brand-indigo animate-spin mb-6" />
                <div className="space-y-3 font-outfit text-sm">
                  <p className={`transition-all duration-300 font-semibold ${loaderStep >= 1 ? 'text-brand-indigo' : 'text-slate-500'}`}>
                    {loaderStep >= 1 ? "✓ Step 1: Analyzing district characteristics..." : "Step 1: Analyzing district characteristics..."}
                  </p>
                  <p className={`transition-all duration-300 font-semibold ${loaderStep >= 2 ? 'text-brand-indigo' : 'text-slate-500'}`}>
                    {loaderStep >= 2 ? "✓ Step 2: Evaluating regional trends..." : "Step 2: Evaluating regional trends..."}
                  </p>
                  <p className={`transition-all duration-300 font-semibold ${loaderStep >= 3 ? 'text-brand-indigo' : 'text-slate-500'}`}>
                    {loaderStep >= 3 ? "✓ Step 3: Generating valuation estimate..." : "Step 3: Generating valuation estimate..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt before simulation */}
          {!result && loaderStep === 0 && (
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] text-center text-slate-500 shadow-glass border-dashed border-brand-border">
              <Compass size={40} className="text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-base font-bold font-outfit text-slate-400">Awaiting Simulator Valuation</h3>
              <p className="text-xs max-w-sm mt-2 leading-relaxed">
                Tune the socio-demographic parameters on the left and click predict to run the California price index projection.
              </p>
            </div>
          )}

          {/* Prediction outputs panel */}
          {result && loaderStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Premium Valuation Result Card */}
              <div className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-glass border-brand-indigo/20">
                {/* Background glow tint */}
                <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-brand-indigo/10 blur-[80px] pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo">
                      Synthesized Market Value
                    </span>
                    <h3 className="text-4xl sm:text-5xl font-extrabold font-outfit text-white mt-1">
                      <AnimatedValuation value={result.estimated_value} />
                    </h3>
                  </div>
                  
                  {/* Segment Badge */}
                  <div className="self-start sm:self-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Market Segment
                    </span>
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/35 shadow-glass-glow uppercase tracking-wider">
                      {result.market_segment}
                    </span>
                  </div>
                </div>

                {/* Additional Metadata indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Confidence Interval
                    </span>
                    <p className="text-sm font-semibold text-slate-200 mt-1 font-mono">
                      ± {formatPrice(result.confidence_interval)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      California Census Median
                    </span>
                    <p className="text-sm font-semibold text-slate-200 mt-1 font-mono">
                      {formatPrice(result.california_median)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Valuation Percentile
                    </span>
                    <p className="text-sm font-semibold text-slate-200 mt-1 font-mono">
                      {result.percentile}% of districts
                    </p>
                  </div>
                </div>

                {/* Export Buttons bar */}
                <div className="flex gap-4 justify-end border-t border-brand-border pt-6 mt-6">
                  <button
                    onClick={() => handleExport('csv')}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border bg-slate-900/40 hover:bg-slate-900 text-xs font-bold tracking-wide rounded-xl text-slate-300 transition-colors"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo hover:bg-brand-indigo/90 text-xs font-bold tracking-wide rounded-xl text-white transition-colors shadow-glass-glow"
                  >
                    <Download size={14} /> Download PDF Report
                  </button>
                </div>
              </div>

              {/* Sub-tabs for Map & Explainability overlays */}
              <div className="glass-card p-6 rounded-2xl shadow-glass">
                <div className="flex border-b border-brand-border pb-4 overflow-x-auto gap-4 mb-6">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
                      activeTab === 'details' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'bg-slate-900/40 text-slate-400 border border-brand-border hover:bg-slate-900'
                    }`}
                  >
                    <Layers size={14} /> Explainability Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
                      activeTab === 'map' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'bg-slate-900/40 text-slate-400 border border-brand-border hover:bg-slate-900'
                    }`}
                  >
                    <Compass size={14} /> Geographical Map
                  </button>
                </div>

                {activeTab === 'details' && (
                  <Explainability contributors={result.contributors} />
                )}

                {activeTab === 'map' && currentInput && (
                  <CaliforniaMap input={currentInput} estimatedValue={result.estimated_value} />
                )}
              </div>

            </motion.div>
          )}

        </div>
      </div>

      {/* Accordion Guide under both columns */}
      <div className="border-t border-brand-border pt-12">
        <Education />
      </div>

    </motion.div>
  );
};
