import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from 'lucide-react';
import { Contributor } from '../types';

interface ExplainabilityProps {
  contributors: Contributor[];
}

export const Explainability: React.FC<ExplainabilityProps> = ({ contributors }) => {
  // Map data structure for horizontal Recharts display
  const chartData = contributors.map((c) => ({
    name: c.feature,
    contribution: parseFloat(c.contribution.toFixed(4)),
    label: c.feature
  }));

  return (
    <div className="space-y-8 select-none">
      <div>
        <h3 className="text-xl font-bold font-outfit text-white mb-1">Why This Estimate?</h3>
        <p className="text-sm text-slate-400">
          This explanation breaks down the raw coefficients of our Ordinary Least Squares (OLS) model. 
          The values display how far this district's inputs deviate from California's statistical baseline averages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ranked contributing cards */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Attribute Influence Metrics
          </h4>
          
          <div className="space-y-3">
            {contributors.map((c) => {
              const absVal = Math.abs(c.contribution);
              let icon = <Minus className="text-slate-500" size={16} />;
              let badgeColor = "bg-slate-900/40 text-slate-400 border-slate-800";
              let label = "Neutral Influence";

              if (c.impact === "positive" && absVal > 0.01) {
                icon = <ArrowUpRight className="text-brand-teal" size={16} />;
                badgeColor = "bg-brand-teal/10 text-brand-teal border-brand-teal/20";
                label = "Increases Value";
              } else if (c.impact === "negative" && absVal > 0.01) {
                icon = <ArrowDownRight className="text-brand-pink" size={16} />;
                badgeColor = "bg-brand-pink/10 text-brand-pink border-brand-pink/20";
                label = "Decreases Value";
              }

              return (
                <div 
                  key={c.feature}
                  className="flex items-start gap-4 p-4 rounded-xl border border-brand-border bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
                >
                  <div className={`p-2.5 rounded-lg border ${badgeColor} self-center`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold font-outfit text-slate-200">{c.feature}</span>
                      <span className="font-mono text-xs text-slate-400">
                        {c.contribution > 0 ? "+" : ""}{c.contribution.toFixed(4)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Weights Chart */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-glass">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Linear Coefficients Breakdown
              </h4>
              <div className="flex gap-4 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-brand-teal" /> Positive impact</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-brand-pink" /> Negative impact</span>
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis 
                    type="number" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                    axisLine={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'Outfit' }}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0f1d',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.contribution >= 0 ? 'rgba(20, 184, 166, 0.8)' : 'rgba(236, 72, 153, 0.8)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg border border-brand-border bg-slate-900/50">
            <AlertCircle className="text-brand-indigo shrink-0" size={16} />
            <p className="text-[11px] text-slate-400 leading-normal">
              Linear coefficients express the change in predicted median value ($100k scale) per unit increase 
              in the respective feature, assuming all other factors remain constant.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
