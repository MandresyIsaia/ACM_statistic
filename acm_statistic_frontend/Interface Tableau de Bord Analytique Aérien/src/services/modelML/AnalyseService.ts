import { AnomalieRedevance } from "../../models/anomalie/AnomalieRedevance";
import { AnomalieCompagnieRedevance } from "../../models/anomalie/AnomalieRedevanceCompagnie";
import { RedevanceCsvDTO } from "../../models/modelML/RedevanceCsvDTO";
import { ApiService } from "../ApiService";

export async function fetchAnalyse(
  annee: number
): Promise<{
  reels: RedevanceCsvDTO[];
  prediction: RedevanceCsvDTO[];
  anomalieRedevance: AnomalieRedevance[];
  anomalieRedevanceCompagnie: AnomalieCompagnieRedevance[];
}> {
  const repartionGlobal = await ApiService.getWithToken<{
    reels: RedevanceCsvDTO[];
    prediction: RedevanceCsvDTO[];
    anomalieRedevance: AnomalieRedevance[];
    anomalieRedevanceCompagnie: AnomalieCompagnieRedevance[];
  }>(`Analyse?annee=${annee}`);

  
  const redevances = repartionGlobal.reels.map(r => r.redevances).filter(v => v !== null && v !== undefined);
  const moyenne = redevances.length > 0
    ? redevances.reduce((sum, val) => sum + val, 0) / redevances.length
    : 0;

  
  repartionGlobal.anomalieRedevance =
    repartionGlobal.anomalieRedevance.map(a => new AnomalieRedevance(a, moyenne));

  
  repartionGlobal.anomalieRedevanceCompagnie =
    repartionGlobal.anomalieRedevanceCompagnie.map(a => new AnomalieCompagnieRedevance(a));

  return repartionGlobal;
}
