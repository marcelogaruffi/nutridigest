import { MealEntry, SymptomEntry, DailySummary, MealType, SymptomType } from '../types';

const MEALS_KEY = 'nutridigest_meals_v1';
const SYMPTOMS_KEY = 'nutridigest_symptoms_v1';

export const COMMON_FOOD_TAGS = [
  'Leite / Lactose',
  'Queijo / Derivados',
  'Pão / Trigo / Glúten',
  'Feijão / Leguminosa',
  'Café',
  'Fritura / Gordura',
  'Ovos',
  'Refrigerante',
  'Açúcar / Doces',
  'Cerveja / Álcool',
  'Carne Vermelha',
  'Pimenta / Molhos',
  'Cebola / Alho (FODMAP)',
  'Frutas / Frutose',
  'Verduras Cruas',
  'Embutidos / Salsicha',
];

export const MEAL_TYPE_LABELS: Record<MealType, { label: string; icon: string; color: string }> = {
  cafe_manha: { label: 'Café da Manhã', icon: '☕', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  lanche_manha: { label: 'Lanche da Manhã', icon: '🍎', color: 'bg-lime-100 text-lime-800 border-lime-300' },
  almoco: { label: 'Almoço', icon: '🍽️', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  lanche_tarde: { label: 'Lanche da Tarde', icon: '🥪', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  jantar: { label: 'Jantar', icon: '🍲', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  ceia_belisco: { label: 'Ceia / Petisco', icon: '🍪', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  bebida: { label: 'Bebida / Água', icon: '💧', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
};

export const SYMPTOM_TYPE_LABELS: Record<SymptomType, { label: string; icon: string; badgeColor: string }> = {
  diarreia: { label: 'Diarreia / Fezes Líquidas', icon: '💩', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' },
  gases_pum: { label: 'Gases (Pum / Flatulência)', icon: '💨', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  gases_arroto: { label: 'Arrotos Frequentes', icon: '🗣️', badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  colica: { label: 'Cólicas / Dor Abdominal', icon: '⚡', badgeColor: 'bg-red-100 text-red-800 border-red-300' },
  estufamento: { label: 'Barriga Inchada / Estufada', icon: '🎈', badgeColor: 'bg-orange-100 text-orange-800 border-orange-300' },
  azia_refluxo: { label: 'Azia / Queimação', icon: '🔥', badgeColor: 'bg-red-100 text-red-700 border-red-300' },
  nausea: { label: 'Náusea / Enjoo', icon: '🤢', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
};

// Storage operations
export function getSavedMeals(): MealEntry[] {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler refeições do localStorage', e);
    return [];
  }
}

export function saveMeals(meals: MealEntry[]): void {
  try {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  } catch (e) {
    console.error('Erro ao salvar refeições no localStorage', e);
  }
}

export function getSavedSymptoms(): SymptomEntry[] {
  try {
    const raw = localStorage.getItem(SYMPTOMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler sintomas do localStorage', e);
    return [];
  }
}

export function saveSymptoms(symptoms: SymptomEntry[]): void {
  try {
    localStorage.setItem(SYMPTOMS_KEY, JSON.stringify(symptoms));
  } catch (e) {
    console.error('Erro ao salvar sintomas no localStorage', e);
  }
}

// Resumo diário de conforto digestivo
export function getDailySummaries(meals: MealEntry[], symptoms: SymptomEntry[]): Record<string, DailySummary> {
  const datesSet = new Set<string>();
  meals.forEach((m) => datesSet.add(m.date));
  symptoms.forEach((s) => datesSet.add(s.date));

  const result: Record<string, DailySummary> = {};

  datesSet.forEach((date) => {
    const dayMeals = meals.filter((m) => m.date === date);
    const daySymptoms = symptoms.filter((s) => s.date === date);

    const hasDiarrhea = daySymptoms.some((s) => s.type === 'diarreia');
    const hasSeverePain = daySymptoms.some((s) => s.type === 'colica' && (s.intensity === 'severa' || (s.details.painScale || 0) >= 7));
    const hasExcessiveGas = daySymptoms.filter((s) => s.type === 'gases_pum' || s.type === 'gases_arroto').length >= 2;

    let digestiveScore: 'otimo' | 'atencao' | 'critico' = 'otimo';
    if (hasDiarrhea || hasSeverePain || daySymptoms.some((s) => s.intensity === 'severa')) {
      digestiveScore = 'critico';
    } else if (daySymptoms.length > 0 || hasExcessiveGas) {
      digestiveScore = 'atencao';
    }

    result[date] = {
      date,
      mealsCount: dayMeals.length,
      symptomsCount: daySymptoms.length,
      hasDiarrhea,
      hasSeverePain,
      hasExcessiveGas,
      digestiveScore,
    };
  });

  return result;
}

// Análise de Correlação e Alimentos Suspeitos
export interface TriggerCorrelation {
  tag: string;
  timesPrecededSymptoms: number;
  totalTimesConsumed: number;
  percentageTrigger: number;
  relatedSymptoms: Record<string, number>;
  exampleMeals: string[];
}

export function calculateTriggerCorrelations(meals: MealEntry[], symptoms: SymptomEntry[]): TriggerCorrelation[] {
  if (symptoms.length === 0 || meals.length === 0) return [];

  const tagStats: Record<
    string,
    {
      totalConsumed: number;
      triggerCount: number;
      symptomTypes: Record<string, number>;
      exampleMeals: Set<string>;
    }
  > = {};

  // Contar consumo total de cada tag
  meals.forEach((m) => {
    m.tags.forEach((tag) => {
      if (!tagStats[tag]) {
        tagStats[tag] = { totalConsumed: 0, triggerCount: 0, symptomTypes: {}, exampleMeals: new Set() };
      }
      tagStats[tag].totalConsumed += 1;
    });
  });

  // Para cada sintoma, calcular janela de risco
  symptoms.forEach((symptom) => {
    const symptomTime = new Date(`${symptom.date}T${symptom.time}:00`).getTime();
    if (isNaN(symptomTime)) return;

    // Se usuário marcou 'dia_anterior', janela é de 14h a 36h atrás.
    // Se marcou 'hoje', janela é de 1h a 10h atrás.
    // Se incerto, janela ampla de 1h a 24h atrás.
    const minHours = symptom.origin === 'dia_anterior' ? 12 : 1;
    const maxHours = symptom.origin === 'dia_anterior' ? 36 : (symptom.origin === 'hoje' ? 10 : 24);

    const minTime = symptomTime - maxHours * 60 * 60 * 1000;
    const maxTime = symptomTime - minHours * 60 * 60 * 1000;

    const suspectMeals = meals.filter((meal) => {
      const mealTime = new Date(`${meal.date}T${meal.time}:00`).getTime();
      return !isNaN(mealTime) && mealTime >= minTime && mealTime <= maxTime;
    });

    const tagsSeenInThisSymptom = new Set<string>();

    suspectMeals.forEach((meal) => {
      meal.tags.forEach((tag) => {
        if (!tagStats[tag]) return;
        if (!tagsSeenInThisSymptom.has(tag)) {
          tagStats[tag].triggerCount += 1;
          tagsSeenInThisSymptom.add(tag);
        }
        tagStats[tag].symptomTypes[symptom.type] = (tagStats[tag].symptomTypes[symptom.type] || 0) + 1;
        if (meal.items) tagStats[tag].exampleMeals.add(meal.items);
      });
    });
  });

  const list: TriggerCorrelation[] = Object.entries(tagStats)
    .filter(([_, stats]) => stats.triggerCount > 0)
    .map(([tag, stats]) => {
      const percentageTrigger = Math.min(100, Math.round((stats.triggerCount / Math.max(1, stats.totalConsumed)) * 100));
      return {
        tag,
        timesPrecededSymptoms: stats.triggerCount,
        totalTimesConsumed: stats.totalConsumed,
        percentageTrigger,
        relatedSymptoms: stats.symptomTypes,
        exampleMeals: Array.from(stats.exampleMeals).slice(0, 3),
      };
    })
    .sort((a, b) => b.timesPrecededSymptoms - a.timesPrecededSymptoms || b.percentageTrigger - a.percentageTrigger);

  return list;
}

// Carregar dados de exemplo realistas para demonstração imediata
export function loadDemoData(): { meals: MealEntry[]; symptoms: SymptomEntry[] } {
  const today = new Date();
  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  const d0 = formatYMD(today);
  const d1 = formatYMD(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000));
  const d2 = formatYMD(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000));

  const demoMeals: MealEntry[] = [
    // Anteontem
    {
      id: 'm-1',
      date: d2,
      time: '08:00',
      timestamp: `${d2}T08:00:00`,
      type: 'cafe_manha',
      title: 'Café com Leite e Torrada',
      items: '1 copo de leite integral com café, 2 torradas com manteiga',
      tags: ['Leite / Lactose', 'Pão / Trigo / Glúten', 'Café'],
    },
    {
      id: 'm-2',
      date: d2,
      time: '12:30',
      timestamp: `${d2}T12:30:00`,
      type: 'almoco',
      title: 'Prato Feito Tradicional',
      items: 'Arroz branco, feijão carioca bem temperado, bife grelhado e salada de alface e tomate',
      tags: ['Feijão / Leguminosa', 'Cebola / Alho (FODMAP)', 'Carne Vermelha'],
    },
    {
      id: 'm-3',
      date: d2,
      time: '20:00',
      timestamp: `${d2}T20:00:00`,
      type: 'jantar',
      title: 'Pizza de Queijo & Refrigerante',
      items: '3 fatias de pizza 4 queijos, 1 lata de coca-cola',
      tags: ['Leite / Lactose', 'Queijo / Derivados', 'Pão / Trigo / Glúten', 'Refrigerante', 'Fritura / Gordura'],
    },
    // Ontem
    {
      id: 'm-4',
      date: d1,
      time: '08:30',
      timestamp: `${d1}T08:30:00`,
      type: 'cafe_manha',
      title: 'Ovos mexidos e Café preto',
      items: '2 ovos mexidos com azeite, 1 xícara de café preto sem açúcar',
      tags: ['Ovos', 'Café'],
    },
    {
      id: 'm-5',
      date: d1,
      time: '13:00',
      timestamp: `${d1}T13:00:00`,
      type: 'almoco',
      title: 'Frango com Batata Doce',
      items: 'Filé de frango grelhado, purê de batata doce e brócolis cozido',
      tags: ['Verduras Cruas'],
    },
    {
      id: 'm-6',
      date: d1,
      time: '19:30',
      timestamp: `${d1}T19:30:00`,
      type: 'jantar',
      title: 'Macarronada com Molho e Queijo Ralado',
      items: 'Prato fundo de espaguete à bolonhesa com muito queijo parmesão ralado',
      tags: ['Pão / Trigo / Glúten', 'Queijo / Derivados', 'Cebola / Alho (FODMAP)', 'Carne Vermelha'],
    },
    // Hoje
    {
      id: 'm-7',
      date: d0,
      time: '08:15',
      timestamp: `${d0}T08:15:00`,
      type: 'cafe_manha',
      title: 'Iogurte com Granola e Banana',
      items: '1 pote de iogurte natural com mel, banana picada e granola',
      tags: ['Leite / Lactose', 'Frutas / Frutose', 'Açúcar / Doces'],
    },
    {
      id: 'm-8',
      date: d0,
      time: '12:45',
      timestamp: `${d0}T12:45:00`,
      type: 'almoco',
      title: 'Feijoada com Farofa e Vinagrete',
      items: 'Feijoada completa com couve refogada, vinagrete de cebola e farofa',
      tags: ['Feijão / Leguminosa', 'Fritura / Gordura', 'Cebola / Alho (FODMAP)', 'Carne Vermelha'],
    },
  ];

  const demoSymptoms: SymptomEntry[] = [
    // Crise de ontem de manhã (vindo da pizza da noite anterior)
    {
      id: 's-1',
      date: d1,
      time: '09:30',
      timestamp: `${d1}T09:30:00`,
      type: 'diarreia',
      intensity: 'severa',
      origin: 'dia_anterior',
      details: {
        bristolType: 7,
        bathroomTrips: 3,
        urgent: true,
      },
      notes: 'Acordei com o intestino solto logo cedo. Suspeito fortemente da pizza de 4 queijos de ontem à noite.',
    },
    {
      id: 's-2',
      date: d1,
      time: '11:00',
      timestamp: `${d1}T11:00:00`,
      type: 'gases_pum',
      intensity: 'moderada',
      origin: 'dia_anterior',
      details: {
        flatulenceOdor: 'forte',
        trappedGas: true,
      },
      notes: 'Muitos gases com barulho e dificuldade para segurar.',
    },
    // Sintoma de hoje após o almoço
    {
      id: 's-3',
      date: d0,
      time: '14:20',
      timestamp: `${d0}T14:20:00`,
      type: 'colica',
      intensity: 'moderada',
      origin: 'hoje',
      details: {
        crampRegion: 'baixo_ventre',
        painScale: 6,
        painType: 'espasmo',
      },
      notes: 'Cólicas e pontadas cerca de 1h30 após a feijoada com vinagrete.',
    },
    {
      id: 's-4',
      date: d0,
      time: '15:10',
      timestamp: `${d0}T15:10:00`,
      type: 'gases_arroto',
      intensity: 'severa',
      origin: 'hoje',
      details: {
        afterMeal: true,
        sourTaste: true,
      },
      notes: 'Arrotos frequentes e sensação pesada de estufamento.',
    },
  ];

  saveMeals(demoMeals);
  saveSymptoms(demoSymptoms);
  return { meals: demoMeals, symptoms: demoSymptoms };
}
