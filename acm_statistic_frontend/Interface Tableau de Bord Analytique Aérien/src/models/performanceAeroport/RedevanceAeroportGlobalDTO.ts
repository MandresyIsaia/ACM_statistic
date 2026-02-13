export class RedevanceAeroportGlobalDTO{
    passagers: number;
    vols :number; 
    montant: number;
    aeroport: string | null;

    constructor(init?: Partial<RedevanceAeroportGlobalDTO>) {
    Object.assign(this, init);
    }   
}