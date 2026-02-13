export class RedevanceAeroportTypeDTO{
    passagers: number;
    vols :number; 
    montant: number;
    aeroport: string | null;
    type_trafic: string | null;

    constructor(init?: Partial<RedevanceAeroportTypeDTO>) {
    Object.assign(this, init);
    }   
}