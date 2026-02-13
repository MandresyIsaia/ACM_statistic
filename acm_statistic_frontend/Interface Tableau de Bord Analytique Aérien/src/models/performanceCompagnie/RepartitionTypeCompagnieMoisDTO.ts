export class RepartitionTypeCompagnieMoisDTO{
    mois: number;
    mois_lettre: string;
    montant?: number; 
    compagnie: string;
    vols: number;
    part?: number;
    pourcentage_variation?: number;

    constructor(init?: Partial<RepartitionTypeCompagnieMoisDTO>) {
    Object.assign(this, init);
    }   
}