import React from 'react';
import { isNative } from '../native';
import { Calendar, ChevronLeft, ChevronRight, Download, HelpCircle, Settings } from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenInstallGuide: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onSelectDate,
  onOpenInstallGuide,
  onOpenSettings,
}) => {
  const currentDateObj = new Date(selectedDate + 'T12:00:00');
  const todayStr = new Date().toISOString().split('T')[0];

  const changeDay = (deltaDays: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + deltaDays);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  const formattedDate = currentDateObj.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo / App Name */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <span className="text-xl">🥗</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
              NutriDigest
            </h1>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Controle Alimentar & Sintomas
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {!isNative() && (
          <button
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 active:scale-95 transition-all"
            title="Instalar no Android"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">No Celular</span>
          </button>
          )}
          
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:scale-95 transition-all"
            title="Configurações e Backup"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date navigation bar */}
      <div className="max-w-md mx-auto mt-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
        <button
          onClick={() => changeDay(-1)}
          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
          title="Dia anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
            {formattedDate}
          </span>
          {isToday && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
              Hoje
            </span>
          )}
        </div>

        <button
          onClick={() => changeDay(1)}
          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
          title="Próximo dia"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
