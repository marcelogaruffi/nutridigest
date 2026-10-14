import React, { useState } from 'react';
import { MealEntry, MealType } from '../types';
import { COMMON_FOOD_TAGS, MEAL_TYPE_LABELS } from '../storage/db';
import { X, Check, Utensils, Clock, Tag } from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (meal: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  initialDate: string;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onSaveMeal,
  initialDate,
}) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(currentTime);
  const [type, setType] = useState<MealType>('almoco');
  const [title, setTitle] = useState('');
  const [items, setItems] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags([...selectedTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleQuickMealPreset = (mealType: MealType) => {
    setType(mealType);
    if (!title) {
      setTitle(MEAL_TYPE_LABELS[mealType].label);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.trim() && !title.trim()) {
      alert('Por favor, informe o que você comeu ou bebeu.');
      return;
    }

    onSaveMeal({
      date,
      time,
      type,
      title: title.trim() || MEAL_TYPE_LABELS[type].label,
      items: items.trim(),
      tags: selectedTags,
    });

    onClose();
    // reset form
    setTitle('');
    setItems('');
    setSelectedTags([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Registrar Refeição ou Bebida
              </h2>
              <p className="text-xs text-slate-500">
                Anote tudo para identificar possíveis alimentos vilões
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Horário
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tipo de Refeição */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Tipo de Refeição
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {(Object.keys(MEAL_TYPE_LABELS) as MealType[]).map((mealKey) => {
                const info = MEAL_TYPE_LABELS[mealKey];
                const isSelected = type === mealKey;
                return (
                  <button
                    key={mealKey}
                    type="button"
                    onClick={() => handleQuickMealPreset(mealKey)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span className="truncate">{info.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* O que comeu e bebeu */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              O que você comeu e bebeu? <span className="text-emerald-600">*</span>
            </label>
            <textarea
              rows={3}
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="Ex: 1 prato de feijoada com couve refogada, 1 copo de suco de laranja natural, farofa temperada com cebola..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
              required
            />
          </div>

          {/* Tags de Gatilhos Comuns (Toque rápido para facilitar) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                Ingredientes Suspeitos / Alergênicos
              </label>
              <span className="text-[11px] text-slate-400">Toque para marcar</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              {COMMON_FOOD_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Adicionar tag personalizada */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="+ Adicionar outro ingrediente (ex: Milho)"
                className="text-xs flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Bottom Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              Salvar Refeição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
