import React, { useState } from 'react';
import { ChevronDown, BookOpen, Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Education: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: "regression",
      title: "What is Linear Regression?",
      icon: <BookOpen size={16} className="text-brand-indigo" />,
      content: (
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed font-inter">
          <p>
            Multiple Linear Regression is a supervised learning algorithm that models the linear relationship between a dependent target variable (house values) and multiple independent features (income, location, rooms).
          </p>
          <p>
            The algorithm seeks to fit a hyperplane that minimizes the sum of squared differences (residuals) between predicted and actual values. The mathematical formula is defined as:
          </p>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-brand-border font-mono text-xs text-brand-indigo text-center">
            {"y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε"}
          </div>
          <p>
            Where <code className="text-white">y</code> is the estimated value, <code className="text-white">β₀</code> is the intercept, <code className="text-white">β₁..βₙ</code> represent coefficients, and <code className="text-white">ε</code> represents residual error.
          </p>
        </div>
      )
    },
    {
      id: "dataset",
      title: "Dataset Origin & Census Metrics",
      icon: <Info size={16} className="text-brand-indigo" />,
      content: (
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed font-inter">
          <p>
            The California Housing Dataset is based on data collected during the **1990 U.S. Census**. It represents 20,640 block groups (districts) in California.
          </p>
          <p>
            Each district contains features summarizing demographic attributes like median block income, residential density, coordinates, structural counts, and average family sizes.
          </p>
          <p className="text-xs text-slate-500 italic">
            Note: Target values are capped at $500,000 (5.0 on index scale). This ceiling acts as a restriction, meaning properties that would market higher are predicted lower.
          </p>
        </div>
      )
    },
    {
      id: "assumptions",
      title: "Mathematical Assumptions",
      icon: <CheckCircle2 size={16} className="text-brand-indigo" />,
      content: (
        <div className="space-y-2 text-sm text-slate-400 leading-relaxed font-inter">
          <p>Ordinary Least Squares (OLS) models depend on specific criteria to qualify as unbiased estimators (BLUE):</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 mt-2">
            <li><strong className="text-white">Linearity:</strong> The relationship between inputs and targets is linear.</li>
            <li><strong className="text-white">Homoscedasticity:</strong> Variance of error terms remains constant across features.</li>
            <li><strong className="text-white">Independence:</strong> Observations are statistically independent.</li>
            <li><strong className="text-white">No Multicollinearity:</strong> Predictor features are not highly correlated.</li>
          </ul>
        </div>
      )
    },
    {
      id: "limitations",
      title: "Limitations & Real-World Caveats",
      icon: <AlertTriangle size={16} className="text-brand-indigo" />,
      content: (
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed font-inter">
          <p>
            While OLS offers high interpretability, linear estimators suffer from underfitting complex geographic contours or real-estate bubbles:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Cannot model non-linear terms without manual polynomial expansion.</li>
            <li>Highly sensitive to outliers and leverage points.</li>
            <li>Does not account for qualitative parameters like building layout, interior conditions, school rankings, or current interest rates.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 select-none">
      <div>
        <h3 className="text-xl font-bold font-outfit text-white mb-1">Educational Platform</h3>
        <p className="text-sm text-slate-400">
          Learn how regression equations are structured, and understand the limits of linear estimates.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sec) => {
          const isOpen = openSection === sec.id;
          return (
            <div 
              key={sec.id}
              className="rounded-xl border border-brand-border bg-slate-900/20 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-brand-border">
                    {sec.icon}
                  </div>
                  <span className="font-outfit font-semibold text-sm text-slate-200">{sec.title}</span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="text-slate-500" size={16} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-brand-border bg-slate-900/30">
                      {sec.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
