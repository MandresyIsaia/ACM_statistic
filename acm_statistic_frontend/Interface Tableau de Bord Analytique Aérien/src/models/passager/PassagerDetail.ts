export class PassagerDetail{
    mois: number;
    mois_lettre: string | null;
    annee :number; 
    type_trafic: string | null;
    montant: number;
    compagnie: string | null;
    aeroport: string | null;
    passagers: number;
    vols: number;

    constructor(init?: Partial<PassagerDetail>) {
    Object.assign(this, init);
    }

}