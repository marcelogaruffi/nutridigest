import React from 'react';
import { ActiveTab } from '../types';
import { BookOpen, Sparkles, CalendarDays, FileText, Plus, AlertCircle, Utensils } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenAddMeal: () => void;
  onOpenAddSymptom: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddMeal,
  onOpenAddSymptom,
}) => {
  return (
    <>
      {/* Floating Action Buttons for Fast Logging */}
      <div className="fixed bottom-20 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 flex justify-end gap-2 pointer-events-auto">
          {/* Quick Add Meal */}
          <button
            onClick={onOpenAddMeal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <Utensils className="w-4 h-4" />
            <span>+ Refeição</span>
          </button>

          {/* Quick Add Symptom */}
          <button
            onClick={onOpenAddSymptom}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-lg shadow-rose-500/30 active:scale-95 transition-all animate-pulse"
          >
            <AlertCircle className="w-4 h-4" />
            <span>+ Sintoma</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-1.5 px-2">
          {/* Diário */}
          <button
            onClick={() => onChangeTab('diario')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'diario'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === 'diario' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[11px] mt-0.5">Diário</span>
          </button>

          {/* Gatilhos / Correlações */}
          <button
            onClick={() => onChangeTab('correlacoes')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
              activeTab === 'correlacoes'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeTab === 'correlacoes' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[11px] mt-0.5">Gatilhos</span>
          </button>

          {/* Calendário */}
          <button
            onClick={() => onChangeTab('calendario')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'calendario'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <CalendarDays className={`w-5 h-5 ${activeTab === 'calendario' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[11px] mt-0.5">Calendário</span>
          </button>

          {/* Relatório */}
          <button
            onClick={() => onChangeTab('relatorio')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'relatorio'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className={`w-5 h-5 ${activeTab === 'relatorio' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[11px] mt-0.5">Relatório</span>
          </button>
        </div>
      </nav>
    </>
  );
};
