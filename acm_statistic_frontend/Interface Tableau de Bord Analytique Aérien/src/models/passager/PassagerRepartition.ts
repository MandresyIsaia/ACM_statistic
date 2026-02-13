export class PassagerRepartition{
    
    type_trafic: string | null;
    repartition: number;

    constructor(init?: Partial<PassagerRepartition>) {
    Object.assign(this, init);
    }

}