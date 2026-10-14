export type MealType =
  | 'cafe_manha'
  | 'lanche_manha'
  | 'almoco'
  | 'lanche_tarde'
  | 'jantar'
  | 'ceia_belisco'
  | 'bebida';

export interface MealEntry {
  id: string;
  timestamp: string; // ISO
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: MealType;
  title: string;
  items: string; // descrição livre dos alimentos e bebidas
  tags: string[]; // ex: ['Lactose', 'Glúten', 'Feijão', 'Café', 'Fritura']
  waterMl?: number; // água se for bebida
  notes?: string;
}

export type SymptomType =
  | 'diarreia'
  | 'gases_pum'
  | 'gases_arroto'
  | 'colica'
  | 'estufamento'
  | 'azia_refluxo'
  | 'nausea';

export type SymptomIntensity = 'leve' | 'moderada' | 'severa';

export type SymptomOrigin =
  | 'hoje' // reflexo de refeição recente (hoje)
  | 'dia_anterior' // suspeita de digestão do dia anterior (ontem)
  | 'incerto'; // não sabe ao certo

export interface SymptomEntry {
  id: string;
  timestamp: string; // ISO
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: SymptomType;
  intensity: SymptomIntensity;
  origin: SymptomOrigin;
  // Detalhes clínicos específicos
  details: {
    // Para diarreia
    bristolType?: 5 | 6 | 7; // 5=pedaços moles, 6=pastosa, 7=totalmente líquida
    bathroomTrips?: number; // vezes que foi ao banheiro
    urgent?: boolean;
    // Para gases pum
    flatulenceOdor?: 'normal' | 'forte' | 'muito_forte';
    trappedGas?: boolean; // gases presos provocando dor
    // Para gases arroto
    afterMeal?: boolean;
    sourTaste?: boolean; // arroto ácido com gosto de comida
    // Para cólicas
    crampRegion?: 'baixo_ventre' | 'estomago' | 'lado_esquerdo' | 'lado_direito' | 'difusa';
    painScale?: number; // 1 a 10
    painType?: 'pontada' | 'aperto' | 'queimacao' | 'espasmo';
  };
  notes?: string;
}

export type ActiveTab = 'diario' | 'correlacoes' | 'calendario' | 'relatorio';

export interface DailySummary {
  date: string;
  mealsCount: number;
  symptomsCount: number;
  hasDiarrhea: boolean;
  hasSeverePain: boolean;
  hasExcessiveGas: boolean;
  digestiveScore: 'otimo' | 'atencao' | 'critico';
}
