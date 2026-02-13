export class RepartitionTypeCompagnieDTO{
    part: number;
    vols :number; 
    montant: number;
    compagnie: string | null;
    type_trafic :string | null;

    constructor(init?: Partial<RepartitionTypeCompagnieDTO>) {
    Object.assign(this, init);
    }   
}