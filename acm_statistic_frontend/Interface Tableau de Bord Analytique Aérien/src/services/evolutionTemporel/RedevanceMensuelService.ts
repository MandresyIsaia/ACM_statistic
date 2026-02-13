import { ApiService } from "../ApiService";
import { RedevanceMensuelDTO } from "../../models/evolutionTemporel/RedevanceMensuelDTO";
import { Month } from "../../models/mois/Month";
export async function fetchRedevanceMensuel(annee:number): Promise<{comparaisonDynamique:RedevanceMensuelDTO[]; months: Month[]}> {
    const redevancemensuel = await ApiService.getWithToken<{comparaisonDynamique:RedevanceMensuelDTO[]; months: Month[]}>(
        `RedevanceMensuel?annee=${annee}`
    );
    console.log(redevancemensuel);
    return  redevancemensuel;
}