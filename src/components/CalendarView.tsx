import React, { useState } from 'react';
import { MealEntry, SymptomEntry } from '../types';
import { getDailySummaries } from '../storage/db';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  meals: MealEntry[];
  symptoms: SymptomEntry[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onNavigateToDay: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  meals,
  symptoms,
  selectedDate,
  onSelectDate,
  onNavigateToDay,
}) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dailySummaries = getDailySummaries(meals, symptoms);

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Generate grid days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    calendarDays.push(dateStr);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 pb-28">
      {/* Month Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {monthNames[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((w) => (
            <span key={w} className="text-[11px] font-semibold text-slate-400">
              {w}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((dateStr, idx) => {
            if (!dateStr) {
              return <div key={`empty-${idx}`} className="h-12" />;
            }

            const dayNum = parseInt(dateStr.split('-')[2], 10);
            const summary = dailySummaries[dateStr];
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;

            let badgeColor = 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300';
            let dot = null;

            if (summary) {
              if (summary.digestiveScore === 'critico') {
                dot = <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-800" />;
              } else if (summary.digestiveScore === 'atencao') {
                dot = <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-800" />;
              } else if (summary.mealsCount > 0) {
                dot = <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />;
              }
            }

            return (
              <button
                key={dateStr}
                onClick={() => {
                  onSelectDate(dateStr);
                  onNavigateToDay(dateStr);
                }}
                className={`h-12 rounded-2xl flex flex-col items-center justify-center p-1 relative border transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/50 font-bold'
                    : isToday
                    ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-emerald-600'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="text-xs">{dayNum}</span>
                <div className="h-2 flex items-center justify-center mt-1">
                  {dot}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/80 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Dia Tranquilo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Gases / Desconforto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Diarreia / Dor Forte</span>
          </div>
        </div>
      </div>
    </div>
  );
};
