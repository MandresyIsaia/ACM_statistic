import { RedevanceCsvDTO } from "../../models/modelML/RedevanceCsvDTO";
import { ApiService } from "../ApiService";

export async function fetchPredictionRedevance(annee:number): Promise<{reels:RedevanceCsvDTO[]; prediction: RedevanceCsvDTO[]}> {
    const repartionGLobal = await ApiService.getWithToken<{reels:RedevanceCsvDTO[]; prediction: RedevanceCsvDTO[]}>(
        `TrainPredictRedevance/predict/${annee}`
    );
    return  repartionGLobal;
}