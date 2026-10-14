import React, { useState } from 'react';
import { SymptomEntry, SymptomIntensity, SymptomOrigin, SymptomType } from '../types';
import { SYMPTOM_TYPE_LABELS } from '../storage/db';
import { X, Check, AlertCircle, Clock, Calendar, HelpCircle, Activity } from 'lucide-react';

interface AddSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSymptom: (symptom: Omit<SymptomEntry, 'id' | 'timestamp'>) => void;
  initialDate: string;
}

export const AddSymptomModal: React.FC<AddSymptomModalProps> = ({
  isOpen,
  onClose,
  onSaveSymptom,
  initialDate,
}) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(currentTime);
  const [type, setType] = useState<SymptomType>('diarreia');
  const [intensity, setIntensity] = useState<SymptomIntensity>('moderada');
  const [origin, setOrigin] = useState<SymptomOrigin>('hoje');

  // Detalhes específicos
  // Diarreia
  const [bristolType, setBristolType] = useState<5 | 6 | 7>(6);
  const [bathroomTrips, setBathroomTrips] = useState<number>(1);
  const [urgent, setUrgent] = useState<boolean>(true);

  // Gases Pum
  const [flatulenceOdor, setFlatulenceOdor] = useState<'normal' | 'forte' | 'muito_forte'>('forte');
  const [trappedGas, setTrappedGas] = useState<boolean>(false);

  // Gases Arroto
  const [afterMeal, setAfterMeal] = useState<boolean>(true);
  const [sourTaste, setSourTaste] = useState<boolean>(false);

  // Cólica
  const [crampRegion, setCrampRegion] = useState<'baixo_ventre' | 'estomago' | 'lado_esquerdo' | 'lado_direito' | 'difusa'>('baixo_ventre');
  const [painScale, setPainScale] = useState<number>(6);
  const [painType, setPainType] = useState<'pontada' | 'aperto' | 'queimacao' | 'espasmo'>('espasmo');

  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSaveSymptom({
      date,
      time,
      type,
      intensity,
      origin,
      details: {
        ...(type === 'diarreia' ? { bristolType, bathroomTrips, urgent } : {}),
        ...(type === 'gases_pum' ? { flatulenceOdor, trappedGas } : {}),
        ...(type === 'gases_arroto' ? { afterMeal, sourTaste } : {}),
        ...(type === 'colica' ? { crampRegion, painScale, painType } : {}),
      },
      notes: notes.trim(),
    });

    onClose();
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Registrar Sintoma Digestivo
              </h2>
              <p className="text-xs text-slate-500">
                Identifique a dor, gases ou diarreia e sua possível origem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Data do Sintoma
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          {/* Qual sintoma está sentindo */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Qual sintoma você está tendo?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SYMPTOM_TYPE_LABELS) as SymptomType[]).map((stKey) => {
                const info = SYMPTOM_TYPE_LABELS[stKey];
                const isSelected = type === stKey;
                return (
                  <button
                    key={stKey}
                    type="button"
                    onClick={() => setType(stKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 ring-1 ring-rose-500 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{info.icon}</span>
                    <span className="leading-tight">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Origem Temporal: HOJE ou VEIO DE ONTEM? (Chave da solicitação do usuário!) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <label className="text-xs font-bold text-amber-900 dark:text-amber-200">
                De onde você suspeita que veio esse sintoma?
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOrigin('hoje')}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 ${
                  origin === 'hoje'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-amber-900/50'
                }`}
              >
                <span>⚡ De HOJE</span>
                <span className="text-[10px] font-normal opacity-90">Reação rápida / recente</span>
              </button>

              <button
                type="button"
                onClick={() => setOrigin('dia_anterior')}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 ${
                  origin === 'dia_anterior'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-amber-900/50'
                }`}
              >
                <span>🔄 Do DIA ANTERIOR</span>
                <span className="text-[10px] font-normal opacity-90">Vem do que comi ontem</span>
              </button>

              <button
                type="button"
                onClick={() => setOrigin('incerto')}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 ${
                  origin === 'incerto'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-amber-900/50'
                }`}
              >
                <span>❓ Não sei ao certo</span>
                <span className="text-[10px] font-normal opacity-90">Analisar ambas</span>
              </button>
            </div>
          </div>

          {/* Intensidade */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Intensidade Geral do Desconforto
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIntensity('leve')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  intensity === 'leve'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🟢 Leve
              </button>
              <button
                type="button"
                onClick={() => setIntensity('moderada')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  intensity === 'moderada'
                    ? 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🟡 Moderada
              </button>
              <button
                type="button"
                onClick={() => setIntensity('severa')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  intensity === 'severa'
                    ? 'bg-rose-100 border-rose-500 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🔴 Severa / Forte
              </button>
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS: SE DIARREIA */}
          {type === 'diarreia' && (
            <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-3">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <span>💩</span> Detalhes da Diarreia (Escala de Bristol)
              </h4>

              {/* Escala de Bristol Simplificada */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBristolType(5)}
                  className={`p-2 rounded-xl text-[11px] font-medium border text-center ${
                    bristolType === 5
                      ? 'border-rose-500 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold">Tipo 5</p>
                  <p className="text-[10px] opacity-80">Pedaços moles</p>
                </button>
                <button
                  type="button"
                  onClick={() => setBristolType(6)}
                  className={`p-2 rounded-xl text-[11px] font-medium border text-center ${
                    bristolType === 6
                      ? 'border-rose-500 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold">Tipo 6</p>
                  <p className="text-[10px] opacity-80">Pastosa / desfeita</p>
                </button>
                <button
                  type="button"
                  onClick={() => setBristolType(7)}
                  className={`p-2 rounded-xl text-[11px] font-medium border text-center ${
                    bristolType === 7
                      ? 'border-rose-500 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold">Tipo 7</p>
                  <p className="text-[10px] opacity-80">Totalmente líquida</p>
                </button>
              </div>

              {/* Idas ao banheiro e urgência */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Quantas vezes hoje?
                  </label>
                  <select
                    value={bathroomTrips}
                    onChange={(e) => setBathroomTrips(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value={1}>1 vez</option>
                    <option value={2}>2 vezes</option>
                    <option value={3}>3 vezes</option>
                    <option value={4}>4 vezes ou mais</option>
                  </select>
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={urgent}
                      onChange={(e) => setUrgent(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    Urgência ao ir ao banheiro
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS: SE GASES PUM */}
          {type === 'gases_pum' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <span>💨</span> Detalhes dos Gases (Flatulência)
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Intensidade do Odor
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFlatulenceOdor('normal')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      flatulenceOdor === 'normal'
                        ? 'border-amber-500 bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Normal / Sem odor
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlatulenceOdor('forte')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      flatulenceOdor === 'forte'
                        ? 'border-amber-500 bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Odor Forte
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlatulenceOdor('muito_forte')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      flatulenceOdor === 'muito_forte'
                        ? 'border-amber-500 bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Muito Forte / Fétido
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={trappedGas}
                    onChange={(e) => setTrappedGas(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  Gases presos com dor / pressão no abdômen
                </label>
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS: SE ARROTOS */}
          {type === 'gases_arroto' && (
            <div className="p-3.5 rounded-2xl bg-yellow-50/50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/40 space-y-3">
              <h4 className="text-xs font-bold text-yellow-900 dark:text-yellow-200 flex items-center gap-1.5">
                <span>🗣️</span> Detalhes dos Arrotos (Eructação)
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={afterMeal}
                    onChange={(e) => setAfterMeal(e.target.checked)}
                    className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500"
                  />
                  Arrotos constantes logo após as refeições
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={sourTaste}
                    onChange={(e) => setSourTaste(e.target.checked)}
                    className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500"
                  />
                  Arroto azedo / com gosto da comida ou ácido (refluxo)
                </label>
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS: SE CÓLICA */}
          {type === 'colica' && (
            <div className="p-3.5 rounded-2xl bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-3">
              <h4 className="text-xs font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                <span>⚡</span> Detalhes da Cólica e Dor Abdominal
              </h4>

              {/* Slider de Dor 1 a 10 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Nível de Dor: <strong className="text-red-600 text-sm">{painScale}/10</strong>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {painScale <= 3 ? 'Leve' : painScale <= 6 ? 'Moderada' : 'Forte / Intensa'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painScale}
                  onChange={(e) => setPainScale(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Região da Dor */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Onde está doendo?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCrampRegion('baixo_ventre')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      crampRegion === 'baixo_ventre'
                        ? 'border-red-500 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Pé da barriga (Baixo ventre)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrampRegion('estomago')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      crampRegion === 'estomago'
                        ? 'border-red-500 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Boca do estômago
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrampRegion('lado_esquerdo')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      crampRegion === 'lado_esquerdo'
                        ? 'border-red-500 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Lado Esquerdo
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrampRegion('difusa')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center ${
                      crampRegion === 'difusa'
                        ? 'border-red-500 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40'
                    }`}
                  >
                    Barriga inteira
                  </button>
                </div>
              </div>

              {/* Tipo de dor */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Sensação da dor:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['espasmo', 'pontada', 'aperto', 'queimacao'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPainType(t)}
                      className={`p-1.5 rounded-lg text-[11px] border capitalize ${
                        painType === t
                          ? 'border-red-500 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Anotações livres */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Observações Adicionais (opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Começou 30 minutos após tomar café, sinto a barriga borbulhando bastante..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              Salvar Registro de Sintoma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
