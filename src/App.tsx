import React, { useState, useEffect } from 'react';
import { ActiveTab, MealEntry, SymptomEntry } from './types';
import {
  getSavedMeals,
  getSavedSymptoms,
  saveMeals,
  saveSymptoms,
  loadDemoData,
} from './storage/db';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DailyTimeline } from './components/DailyTimeline';
import { InsightsView } from './components/InsightsView';
import { CalendarView } from './components/CalendarView';
import { DoctorReportView } from './components/DoctorReportView';
import { AddMealModal } from './components/AddMealModal';
import { AddSymptomModal } from './components/AddSymptomModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [activeTab, setActiveTab] = useState<ActiveTab>('diario');

  // Modais
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Inicializar dados
  useEffect(() => {
    const savedM = getSavedMeals();
    const savedS = getSavedSymptoms();

    if (savedM.length === 0 && savedS.length === 0) {
      // Primeira vez abrindo: carrega dados demonstrativos para não ficar vazio
      const demo = loadDemoData();
      setMeals(demo.meals);
      setSymptoms(demo.symptoms);
    } else {
      setMeals(savedM);
      setSymptoms(savedS);
    }
  }, []);

  // Sincronizar dark mode na tag html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Salvar Refeição
  const handleSaveMeal = (mealData: Omit<MealEntry, 'id' | 'timestamp'>) => {
    const newMeal: MealEntry = {
      ...mealData,
      id: 'meal-' + Date.now(),
      timestamp: `${mealData.date}T${mealData.time}:00`,
    };

    const updated = [newMeal, ...meals];
    setMeals(updated);
    saveMeals(updated);
    setSelectedDate(mealData.date);
  };

  // Salvar Sintoma
  const handleSaveSymptom = (symptomData: Omit<SymptomEntry, 'id' | 'timestamp'>) => {
    const newSymptom: SymptomEntry = {
      ...symptomData,
      id: 'symptom-' + Date.now(),
      timestamp: `${symptomData.date}T${symptomData.time}:00`,
    };

    const updated = [newSymptom, ...symptoms];
    setSymptoms(updated);
    saveSymptoms(updated);
    setSelectedDate(symptomData.date);
  };

  // Excluir
  const handleDeleteMeal = (id: string) => {
    if (confirm('Deseja excluir esta refeição?')) {
      const updated = meals.filter((m) => m.id !== id);
      setMeals(updated);
      saveMeals(updated);
    }
  };

  const handleDeleteSymptom = (id: string) => {
    if (confirm('Deseja excluir este registro de sintoma?')) {
      const updated = symptoms.filter((s) => s.id !== id);
      setSymptoms(updated);
      saveSymptoms(updated);
    }
  };

  const handleReloadData = (newMeals: MealEntry[], newSymptoms: SymptomEntry[]) => {
    setMeals(newMeals);
    setSymptoms(newSymptoms);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header com Navegação de Data */}
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3">
        {activeTab === 'diario' && (
          <DailyTimeline
            date={selectedDate}
            meals={meals}
            symptoms={symptoms}
            onDeleteMeal={handleDeleteMeal}
            onDeleteSymptom={handleDeleteSymptom}
            onOpenAddMeal={() => setIsAddMealOpen(true)}
            onOpenAddSymptom={() => setIsAddSymptomOpen(true)}
          />
        )}

        {activeTab === 'correlacoes' && (
          <InsightsView meals={meals} symptoms={symptoms} />
        )}

        {activeTab === 'calendario' && (
          <CalendarView
            meals={meals}
            symptoms={symptoms}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onNavigateToDay={(date) => {
              setSelectedDate(date);
              setActiveTab('diario');
            }}
          />
        )}

        {activeTab === 'relatorio' && (
          <DoctorReportView meals={meals} symptoms={symptoms} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenAddMeal={() => setIsAddMealOpen(true)}
        onOpenAddSymptom={() => setIsAddSymptomOpen(true)}
      />

      {/* Modais */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onSaveMeal={handleSaveMeal}
        initialDate={selectedDate}
      />

      <AddSymptomModal
        isOpen={isAddSymptomOpen}
        onClose={() => setIsAddSymptomOpen(false)}
        onSaveSymptom={handleSaveSymptom}
        initialDate={selectedDate}
      />

      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        localIp="192.168.0.14"
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        meals={meals}
        symptoms={symptoms}
        onReloadData={handleReloadData}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    </div>
  );
};

export default App;
