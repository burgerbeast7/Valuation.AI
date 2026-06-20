import React, { useState } from 'react';
import { useMetrics, useModelInfo } from '../hooks/useMetrics';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  ReferenceLine
} from 'recharts';
import { BarChart2, ShieldAlert, GitCommit, ListOrdered, Grid3X3, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { FADE_IN } from '../utils/motionConfig';

export const Analytics: React.FC = () => {
  const { data: metrics, isLoading: isMetricsLoading, error: metricsError } = useMetrics();
  const { data: info, isLoading: isInfoLoading } = useModelInfo();
  
  const [activeTab, setActiveTab] = useState<'metrics' | 'importance' | 'residuals' | 'heatmap'>('metrics');

  if (isMetricsLoading || isInfoLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 select-none">
        <div className="w-12 h-12 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
        <p className="text-sm text-slate-400 font-outfit">Loading statistical intelligence datasets...</p>
      </div>
    );
  }

  if (metricsError || !metrics) {
    return (
      <div className="p-8 border border-brand-pink/20 bg-brand-pink/5 rounded-2xl text-center max-w-xl mx-auto my-12 select-none">
        <ShieldAlert className="text-brand-pink mx-auto mb-4" size={32} />
        <h3 className="text-lg font-bold font-outfit text-white">Metrics Server Unreachable</h3>
        <p className="text-sm text-slate-400 mt-2">
          Could not load model benchmarks. Ensure the backend FastAPI service is running on port 8000.
        </p>
      </div>
    );
  }

  const { charts } = metrics;

  // Custom cell coloring based on correlation matrix bounds
  const getHeatmapColor = (val: number) => {
    const absVal = Math.abs(val);
    if (val > 0) return `rgba(20, 184, 166, ${absVal * 0.8})`; // Teal for positive corr
    return `rgba(236, 72, 153, ${absVal * 0.8})`; // Pink/Magenta for negative corr
  };

  return (
    <motion.div 
      variants={FADE_IN as any}
      initial="initial"
      animate="animate"
      className="space-y-10 select-none pb-16"
    >
      {/* Top Section Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
          Performance & Model Benchmarks
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Verified statistical outputs of the California Housing predictor model. 
          Evaluation parameters are locked based on train-test splits.
        </p>
      </div>

      {/* Model Specifications & Metadata Panel */}
      {info && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 border border-brand-border bg-slate-900/30 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Algorithm</span>
            <p className="text-sm font-semibold text-white font-outfit mt-1">{info.algorithm}</p>
          </div>
          <div className="p-5 border border-brand-border bg-slate-900/30 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Dataset Source</span>
            <p className="text-sm font-semibold text-white font-outfit mt-1">{info.dataset_name}</p>
          </div>
          <div className="p-5 border border-brand-border bg-slate-900/30 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Sample Matrix</span>
            <p className="text-sm font-semibold text-white font-outfit mt-1">{info.dataset_size.toLocaleString()} Districts</p>
          </div>
          <div className="p-5 border border-brand-border bg-slate-900/30 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Train / Test Split</span>
            <p className="text-sm font-semibold text-white font-outfit mt-1">{info.train_test_split}</p>
          </div>
        </div>
      )}

      {/* OLS Scoreboards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-indigo shadow-glass text-center md:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">R-Squared (R²)</h4>
          <p className="text-3xl font-extrabold font-outfit text-white mt-2 font-mono">
            {metrics.r_squared.toFixed(5)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Explains 57.5% of housing value variance.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-teal shadow-glass text-center md:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Root Mean Sq. Error</h4>
          <p className="text-3xl font-extrabold font-outfit text-white mt-2 font-mono">
            {metrics.rmse.toFixed(4)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Standard deviation of residual error ($100k scale).</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-pink shadow-glass text-center md:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mean Absolute Error</h4>
          <p className="text-3xl font-extrabold font-outfit text-white mt-2 font-mono">
            {metrics.mae.toFixed(4)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Mean absolute margin of error ($53.3k avg).</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-gold shadow-glass text-center md:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mean Squared Error</h4>
          <p className="text-3xl font-extrabold font-outfit text-white mt-2 font-mono">
            {metrics.mse.toFixed(4)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Sum of squared errors penalty benchmark.</p>
        </div>
      </div>

      {/* Tabs selectors for interactive Recharts visualizations */}
      <div className="glass-card p-6 rounded-2xl shadow-glass">
        <div className="flex border-b border-brand-border pb-4 overflow-x-auto gap-4 scrollbar-none mb-6">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'metrics' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'bg-slate-900/40 text-slate-400 border border-brand-border hover:bg-slate-900'
            }`}
          >
            <BarChart2 size={14} /> Actual vs Predicted
          </button>
          <button
            onClick={() => setActiveTab('importance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'importance' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'bg-slate-900/40 text-slate-400 border border-brand-border hover:bg-slate-900'
            }`}
          >
            <ListOrdered size={14} /> Feature Importance
          </button>
          <button
            onClick={() => setActiveTab('residuals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'residuals' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'bg-slate-900/40 text-slate-400 border border-brand-border hover:bg-slate-900'
            }`}
          >
            <GitCommit size={14} /> Residual Error Hist
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'heatmap' ? 'bg-brand-indigo text-white shadow-glass-glow' : 'bg-slate-900/40 text-slate-400 border border-brand-border hover:bg-slate-900'
            }`}
          >
            <Grid3X3 size={14} /> Correlation Heatmap
          </button>
        </div>

        {/* Tab contents panels */}
        <div className="h-96 w-full relative">
          
          {/* Tab 1: Actual vs Predicted Scatter */}
          {activeTab === 'metrics' && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual Value" 
                  unit=" USD"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  label={{ value: 'Actual House Price (USD)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted Value" 
                  unit=" USD"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  label={{ value: 'Predicted House Price (USD)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{
                    backgroundColor: '#0a0f1d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`]}
                />
                <Scatter name="Validation Test Sets" data={charts.actual_vs_predicted} fill="rgba(99, 102, 241, 0.75)" />
                {/* 45-degree reference line representing perfect prediction */}
                <ReferenceLine segment={[{ x: 50000, y: 50000 }, { x: 500000, y: 500000 }]} stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="5 5" />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {/* Tab 2: Feature Importance */}
          {activeTab === 'importance' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.feature_importance}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="feature" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'Outfit' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  label={{ value: 'Absolute OLS Weight Magnitude', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0f1d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                  formatter={(val: number) => [val.toFixed(5), 'Weight']}
                />
                <Bar dataKey="importance" fill="rgba(20, 184, 166, 0.75)" radius={[4, 4, 0, 0]}>
                  {charts.feature_importance.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.coefficient >= 0 ? 'rgba(20, 184, 166, 0.75)' : 'rgba(236, 72, 153, 0.75)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Tab 3: Residuals Histogram */}
          {activeTab === 'residuals' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.error_distribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="bin" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  label={{ value: 'Prediction Deviation / Residual Error (Index Scale)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  label={{ value: 'Error Frequency / Density', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0f1d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Bar dataKey="count" fill="rgba(168, 85, 247, 0.7)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Tab 4: Correlation Matrix Heatmap */}
          {activeTab === 'heatmap' && (
            <div className="absolute inset-0 flex flex-col justify-center items-center overflow-auto px-4">
              <div className="grid grid-cols-8 gap-1.5 min-w-[500px]">
                {charts.correlation_matrix.map((cell, idx) => (
                  <div
                    key={`${cell.x}-${cell.y}-${idx}`}
                    className="flex flex-col items-center justify-center w-[58px] h-[58px] rounded border border-white/5 transition-all relative group cursor-pointer"
                    style={{ backgroundColor: getHeatmapColor(cell.value) }}
                  >
                    <span className="font-mono text-xs font-bold text-white leading-none">
                      {cell.value > 0 ? `+${cell.value.toFixed(1)}` : cell.value.toFixed(1)}
                    </span>
                    
                    {/* Hover Tooltip Overlay */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col bg-slate-950 p-2 border border-brand-border rounded text-[9px] text-slate-300 w-32 shadow-xl z-50 pointer-events-none text-center">
                      <span className="font-semibold text-white uppercase">{cell.x} ↔ {cell.y}</span>
                      <span className="mt-0.5">Correlation: {cell.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-6 justify-center mt-6 text-[10px] font-semibold text-slate-400 uppercase">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-teal/80" /> Positively Correlated</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-pink/80" /> Negatively Correlated</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
