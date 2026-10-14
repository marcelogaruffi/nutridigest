import React from 'react';
import { MealEntry, SymptomEntry } from '../types';
import { MEAL_TYPE_LABELS, SYMPTOM_TYPE_LABELS } from '../storage/db';
import { Clock, Trash2, Utensils, AlertCircle, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface DailyTimelineProps {
  date: string;
  meals: MealEntry[];
  symptoms: SymptomEntry[];
  onDeleteMeal: (id: string) => void;
  onDeleteSymptom: (id: string) => void;
  onOpenAddMeal: () => void;
  onOpenAddSymptom: () => void;
}

type TimelineItem =
  | { kind: 'meal'; data: MealEntry; time: string }
  | { kind: 'symptom'; data: SymptomEntry; time: string };

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  date,
  meals,
  symptoms,
  onDeleteMeal,
  onDeleteSymptom,
  onOpenAddMeal,
  onOpenAddSymptom,
}) => {
  // Combine and sort by time
  const dayMeals = meals.filter((m) => m.date === date);
  const daySymptoms = symptoms.filter((s) => s.date === date);

  const timelineItems: TimelineItem[] = [
    ...dayMeals.map((m) => ({ kind: 'meal' as const, data: m, time: m.time })),
    ...daySymptoms.map((s) => ({ kind: 'symptom' as const, data: s, time: s.time })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  const hasDiarrhea = daySymptoms.some((s) => s.type === 'diarreia');
  const hasSeverePain = daySymptoms.some(
    (s) => s.type === 'colica' && (s.intensity === 'severa' || (s.details.painScale || 0) >= 7)
  );
  const hasGases = daySymptoms.some((s) => s.type === 'gases_pum' || s.type === 'gases_arroto');

  let statusBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300';
  let statusText = 'Dia Tranquilo: Sem sintomas graves registrados';
  let StatusIcon = ShieldCheck;

  if (hasDiarrhea || hasSeverePain) {
    statusBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200';
    statusText = 'Dia com Crise: Registros de diarreia ou dores intensas';
    StatusIcon = HeartPulse;
  } else if (daySymptoms.length > 0 || hasGases) {
    statusBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300';
    statusText = 'Dia com Desconforto: Gases ou incômodos leves a moderados';
    StatusIcon = AlertCircle;
  }

  return (
    <div className="space-y-4 pb-28">
      {/* Resumo visual do dia */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${statusBg}`}>
        <div className="flex items-center gap-2.5">
          <StatusIcon className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs font-bold leading-tight">{statusText}</p>
            <p className="text-[11px] opacity-80">
              {dayMeals.length} refeições e {daySymptoms.length} registros de sintomas
            </p>
          </div>
        </div>
      </div>

      {/* Lista da linha do tempo */}
      {timelineItems.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700/60 text-3xl flex items-center justify-center mx-auto">
            📝
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Nenhum registro neste dia
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Comece registrando o que você comeu ou se está sentindo gases, cólicas ou diarreia.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={onOpenAddMeal}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white shadow-xs"
            >
              + Registrar Refeição
            </button>
            <button
              onClick={onOpenAddSymptom}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white shadow-xs"
            >
              + Registrar Sintoma
            </button>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {timelineItems.map((item, idx) => {
            if (item.kind === 'meal') {
              const meal = item.data;
              const meta = MEAL_TYPE_LABELS[meal.type];
              return (
                <div key={meal.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-3 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] text-white">
                    🍽️
                  </div>

                  {/* Meal Card */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-emerald-300 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{meta.icon}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {meal.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {meal.time}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteMeal(meal.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                      {meal.items}
                    </p>

                    {/* Tags */}
                    {meal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meal.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              const symptom = item.data;
              const meta = SYMPTOM_TYPE_LABELS[symptom.type];
              const isSevere = symptom.intensity === 'severa';

              return (
                <div key={symptom.id} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-6 top-3 w-5 h-5 rounded-full ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] text-white ${
                    isSevere ? 'bg-rose-600' : 'bg-amber-500'
                  }`}>
                    ⚠️
                  </div>

                  {/* Symptom Card */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isSevere
                      ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 shadow-xs'
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/50 shadow-xs'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{meta.icon}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {meta.label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {symptom.time}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteSymptom(symptom.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Badges de Origem & Intensidade */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        symptom.intensity === 'severa'
                          ? 'bg-rose-600 text-white'
                          : symptom.intensity === 'moderada'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        Intensidade: {symptom.intensity}
                      </span>

                      {/* Flag de Origem */}
                      {symptom.origin === 'dia_anterior' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300">
                          🔄 Suspeita do dia anterior (ontem)
                        </span>
                      ) : symptom.origin === 'hoje' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300">
                          ⚡ Reflexo de hoje (recente)
                        </span>
                      ) : null}
                    </div>

                    {/* Detalhes específicos */}
                    <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl mb-2">
                      {symptom.type === 'diarreia' && (
                        <p>
                          Bristol <strong>Tipo {symptom.details.bristolType || 6}</strong> •{' '}
                          {symptom.details.bathroomTrips || 1}x hoje •{' '}
                          {symptom.details.urgent ? '🚨 Teve urgência' : 'Sem urgência crítica'}
                        </p>
                      )}
                      {symptom.type === 'gases_pum' && (
                        <p>
                          Odor: <strong>{symptom.details.flatulenceOdor || 'normal'}</strong> •{' '}
                          {symptom.details.trappedGas ? '⚠️ Gases presos com pressão abdominal' : 'Eliminação fácil'}
                        </p>
                      )}
                      {symptom.type === 'gases_arroto' && (
                        <p>
                          {symptom.details.afterMeal ? 'Arrotos pós-refeição' : 'Ao longo do dia'} •{' '}
                          {symptom.details.sourTaste ? '🔥 Gosto ácido/refluxo' : 'Sem refluxo'}
                        </p>
                      )}
                      {symptom.type === 'colica' && (
                        <p>
                          Dor: <strong>{symptom.details.painScale || 5}/10</strong> ({symptom.details.painType || 'espasmo'}) •{' '}
                          Região: {symptom.details.crampRegion?.replace('_', ' ') || 'baixo ventre'}
                        </p>
                      )}
                    </div>

                    {symptom.notes && (
                      <p className="text-[11px] italic text-slate-500 dark:text-slate-400">
                        "{symptom.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
