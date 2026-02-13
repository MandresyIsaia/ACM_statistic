export class RepartitionGlobalCompagnieDTO{
    part: number;
    vols :number; 
    montant: number;
    compagnie: string | null;

    constructor(init?: Partial<RepartitionGlobalCompagnieDTO>) {
    Object.assign(this, init);
    }   
}