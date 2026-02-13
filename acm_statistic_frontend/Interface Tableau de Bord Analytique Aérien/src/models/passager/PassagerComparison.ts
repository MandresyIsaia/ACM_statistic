export class PassagerComparaison{
    mois: number;
    mois_lettre: string | null;
    annee :number; 
    type_trafic: string | null;
    montant: number;
    compagnie: string | null;
    passagers_actuelle: number;
    passagers_autre: number;

    constructor(init?: Partial<PassagerComparaison>) {
    Object.assign(this, init);
    }

}