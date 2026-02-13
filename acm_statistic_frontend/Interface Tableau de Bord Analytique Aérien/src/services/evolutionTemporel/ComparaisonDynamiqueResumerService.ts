import { ApiService } from "../ApiService";
import { ComparaisonDynamiqueResumerDTO } from "../../models/evolutionTemporel/ComparaisonDynamiqueResumerDTO";
export async function fetchComparaisonDynamiqueResumer(): Promise<ComparaisonDynamiqueResumerDTO> {
    const currentYear = new Date().getFullYear();
    const comparaisonDynamiqueResumer = await ApiService.getWithToken<ComparaisonDynamiqueResumerDTO>(
        `ComparaisonDynamiqueResumer?annee=${currentYear}`
    );
    console.log(comparaisonDynamiqueResumer);
    return  comparaisonDynamiqueResumer;
}