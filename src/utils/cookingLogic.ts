export type Doneness = 'Blue' | 'Rare' | 'Medium Rare' | 'Medium' | 'Medium Well' | 'Well Done';

export const DONENESS_LEVELS: Doneness[] = [
  'Blue',
  'Rare',
  'Medium Rare',
  'Medium',
  'Medium Well',
  'Well Done',
];

export interface CookingStep {
  name: string;
  duration: number; // in seconds
  description: string;
}

export interface SteakConfig {
  id: string;
  thickness: number;
  doneness: Doneness;
  steps: CookingStep[];
}

const BASE_THICKNESS_MM = 25; // 1 inch approx

const BASE_TIMES_SECONDS: Record<Doneness, number> = {
  "Blue": 120,
  "Rare": 210,
  "Medium Rare": 330,
  "Medium": 450,
  "Medium Well": 570,
  "Well Done": 690
};

export const calculateSteps = (thicknessMm: number, doneness: Doneness): CookingStep[] => {
  const baseTime = BASE_TIMES_SECONDS[doneness];
  // Linear scaling
  const scaleFactor = thicknessMm / BASE_THICKNESS_MM;
  const totalCookingTime = Math.round(baseTime * scaleFactor);
  
  const sideTime = Math.round(totalCookingTime / 2);
  const restTime = 300; // 5 mins fixed

  return [
    {
      name: 'Sear Side 1',
      duration: sideTime,
      description: 'Place the steak on the hot pan. Don\'t touch it!',
    },
    {
      name: 'Flip & Sear Side 2',
      duration: sideTime,
      description: 'Flip the steak. Cook until the timer ends.',
    },
    {
      name: 'Rest',
      duration: restTime,
      description: 'Remove from pan. Let it rest on a warm plate or board.',
    }
  ];
};

export const mmToInch = (mm: number) => (mm / 25.4).toFixed(1);
export const inchToMm = (inch: number) => Math.round(inch * 25.4);
