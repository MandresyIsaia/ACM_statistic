import { formatCurrency } from "../../utils/formatter";

export class AnomalieRedevance {
  annee: number;
  mois: number;
  redevances: number;
  id: string;
  description?: string;
  severite?: string;
  date?: string;
  
  constructor(init?: Partial<AnomalieRedevance>, seuil?: number) {
    Object.assign(this, init);

    // 🔹 Générer un identifiant unique si non fourni
    if (!this.id) {
      this.id = this.generateId();
    }

    // 🔹 Valeur par défaut pour la sévérité
    if (!this.severite) {
      this.severite = "haute";
    }

    // 🔹 Tableau des mois en français
    const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    // 🔹 Générer la date lisible : "Novembre 2025"
    if (!this.date && this.annee && this.mois) {
      const nomMois = moisNoms[this.mois - 1] ?? `Mois ${this.mois}`;
      this.date = `${nomMois} ${this.annee}`;
    }

    // 🔹 Générer la description selon la comparaison avec le seuil
    if (!this.description && this.redevances !== undefined && seuil !== undefined) {
      if (this.redevances < seuil) {
        this.description = `Redevance en très forte baisse ${formatCurrency(this.redevances)} `;
        this.description = `Redevance en très forte baisse ${formatCurrency(this.redevances)} `;
      } else {
        this.description = `Redevance en très forte hausse ${formatCurrency(this.redevances)}`;
      }
    }
  }

  // Générateur d'identifiant unique simple
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
