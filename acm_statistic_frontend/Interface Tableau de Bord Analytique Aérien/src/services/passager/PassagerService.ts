import { ApiService } from "../ApiService";

import { Month } from "../../models/mois/Month";
import { DashboardDTO } from "../../models/dashboard/DashboardDTO";
import { PassagerComparaison } from "../../models/passager/PassagerComparison";
import { PassagerRepartition } from "../../models/passager/PassagerRepartition";
import { PassagerDetail } from "../../models/passager/PassagerDetail";
export async function fetchPassager(annee:number, anneeAutre:number): Promise<{dashboard:DashboardDTO; months: Month[];passager_comparaison: PassagerComparaison[];passager_repartition: PassagerRepartition[];passager_detail: PassagerDetail[] }> {
    const redevancemensuel = await ApiService.getWithToken<{dashboard:DashboardDTO; months: Month[];passager_comparaison: PassagerComparaison[];passager_repartition: PassagerRepartition[];passager_detail: PassagerDetail[]}>(
        `Passager?annee=${annee}&annee_autre=${anneeAutre}`
    );
    console.log(redevancemensuel);
    return  redevancemensuel;
}