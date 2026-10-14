import React from 'react';
import { MealEntry, SymptomEntry } from '../types';
import { calculateTriggerCorrelations, SYMPTOM_TYPE_LABELS } from '../storage/db';
import { Sparkles, AlertTriangle, CheckCircle2, Info, ArrowRight, ShieldAlert } from 'lucide-react';

interface InsightsViewProps {
  meals: MealEntry[];
  symptoms: SymptomEntry[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ meals, symptoms }) => {
  const correlations = calculateTriggerCorrelations(meals, symptoms);

  const totalSymptoms = symptoms.length;
  const diarrheaCount = symptoms.filter((s) => s.type === 'diarreia').length;
  const gasCount = symptoms.filter((s) => s.type === 'gases_pum' || s.type === 'gases_arroto').length;
  const colicCount = symptoms.filter((s) => s.type === 'colica').length;

  return (
    <div className="space-y-4 pb-28">
      {/* Banner de apresentação */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-5 h-5 text-emerald-200" />
          <h2 className="text-base font-bold">Investigação de Gatilhos Digestivos</h2>
        </div>
        <p className="text-xs text-emerald-50 leading-relaxed">
          O aplicativo cruza os horários das suas refeições com os momentos em que você sentiu cólicas, diarreia e gases, considerando se o sintoma veio de hoje ou do dia anterior.
        </p>
      </div>

      {/* Resumo dos Sintomas */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xl">💩</span>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{diarrheaCount}</p>
          <p className="text-[11px] text-slate-500">Diarreias</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xl">💨</span>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{gasCount}</p>
          <p className="text-[11px] text-slate-500">Gases / Arrotos</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xl">⚡</span>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{colicCount}</p>
          <p className="text-[11px] text-slate-500">Cólicas</p>
        </div>
      </div>

      {/* Ranking de Alimentos Suspeitos */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Alimentos Mais Frequentes Antes dos Sintomas
          </h3>
          <span className="text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-200">
            {correlations.length} suspeitos
          </span>
        </div>

        {correlations.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <Info className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs">
              Ainda não há dados suficientes para cruzar. Continue registrando suas refeições e sintomas por alguns dias!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {correlations.map((item, idx) => {
              const isHigh = item.percentageTrigger >= 60;
              return (
                <div
                  key={item.tag}
                  className={`p-3 rounded-2xl border transition-all ${
                    isHigh
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-700 dark:text-slate-200">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.tag}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isHigh
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {item.percentageTrigger}% de correlação
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2">
                    Consumido <strong>{item.totalTimesConsumed}x</strong> no total, e esteve presente antes de{' '}
                    <strong>{item.timesPrecededSymptoms} episódios</strong> de desconforto.
                  </p>

                  {/* Sintomas relacionados */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(item.relatedSymptoms).map(([stKey, count]) => {
                      const meta = SYMPTOM_TYPE_LABELS[stKey as keyof typeof SYMPTOM_TYPE_LABELS];
                      return (
                        <span
                          key={stKey}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {meta?.icon} {meta?.label.split(' ')[0]} ({count}x)
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guia Clínico: Por que sintomas vêm do dia anterior? */}
      <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
          <span>💡</span> Como Funciona a Digestão & Sintomas Tardios
        </h4>
        <div className="text-xs text-amber-900/90 dark:text-amber-200/90 space-y-1.5 leading-relaxed">
          <p>
            • <strong>Reação em poucas horas (0 a 4h):</strong> Comum para arrotos, queimação, azia e náuseas (estômago alto) ou reações imediatas à lactose.
          </p>
          <p>
            • <strong>Reação do dia anterior (12h a 36h):</strong> Alimentos ricos em FODMAPs (feijão, trigo/glúten, alho, cebola) e gorduras levam de 12 a 24 horas para alcançar o cólon e fermentar pelas bactérias intestinais, gerando a diarreia matinal e gases fortes no dia seguinte.
          </p>
        </div>
      </div>
    </div>
  );
};
