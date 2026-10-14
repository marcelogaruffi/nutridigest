import React, { useRef } from 'react';
import { MealEntry, SymptomEntry } from '../types';
import { loadDemoData } from '../storage/db';
import { isNative, shareTextFile } from '../native';
import { X, Download, Upload, Trash2, RefreshCw, Database, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meals: MealEntry[];
  symptoms: SymptomEntry[];
  onReloadData: (meals: MealEntry[], symptoms: SymptomEntry[]) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  meals,
  symptoms,
  onReloadData,
  darkMode,
  onToggleDarkMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      meals,
      symptoms,
    };

    const json = JSON.stringify(backupData, null, 2);
    const filename = `nutridigest_backup_${new Date().toISOString().split('T')[0]}.json`;

    if (isNative()) {
      shareTextFile(filename, json, 'Backup NutriDigest').catch((err) =>
        console.error('Erro ao exportar backup', err)
      );
      return;
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutridigest_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.meals && parsed.symptoms) {
          localStorage.setItem('nutridigest_meals_v1', JSON.stringify(parsed.meals));
          localStorage.setItem('nutridigest_symptoms_v1', JSON.stringify(parsed.symptoms));
          onReloadData(parsed.meals, parsed.symptoms);
          alert('Backup restaurado com sucesso!');
          onClose();
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao processar arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  // Carregar dados de teste
  const handleLoadDemo = () => {
    if (confirm('Deseja carregar dados de exemplo realistas para demonstração?')) {
      const demo = loadDemoData();
      onReloadData(demo.meals, demo.symptoms);
      onClose();
    }
  };

  // Limpar todos os dados
  const handleClearAll = () => {
    if (confirm('Tem certeza de que deseja apagar todos os registros de refeições e sintomas?')) {
      localStorage.removeItem('nutridigest_meals_v1');
      localStorage.removeItem('nutridigest_symptoms_v1');
      onReloadData([], []);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Configurações & Backup
              </h2>
              <p className="text-xs text-slate-500">
                Seus dados ficam 100% salvos no seu aparelho
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

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Aparência */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Modo Escuro (Dark Mode)
              </span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                darkMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Backup & Restauração */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Backup dos Seus Dados
            </h3>
            
            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Exportar Backup (Download JSON)</span>
              </div>
              <span className="text-[11px] text-slate-400">{meals.length + symptoms.length} registros</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Importar Backup (Restaurar arquivo JSON)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportBackup}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Dados de Demonstração */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ambiente de Teste
            </h3>
            <button
              onClick={handleLoadDemo}
              className="w-full py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <span>Carregar Dados de Exemplo Realistas</span>
            </button>
            <p className="text-[11px] text-slate-400">
              Adiciona 3 dias de exemplo com pizza, feijoada, diarreia vindo de ontem e cólicas de hoje para você ver as correlações funcionando.
            </p>
          </div>

          {/* Zona de Perigo */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleClearAll}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Apagar Todos os Registros</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
