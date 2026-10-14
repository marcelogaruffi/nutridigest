import React, { useState } from 'react';
import { MealEntry, SymptomEntry } from '../types';
import { calculateTriggerCorrelations, SYMPTOM_TYPE_LABELS } from '../storage/db';
import { isNative, shareText } from '../native';
import { FileText, Copy, Printer, Check, Share2, AlertCircle } from 'lucide-react';

interface DoctorReportViewProps {
  meals: MealEntry[];
  symptoms: SymptomEntry[];
}

export const DoctorReportView: React.FC<DoctorReportViewProps> = ({ meals, symptoms }) => {
  const [copied, setCopied] = useState(false);
  const [daysWindow, setDaysWindow] = useState<number>(14);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysWindow);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  const filteredMeals = meals.filter((m) => m.date >= cutoffStr);
  const filteredSymptoms = symptoms.filter((s) => s.date >= cutoffStr);

  const correlations = calculateTriggerCorrelations(filteredMeals, filteredSymptoms);

  const diarrheaEpisodes = filteredSymptoms.filter((s) => s.type === 'diarreia');
  const gasEpisodes = filteredSymptoms.filter((s) => s.type === 'gases_pum' || s.type === 'gases_arroto');
  const colicEpisodes = filteredSymptoms.filter((s) => s.type === 'colica');

  const generateReportText = () => {
    let text = `*RELATÓRIO DE SINTOMAS & DIÁRIO ALIMENTAR*\n`;
    text += `Período: Últimos ${daysWindow} dias\n`;
    text += `Gerado pelo NutriDigest em ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    text += `*RESUMO CLÍNICO:*\n`;
    text += `• Episódios de Diarreia: ${diarrheaEpisodes.length}\n`;
    text += `• Queixas de Gases / Arrotos: ${gasEpisodes.length}\n`;
    text += `• Episódios de Cólicas / Dor: ${colicEpisodes.length}\n\n`;

    if (correlations.length > 0) {
      text += `*ALIMENTOS MAIS SUSPEITOS ANTES DAS CRISES:*\n`;
      correlations.slice(0, 5).forEach((c, idx) => {
        text += `${idx + 1}. ${c.tag} (Presente em ${c.timesPrecededSymptoms} episódios - ${c.percentageTrigger}% de correlação)\n`;
      });
      text += `\n`;
    }

    text += `*REGISTRO DETALHADO DOS SINTOMAS:*\n`;
    if (filteredSymptoms.length === 0) {
      text += `Nenhum sintoma registrado no período.\n`;
    } else {
      filteredSymptoms
        .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
        .forEach((s) => {
          const meta = SYMPTOM_TYPE_LABELS[s.type];
          text += `📅 ${s.date.split('-').reverse().join('/')} às ${s.time} - ${meta?.label}\n`;
          text += `  • Intensidade: ${s.intensity.toUpperCase()}`;
          if (s.origin === 'dia_anterior') text += ` (Suspeita vindo do dia anterior)`;
          if (s.origin === 'hoje') text += ` (Reflexo de hoje)`;
          text += `\n`;

          if (s.type === 'diarreia') {
            text += `  • Bristol Tipo ${s.details.bristolType || 6}, ${s.details.bathroomTrips || 1}x no dia\n`;
          }
          if (s.type === 'colica') {
            text += `  • Dor ${s.details.painScale || 5}/10 na região: ${s.details.crampRegion?.replace('_', ' ')}\n`;
          }
          if (s.notes) text += `  • Obs: "${s.notes}"\n`;
          text += `\n`;
        });
    }

    return text;
  };

  const handleCopy = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const native = isNative();

  // No app Android window.print() não funciona; usa o menu de compartilhar.
  const handlePrint = () => {
    if (native) {
      shareText(generateReportText(), 'Relatório NutriDigest').catch(() => {});
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header do Relatório */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Relatório para Consulta Médica
            </h2>
          </div>
          <select
            value={daysWindow}
            onChange={(e) => setDaysWindow(Number(e.target.value))}
            className="text-xs p-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value={7}>Últimos 7 dias</option>
            <option value={14}>Últimos 14 dias</option>
            <option value={30}>Últimos 30 dias</option>
          </select>
        </div>

        <p className="text-xs text-slate-500">
          Leve ou envie este resumo estruturado para o seu Gastroenterologista ou Nutricionista avaliar suas intolerâncias e o trânsito intestinal.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado para WhatsApp!' : 'Copiar p/ WhatsApp'}
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            {native ? <Share2 className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
            <span>{native ? 'Compartilhar' : 'Imprimir'}</span>
          </button>
        </div>
      </div>

      {/* Relatório Visual Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 print:border-none print:shadow-none">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Resumo dos Sintomas (Últimos {daysWindow} dias)
          </h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-center">
              <p className="text-base font-bold text-rose-600">{diarrheaEpisodes.length}</p>
              <p className="text-[10px] text-slate-500">Diarreias</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-center">
              <p className="text-base font-bold text-amber-600">{gasEpisodes.length}</p>
              <p className="text-[10px] text-slate-500">Gases / Arrotos</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-center">
              <p className="text-base font-bold text-red-600">{colicEpisodes.length}</p>
              <p className="text-[10px] text-slate-500">Cólicas</p>
            </div>
          </div>
        </div>

        {/* Principais suspeitas */}
        {correlations.length > 0 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Gatilhos Alimentares Sugeridos:
            </h4>
            <div className="space-y-1.5">
              {correlations.slice(0, 3).map((c) => (
                <div key={c.tag} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    • {c.tag}
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">
                    {c.percentageTrigger}% de relação com crises
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista recente de episódios */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Histórico Cronológico:
          </h4>
          {filteredSymptoms.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhum sintoma neste período.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSymptoms.map((s) => {
                const meta = SYMPTOM_TYPE_LABELS[s.type];
                return (
                  <div key={s.id} className="text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      <span>{meta?.icon} {meta?.label}</span>
                      <span className="text-[10px] text-slate-500">{s.date} às {s.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Origem: <strong>{s.origin === 'dia_anterior' ? 'Vindo de Ontem' : 'De Hoje'}</strong> | Intensidade: <strong>{s.intensity}</strong>
                      {s.notes && <p className="italic mt-1 text-slate-500">"{s.notes}"</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
