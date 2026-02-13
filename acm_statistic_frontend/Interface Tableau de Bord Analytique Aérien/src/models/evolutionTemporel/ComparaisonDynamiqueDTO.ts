export class ComparaisonDynamiqueDTO{
    mois: number;
    mois_Lettre: string | null;
    total_Annee: number;
    total_Annee_Precedente: number;
    difference: number;
    pourcentage_Variation: number | null;
    variation_mois : number | null;

    constructor(init?: Partial<ComparaisonDynamiqueDTO>) {
    Object.assign(this, init);
    }

}