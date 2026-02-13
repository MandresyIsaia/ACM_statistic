export class RepartitionGlobalCompagnieMoisDTO{
    mois :number; 
    mois_lettre : string;
    vols :number; 
    montant?: number;
    compagnie?: string ;
    part? :number ; 
    pourcentage_variation? : number ;

    constructor(init?: Partial<RepartitionGlobalCompagnieMoisDTO>) {
    Object.assign(this, init);
    }   
}