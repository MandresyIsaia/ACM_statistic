import { ApiService } from "../ApiService";
import { ComparaisonDynamiqueDTO } from "../../models/evolutionTemporel/ComparaisonDynamiqueDTO";
import { ComparaisonDynamiqueResumerDTO} from "../../models/evolutionTemporel/ComparaisonDynamiqueResumerDTO";
export async function fetchComparaisonDynamique(): Promise<{ comparaisonDynamique:ComparaisonDynamiqueDTO[];comparaisonResumer:ComparaisonDynamiqueResumerDTO[]}> {
    const currentYear = new Date().getFullYear();
    const comparaisonDynamique = await ApiService.getWithToken<{ comparaisonDynamique:ComparaisonDynamiqueDTO[];comparaisonResumer:ComparaisonDynamiqueResumerDTO[]}>(
        `ComparaisonDynamique?annee=${currentYear}`
    );
    console.log(comparaisonDynamique);
    return  comparaisonDynamique;
}