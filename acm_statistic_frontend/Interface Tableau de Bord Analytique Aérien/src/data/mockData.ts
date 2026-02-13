// Données mockées pour le tableau de bord analytique aérien

export interface RedevanceEntry {
  id: string;
  mois: string;
  annee: string;
  montant: number;
  compagnie: string;
  aeroport: string;
  typeTrafic: 'Domestique' | 'International' | 'Cargo';
}

export interface CompagniePerformance {
  nom: string;
  montant: number;
  pourcentage: number;
  variation: number;
  ponctualite: number;
  annee: string;
  vols: number;
  performance: number;
}

export interface AeroportPerformance {
  nom: string;
  montant: number;
  variation: number;
  typeTrafic: 'Domestique' | 'International' | 'Cargo';
  annee: string;
  passagers?: number;
  vols?: number;
}

export interface ComparisonData {
  mois: string;
  anneeActuelle: number;
  anneePrecedente: number;
}

export const redevancesData: RedevanceEntry[] = [
  // Données 2024
  {
    id: '1',
    mois: 'Janvier',
    annee: '2024',
    montant: 125000,
    compagnie: 'Air France',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '2',
    mois: 'Janvier',
    annee: '2024',
    montant: 87500,
    compagnie: 'Emirates',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '3',
    mois: 'Janvier',
    annee: '2024',
    montant: 65000,
    compagnie: 'Air France',
    aeroport: 'Orly',
    typeTrafic: 'Domestique'
  },
  {
    id: '4',
    mois: 'Février',
    annee: '2024',
    montant: 132000,
    compagnie: 'Lufthansa',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '5',
    mois: 'Février',
    annee: '2024',
    montant: 78000,
    compagnie: 'FedEx',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'Cargo'
  },
  {
    id: '6',
    mois: 'Mars',
    annee: '2024',
    montant: 94500,
    compagnie: 'British Airways',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '7',
    mois: 'Mars',
    annee: '2024',
    montant: 56000,
    compagnie: 'Air France',
    aeroport: 'Lyon',
    typeTrafic: 'Domestique'
  },
  {
    id: '8',
    mois: 'Avril',
    annee: '2024',
    montant: 118000,
    compagnie: 'Qatar Airways',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '9',
    mois: 'Mai',
    annee: '2024',
    montant: 145000,
    compagnie: 'Air France',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '10',
    mois: 'Mai',
    annee: '2024',
    montant: 89000,
    compagnie: 'Emirates',
    aeroport: 'Nice',
    typeTrafic: 'International'
  },
  {
    id: '11',
    mois: 'Juin',
    annee: '2024',
    montant: 102000,
    compagnie: 'Lufthansa',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '12',
    mois: 'Juin',
    annee: '2024',
    montant: 73000,
    compagnie: 'Air France',
    aeroport: 'Marseille',
    typeTrafic: 'Domestique'
  },

  // Données 2023
  {
    id: '13',
    mois: 'Janvier',
    annee: '2023',
    montant: 115000,
    compagnie: 'Air France',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '14',
    mois: 'Janvier',
    annee: '2023',
    montant: 82000,
    compagnie: 'Emirates',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '15',
    mois: 'Février',
    annee: '2023',
    montant: 124000,
    compagnie: 'Lufthansa',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '16',
    mois: 'Mars',
    annee: '2023',
    montant: 87000,
    compagnie: 'British Airways',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '17',
    mois: 'Avril',
    annee: '2023',
    montant: 109000,
    compagnie: 'Qatar Airways',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '18',
    mois: 'Mai',
    annee: '2023',
    montant: 132000,
    compagnie: 'Air France',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '19',
    mois: 'Juin',
    annee: '2023',
    montant: 95000,
    compagnie: 'Lufthansa',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },

  // Données 2022
  {
    id: '20',
    mois: 'Janvier',
    annee: '2022',
    montant: 98000,
    compagnie: 'Air France',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '21',
    mois: 'Février',
    annee: '2022',
    montant: 105000,
    compagnie: 'Lufthansa',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '22',
    mois: 'Mars',
    annee: '2022',
    montant: 78000,
    compagnie: 'British Airways',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '23',
    mois: 'Avril',
    annee: '2022',
    montant: 92000,
    compagnie: 'Qatar Airways',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  },
  {
    id: '24',
    mois: 'Mai',
    annee: '2022',
    montant: 118000,
    compagnie: 'Air France',
    aeroport: 'Charles de Gaulle',
    typeTrafic: 'International'
  }
];

export const compagniesPerformance: CompagniePerformance[] = [
  // Données 2024
  { nom: 'Air France', montant: 2150000, pourcentage: 35, variation: 12, ponctualite: 87, annee: '2024', vols: 1245, performance: 89 },
  { nom: 'Emirates', montant: 1250000, pourcentage: 20, variation: 8, ponctualite: 92, annee: '2024', vols: 854, performance: 92 },
  { nom: 'Lufthansa', montant: 980000, pourcentage: 16, variation: -3, ponctualite: 85, annee: '2024', vols: 687, performance: 82 },
  { nom: 'British Airways', montant: 750000, pourcentage: 12, variation: 5, ponctualite: 89, annee: '2024', vols: 523, performance: 86 },
  { nom: 'Qatar Airways', montant: 650000, pourcentage: 10, variation: 15, ponctualite: 94, annee: '2024', vols: 412, performance: 94 },
  { nom: 'FedEx', montant: 420000, pourcentage: 7, variation: -2, ponctualite: 88, annee: '2024', vols: 298, performance: 85 },

  // Données 2023
  { nom: 'Air France', montant: 1920000, pourcentage: 38, variation: 8, ponctualite: 84, annee: '2023', vols: 1156, performance: 86 },
  { nom: 'Emirates', montant: 1156000, pourcentage: 23, variation: 12, ponctualite: 89, annee: '2023', vols: 798, performance: 89 },
  { nom: 'Lufthansa', montant: 1010000, pourcentage: 20, variation: 2, ponctualite: 87, annee: '2023', vols: 721, performance: 85 },
  { nom: 'British Airways', montant: 714000, pourcentage: 14, variation: -1, ponctualite: 88, annee: '2023', vols: 498, performance: 84 },
  { nom: 'Qatar Airways', montant: 565000, pourcentage: 11, variation: 18, ponctualite: 91, annee: '2023', vols: 356, performance: 91 },
  { nom: 'FedEx', montant: 428000, pourcentage: 8, variation: 5, ponctualite: 90, annee: '2023', vols: 312, performance: 88 },

  // Données 2022
  { nom: 'Air France', montant: 1780000, pourcentage: 41, variation: -5, ponctualite: 82, annee: '2022', vols: 1089, performance: 83 },
  { nom: 'Lufthansa', montant: 989000, pourcentage: 23, variation: 15, ponctualite: 85, annee: '2022', vols: 685, performance: 83 },
  { nom: 'Emirates', montant: 1032000, pourcentage: 24, variation: 6, ponctualite: 86, annee: '2022', vols: 712, performance: 87 },
  { nom: 'British Airways', montant: 721000, pourcentage: 16, variation: 8, ponctualite: 89, annee: '2022', vols: 521, performance: 86 },
  { nom: 'Qatar Airways', montant: 478000, pourcentage: 11, variation: 22, ponctualite: 88, annee: '2022', vols: 298, performance: 88 },
  { nom: 'FedEx', montant: 407000, pourcentage: 9, variation: 3, ponctualite: 87, annee: '2022', vols: 289, performance: 85 }
];

// Répartition des redevances par type de trafic
export const compagniesInternational = [
  { nom: 'Air France', montant: 1850000, pourcentage: 42 },
  { nom: 'Emirates', montant: 1180000, pourcentage: 27 },
  { nom: 'Lufthansa', montant: 720000, pourcentage: 16 },
  { nom: 'British Airways', montant: 480000, pourcentage: 11 },
  { nom: 'Qatar Airways', montant: 170000, pourcentage: 4 }
];

export const compagniesDomestique = [
  { nom: 'Air France', montant: 280000, pourcentage: 58 },
  { nom: 'Lufthansa', montant: 120000, pourcentage: 25 },
  { nom: 'British Airways', montant: 82000, pourcentage: 17 }
];

export const compagniesCargo = [
  { nom: 'FedEx', montant: 420000, pourcentage: 42 },
  { nom: 'Qatar Airways', montant: 280000, pourcentage: 28 },
  { nom: 'Lufthansa', montant: 140000, pourcentage: 14 },
  { nom: 'Emirates', montant: 110000, pourcentage: 11 },
  { nom: 'Air France', montant: 50000, pourcentage: 5 }
];

export const aeroportsPerformance: AeroportPerformance[] = [
  // Données 2024
  { nom: 'Charles de Gaulle', montant: 4250000, variation: 8, typeTrafic: 'International', annee: '2024', passagers: 68500000, vols: 445620 },
  { nom: 'Orly', montant: 1850000, variation: 12, typeTrafic: 'Domestique', annee: '2024', passagers: 31200000, vols: 234580 },
  { nom: 'Lyon', montant: 980000, variation: -2, typeTrafic: 'Domestique', annee: '2024', passagers: 12800000, vols: 125640 },
  { nom: 'Nice', montant: 750000, variation: 15, typeTrafic: 'International', annee: '2024', passagers: 14600000, vols: 145280 },
  { nom: 'Marseille', montant: 620000, variation: 5, typeTrafic: 'Domestique', annee: '2024', passagers: 9800000, vols: 98450 },
  { nom: 'Toulouse', montant: 480000, variation: -5, typeTrafic: 'Domestique', annee: '2024', passagers: 7900000, vols: 87620 },
  { nom: 'Bordeaux', montant: 420000, variation: 7, typeTrafic: 'Domestique', annee: '2024', passagers: 6200000, vols: 74580 },
  { nom: 'Nantes', montant: 380000, variation: 3, typeTrafic: 'Domestique', annee: '2024', passagers: 5800000, vols: 68920 },

  // Données 2023
  { nom: 'Charles de Gaulle', montant: 3935000, variation: 5, typeTrafic: 'International', annee: '2023', passagers: 65200000, vols: 425140 },
  { nom: 'Orly', montant: 1652000, variation: 8, typeTrafic: 'Domestique', annee: '2023', passagers: 28900000, vols: 218760 },
  { nom: 'Lyon', montant: 1000000, variation: 12, typeTrafic: 'Domestique', annee: '2023', passagers: 11800000, vols: 118920 },
  { nom: 'Nice', montant: 652000, variation: 10, typeTrafic: 'International', annee: '2023', passagers: 12700000, vols: 125840 },
  { nom: 'Marseille', montant: 590000, variation: 2, typeTrafic: 'Domestique', annee: '2023', passagers: 9100000, vols: 91250 },
  { nom: 'Toulouse', montant: 505000, variation: 6, typeTrafic: 'Domestique', annee: '2023', passagers: 7600000, vols: 84210 },
  { nom: 'Bordeaux', montant: 392000, variation: 4, typeTrafic: 'Domestique', annee: '2023', passagers: 5900000, vols: 69850 },
  { nom: 'Nantes', montant: 369000, variation: 1, typeTrafic: 'Domestique', annee: '2023', passagers: 5600000, vols: 65420 },

  // Données 2022
  { nom: 'Charles de Gaulle', montant: 3748000, variation: -8, typeTrafic: 'International', annee: '2022', passagers: 57800000, vols: 387650 },
  { nom: 'Orly', montant: 1530000, variation: -12, typeTrafic: 'Domestique', annee: '2022', passagers: 25400000, vols: 195840 },
  { nom: 'Lyon', montant: 892000, variation: -18, typeTrafic: 'Domestique', annee: '2022', passagers: 9800000, vols: 102560 },
  { nom: 'Nice', montant: 593000, variation: -15, typeTrafic: 'International', annee: '2022', passagers: 10200000, vols: 108920 },
  { nom: 'Marseille', montant: 578000, variation: -20, typeTrafic: 'Domestique', annee: '2022', passagers: 8100000, vols: 81450 },
  { nom: 'Toulouse', montant: 476000, variation: -10, typeTrafic: 'Domestique', annee: '2022', passagers: 6900000, vols: 75840 },
  { nom: 'Bordeaux', montant: 377000, variation: -5, typeTrafic: 'Domestique', annee: '2022', passagers: 5200000, vols: 62180 },
  { nom: 'Nantes', montant: 365000, variation: -8, typeTrafic: 'Domestique', annee: '2022', passagers: 5100000, vols: 58760 }
];

export const comparisonData: ComparisonData[] = [
  { mois: 'Jan', anneeActuelle: 2800000, anneePrecedente: 2650000 },
  { mois: 'Fév', anneeActuelle: 2950000, anneePrecedente: 2720000 },
  { mois: 'Mar', anneeActuelle: 3200000, anneePrecedente: 2980000 },
  { mois: 'Avr', anneeActuelle: 3450000, anneePrecedente: 3150000 },
  { mois: 'Mai', anneeActuelle: 3650000, anneePrecedente: 3280000 },
  { mois: 'Jun', anneeActuelle: 3850000, anneePrecedente: 3450000 },
  { mois: 'Jul', anneeActuelle: 4200000, anneePrecedente: 3750000 },
  { mois: 'Aoû', anneeActuelle: 4350000, anneePrecedente: 3890000 }
];

export const projectionData = [
  { mois: 'Sep', reel: 4100000, projection: 4250000 },
  { mois: 'Oct', reel: null, projection: 4400000 },
  { mois: 'Nov', reel: null, projection: 4150000 },
  { mois: 'Déc', reel: null, projection: 4600000 }
];

export const anomalies = [
  {
    id: '1',
    titre: 'Baisse trafic cargo',
    description: 'Diminution de 15% du trafic cargo en septembre',
    severite: 'moyenne',
    date: '2024-09-15'
  },
  {
    id: '2',
    titre: 'Retards compagnie XY',
    description: 'Augmentation des retards de 25% pour la compagnie XY',
    severite: 'haute',
    date: '2024-09-20'
  }
];

export const compagnies = ['Toutes', 'Air France', 'Emirates', 'Lufthansa', 'British Airways', 'Qatar Airways', 'FedEx'];
export const aeroports = ['Tous', 'Charles de Gaulle', 'Orly', 'Lyon', 'Nice', 'Marseille', 'Toulouse'];
export const typesTrafic = ['Tous', 'Domestique', 'International', 'Régional'];
export const annees = ['Toutes', '2024', '2023', '2022'];
export const mois = ['Janvier', 'Février', 'Mars','Avril', 'Mai', 'Juin','Juillet','Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export interface PassengerData {
  id: string;
  month: string;
  year: string;
  airline: string;
  airport: string;
  trafficType: 'International' | 'Regional' | 'Domestic';
  passengers: number;
  flights: number;
  feesCollected: number;
}
export const passengersData: PassengerData[] = [
  // 2025 data
  { id: '1', month: '2025-01', year: '2025', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 15420, flights: 95, feesCollected: 308400000 },
  { id: '2', month: '2025-01', year: '2025', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 12850, flights: 78, feesCollected: 257000000 },
  { id: '3', month: '2025-01', year: '2025', airline: 'Turkish Airlines', airport: 'Ivato International Airport', trafficType: 'International', passengers: 8950, flights: 52, feesCollected: 179000000 },
  { id: '4', month: '2025-01', year: '2025', airline: 'Air Austral', airport: 'Ivato International Airport', trafficType: 'Regional', passengers: 6780, flights: 42, feesCollected: 135600000 },
  { id: '5', month: '2025-01', year: '2025', airline: 'Tsaradia', airport: 'Ivato International Airport', trafficType: 'Domestic', passengers: 4520, flights: 68, feesCollected: 90400000 },
  { id: '6', month: '2025-02', year: '2025', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 16200, flights: 98, feesCollected: 324000000 },
  { id: '7', month: '2025-02', year: '2025', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 13450, flights: 82, feesCollected: 269000000 },
  { id: '8', month: '2025-02', year: '2025', airline: 'Turkish Airlines', airport: 'Ivato International Airport', trafficType: 'International', passengers: 9320, flights: 56, feesCollected: 186400000 },
  { id: '9', month: '2025-02', year: '2025', airline: 'Air Austral', airport: 'Ivato International Airport', trafficType: 'Regional', passengers: 7100, flights: 45, feesCollected: 142000000 },
  { id: '10', month: '2025-02', year: '2025', airline: 'Tsaradia', airport: 'Ivato International Airport', trafficType: 'Domestic', passengers: 4850, flights: 72, feesCollected: 97000000 },
  { id: '11', month: '2025-03', year: '2025', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 17800, flights: 102, feesCollected: 356000000 },
  { id: '12', month: '2025-03', year: '2025', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 14200, flights: 85, feesCollected: 284000000 },
  { id: '13', month: '2025-03', year: '2025', airline: 'Emirates', airport: 'Ivato International Airport', trafficType: 'International', passengers: 11500, flights: 48, feesCollected: 230000000 },
  { id: '14', month: '2025-03', year: '2025', airline: 'Air Austral', airport: 'Nosy Be Airport', trafficType: 'Regional', passengers: 5200, flights: 38, feesCollected: 104000000 },
  { id: '15', month: '2025-03', year: '2025', airline: 'Tsaradia', airport: 'Toamasina Airport', trafficType: 'Domestic', passengers: 3800, flights: 58, feesCollected: 76000000 },
  { id: '16', month: '2025-04', year: '2025', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 18500, flights: 105, feesCollected: 370000000 },
  { id: '17', month: '2025-04', year: '2025', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 15100, flights: 88, feesCollected: 302000000 },
  { id: '18', month: '2025-04', year: '2025', airline: 'Emirates', airport: 'Ivato International Airport', trafficType: 'International', passengers: 12200, flights: 52, feesCollected: 244000000 },
  { id: '19', month: '2025-04', year: '2025', airline: 'Air Austral', airport: 'Nosy Be Airport', trafficType: 'Regional', passengers: 6100, flights: 42, feesCollected: 122000000 },
  { id: '20', month: '2025-04', year: '2025', airline: 'Tsaradia', airport: 'Toamasina Airport', trafficType: 'Domestic', passengers: 4200, flights: 62, feesCollected: 84000000 },
  // 2024 data for comparison
  { id: '21', month: '2024-01', year: '2024', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 14200, flights: 88, feesCollected: 284000000 },
  { id: '22', month: '2024-01', year: '2024', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 11800, flights: 72, feesCollected: 236000000 },
  { id: '23', month: '2024-01', year: '2024', airline: 'Turkish Airlines', airport: 'Ivato International Airport', trafficType: 'International', passengers: 8200, flights: 48, feesCollected: 164000000 },
  { id: '24', month: '2024-01', year: '2024', airline: 'Air Austral', airport: 'Ivato International Airport', trafficType: 'Regional', passengers: 6200, flights: 38, feesCollected: 124000000 },
  { id: '25', month: '2024-01', year: '2024', airline: 'Tsaradia', airport: 'Ivato International Airport', trafficType: 'Domestic', passengers: 4100, flights: 62, feesCollected: 82000000 },
  { id: '26', month: '2024-02', year: '2024', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 14850, flights: 92, feesCollected: 297000000 },
  { id: '27', month: '2024-02', year: '2024', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 12350, flights: 75, feesCollected: 247000000 },
  { id: '28', month: '2024-02', year: '2024', airline: 'Turkish Airlines', airport: 'Ivato International Airport', trafficType: 'International', passengers: 8650, flights: 52, feesCollected: 173000000 },
  { id: '29', month: '2024-02', year: '2024', airline: 'Air Austral', airport: 'Ivato International Airport', trafficType: 'Regional', passengers: 6500, flights: 42, feesCollected: 130000000 },
  { id: '30', month: '2024-02', year: '2024', airline: 'Tsaradia', airport: 'Ivato International Airport', trafficType: 'Domestic', passengers: 4400, flights: 65, feesCollected: 88000000 },
  { id: '31', month: '2024-03', year: '2024', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 16200, flights: 98, feesCollected: 324000000 },
  { id: '32', month: '2024-03', year: '2024', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 13100, flights: 78, feesCollected: 262000000 },
  { id: '33', month: '2024-03', year: '2024', airline: 'Emirates', airport: 'Ivato International Airport', trafficType: 'International', passengers: 10500, flights: 42, feesCollected: 210000000 },
  { id: '34', month: '2024-03', year: '2024', airline: 'Air Austral', airport: 'Nosy Be Airport', trafficType: 'Regional', passengers: 4800, flights: 35, feesCollected: 96000000 },
  { id: '35', month: '2024-03', year: '2024', airline: 'Tsaradia', airport: 'Toamasina Airport', trafficType: 'Domestic', passengers: 3500, flights: 52, feesCollected: 70000000 },
  { id: '36', month: '2024-04', year: '2024', airline: 'Air Madagascar', airport: 'Ivato International Airport', trafficType: 'International', passengers: 17100, flights: 102, feesCollected: 342000000 },
  { id: '37', month: '2024-04', year: '2024', airline: 'Air France', airport: 'Ivato International Airport', trafficType: 'International', passengers: 14000, flights: 82, feesCollected: 280000000 },
  { id: '38', month: '2024-04', year: '2024', airline: 'Emirates', airport: 'Ivato International Airport', trafficType: 'International', passengers: 11200, flights: 48, feesCollected: 224000000 },
  { id: '39', month: '2024-04', year: '2024', airline: 'Air Austral', airport: 'Nosy Be Airport', trafficType: 'Regional', passengers: 5600, flights: 38, feesCollected: 112000000 },
  { id: '40', month: '2024-04', year: '2024', airline: 'Tsaradia', airport: 'Toamasina Airport', trafficType: 'Domestic', passengers: 3900, flights: 58, feesCollected: 78000000 },
];