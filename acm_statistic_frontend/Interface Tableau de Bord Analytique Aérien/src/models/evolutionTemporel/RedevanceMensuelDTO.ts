export class RedevanceMensuelDTO{
    mois: number;
    mois_lettre: string | null;
    annee :number; 
    type_trafic: string | null;
    montant: number;
    compagnie: string | null;
    aeroport: string | null;

    constructor(init?: Partial<RedevanceMensuelDTO>) {
    Object.assign(this, init);
    }

}