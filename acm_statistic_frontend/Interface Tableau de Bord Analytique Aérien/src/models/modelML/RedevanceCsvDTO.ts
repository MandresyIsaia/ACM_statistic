export class RedevanceCsvDTO {
    annee: number;
    mois: number;
    redevances: number;

    constructor(init?: Partial<RedevanceCsvDTO>) {
        Object.assign(this, init);
    }
}
