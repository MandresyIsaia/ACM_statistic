export class DashboardDTO{
    compagnie: number;
    montant: number;
    vols: number;
    passagers: number | null;

    constructor(init?: Partial<DashboardDTO>) {
    Object.assign(this, init);
    }

}