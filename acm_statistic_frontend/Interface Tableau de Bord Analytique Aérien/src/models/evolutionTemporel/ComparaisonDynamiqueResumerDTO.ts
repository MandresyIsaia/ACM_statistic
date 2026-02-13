export class ComparaisonDynamiqueResumerDTO{
    annee_actuelle: number;
    annee_precedente: number;
    variation: number | null;

    constructor(init?: Partial<ComparaisonDynamiqueResumerDTO>) {
    Object.assign(this, init);
    }

}