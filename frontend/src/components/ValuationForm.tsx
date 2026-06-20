import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Info, HelpCircle, DollarSign, Home, Users, MapPin, Sparkles } from 'lucide-react';
import { ModelInput } from '../types';

// Validation Schema using Zod matching backend Pydantic fields
const validationSchema = zod.object({
  MedInc: zod.number().min(0.5).max(15.0),
  HouseAge: zod.number().min(1.0).max(52.0),
  AveRooms: zod.number().min(1.0).max(15.0),
  AveBedrms: zod.number().min(0.5).max(5.0),
  Population: zod.number().min(1).max(40000),
  AveOccup: zod.number().min(1.0).max(10.0),
  Latitude: zod.number().min(32.5).max(42.5),
  Longitude: zod.number().min(-124.5).max(-114.3),
});

interface ValuationFormProps {
  onSubmit: (data: ModelInput) => void;
  isLoading: boolean;
}

// Preset blocks for recruiter/analyst interactive trials
const PRESETS = [
  {
    name: "Beverly Hills Premium Block",
    icon: "💎",
    values: { MedInc: 10.5, HouseAge: 25.0, AveRooms: 7.5, AveBedrms: 1.1, Population: 850.0, AveOccup: 2.8, Latitude: 34.07, Longitude: -118.40 }
  },
  {
    name: "Fresno Residential Block",
    icon: "🚜",
    values: { MedInc: 3.2, HouseAge: 18.0, AveRooms: 5.0, AveBedrms: 1.0, Population: 2100.0, AveOccup: 3.4, Latitude: 36.75, Longitude: -119.78 }
  },
  {
    name: "Sacramento Suburban Block",
    icon: "🌲",
    values: { MedInc: 4.8, HouseAge: 32.0, AveRooms: 5.8, AveBedrms: 1.1, Population: 1450.0, AveOccup: 2.9, Latitude: 38.58, Longitude: -121.49 }
  }
];

export const ValuationForm: React.FC<ValuationFormProps> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, setValue, watch } = useForm<ModelInput>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      MedInc: 3.87,
      HouseAge: 28.0,
      AveRooms: 5.4,
      AveBedrms: 1.1,
      Population: 1425,
      AveOccup: 3.0,
      Latitude: 35.6,
      Longitude: -119.5,
    }
  });

  const values = watch();

  const applyPreset = (presetValues: typeof PRESETS[0]['values']) => {
    Object.entries(presetValues).forEach(([key, val]) => {
      setValue(key as keyof ModelInput, val);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 select-none">
      
      {/* Preset Selector Container */}
      <div className="glass-card p-6 rounded-2xl shadow-glass">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-brand-indigo" size={18} />
          <h3 className="text-sm font-semibold font-outfit text-white uppercase tracking-wider">
            Interactive Preset Scenarios
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p.values)}
              className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-slate-900/40 hover:bg-brand-indigo/10 hover:border-brand-indigo/40 transition-all duration-300 text-left group"
            >
              <div>
                <p className="text-xs text-slate-400 font-medium">Preset</p>
                <h4 className="text-sm text-slate-200 font-semibold font-outfit mt-0.5 group-hover:text-white">{p.name}</h4>
              </div>
              <span className="text-2xl">{p.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Economics & Structural characteristics */}
        <div className="space-y-6">
          <div className="border-b border-brand-border pb-2 flex items-center gap-2 mb-4">
            <DollarSign className="text-brand-indigo" size={18} />
            <h2 className="text-lg font-bold font-outfit text-white">Household & Properties</h2>
          </div>

          {/* Median Income */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Annual Household Income
                <div className="group relative">
                  <HelpCircle size={13} className="text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded bg-slate-950 text-[10px] text-slate-300 border border-brand-border shadow-lg z-50 normal-case font-normal leading-normal">
                    Median household income in tens of thousands of USD (e.g. 3.87 = $38,700).
                  </div>
                </div>
              </label>
              <span className="font-mono text-sm text-brand-indigo font-bold">
                ${(values.MedInc * 10000).toLocaleString()}
              </span>
            </div>
            <Controller
              name="MedInc"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.05"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>

          {/* House Age */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Median House Age
                <div className="group relative">
                  <HelpCircle size={13} className="text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded bg-slate-950 text-[10px] text-slate-300 border border-brand-border shadow-lg z-50 normal-case font-normal leading-normal">
                    Median structural age in census block group. Capped at 52 years.
                  </div>
                </div>
              </label>
              <span className="font-mono text-sm text-slate-200">{values.HouseAge} years</span>
            </div>
            <Controller
              name="HouseAge"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="1"
                  max="52"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>

          {/* Average Rooms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Average Rooms per Home
                <div className="group relative">
                  <HelpCircle size={13} className="text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded bg-slate-950 text-[10px] text-slate-300 border border-brand-border shadow-lg z-50 normal-case font-normal leading-normal">
                    Average rooms per household dwelling (includes kitchens, living spaces).
                  </div>
                </div>
              </label>
              <span className="font-mono text-sm text-slate-200">{values.AveRooms.toFixed(1)} rooms</span>
            </div>
            <Controller
              name="AveRooms"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>

          {/* Average Bedrooms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Average Bedrooms
              </label>
              <span className="font-mono text-sm text-slate-200">{values.AveBedrms.toFixed(1)} bedrooms</span>
            </div>
            <Controller
              name="AveBedrms"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>
        </div>

        {/* Neighborhood & Coordinates characteristics */}
        <div className="space-y-6">
          <div className="border-b border-brand-border pb-2 flex items-center gap-2 mb-4">
            <Users className="text-brand-indigo" size={18} />
            <h2 className="text-lg font-bold font-outfit text-white">Spatial & Demographics</h2>
          </div>

          {/* Block Population */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Neighborhood Population
              </label>
              <span className="font-mono text-sm text-slate-200">{values.Population.toLocaleString()} occupants</span>
            </div>
            <Controller
              name="Population"
              control={control}
              render={({ field }) => (
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="10"
                    max="10000"
                    step="50"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo self-center"
                  />
                  <input
                    type="number"
                    min="1"
                    max="40000"
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    className="w-24 px-3 py-1.5 bg-slate-900 border border-brand-border rounded-lg text-sm font-mono text-slate-200 text-center focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              )}
            />
          </div>

          {/* Average Occupancy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Household Occupancy
              </label>
              <span className="font-mono text-sm text-slate-200">{values.AveOccup.toFixed(1)} people</span>
            </div>
            <Controller
              name="AveOccup"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Latitude Coordinate
              </label>
              <span className="font-mono text-sm text-slate-200">{values.Latitude.toFixed(2)}° N</span>
            </div>
            <Controller
              name="Latitude"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="32.5"
                  max="42.5"
                  step="0.05"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Longitude Coordinate
              </label>
              <span className="font-mono text-sm text-slate-200">{values.Longitude.toFixed(2)}° W</span>
            </div>
            <Controller
              name="Longitude"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min="-124.5"
                  max="-114.3"
                  step="0.05"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Form Submission Button */}
      <div className="flex justify-end pt-4 border-t border-brand-border">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-brand-indigo hover:bg-brand-indigo/90 active:scale-95 transition-all text-white font-bold tracking-wide rounded-xl shadow-glass-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Synthesizing..." : "Evaluate Model Prediction"}
        </button>
      </div>
    </form>
  );
};
