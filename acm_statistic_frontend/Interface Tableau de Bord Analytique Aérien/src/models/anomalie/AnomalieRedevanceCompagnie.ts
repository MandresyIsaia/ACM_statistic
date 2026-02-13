import { formatCurrency } from "../../utils/formatter";

const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
export class AnomalieCompagnieRedevance {
  id?: string;
  annee: number;
  mois: number;
  redevances: number;
  compagnies: string;
  compagnieEncoder: number;
  description?: string;
  severite?: string;
  date?: string;

  constructor(init?: Partial<AnomalieCompagnieRedevance>) {
    Object.assign(this, init);

    
    if (!this.id) {
      this.id = this.generateId();
    }

    if (!this.severite) {
      this.severite = "haute";
    }

    if (!this.date && this.annee && this.mois) {
      const nomMois = moisNoms[this.mois - 1] ?? `Mois ${this.mois}`;
      this.date = `${nomMois} ${this.annee}`;
    }

    if (!this.description && this.compagnies && this.redevances !== undefined) {
      this.description = `Une forte augmentation des redevances pour ${this.compagnies} avec ${formatCurrency(this.redevances)}`;
    }
    
  }

  
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
