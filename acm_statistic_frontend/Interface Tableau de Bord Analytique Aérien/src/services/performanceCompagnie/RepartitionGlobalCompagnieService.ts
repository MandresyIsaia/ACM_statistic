import { ApiService } from "../ApiService";
import { RepartitionGlobalCompagnieDTO } from "../../models/performanceCompagnie/RepartitionGlobalCompagnieDTO";
import { RepartitionTypeCompagnieDTO } from "../../models/performanceCompagnie/RepartitionTypeCompagnieDTO";
import { Month } from "../../models/mois/Month";
import { RepartitionGlobalCompagnieMoisDTO } from "../../models/performanceCompagnie/RepartitionGlobalCompagnieMoisDTO";
import { RepartitionTypeCompagnieMoisDTO } from "../../models/performanceCompagnie/RepartitionTypeCompagnieMoisDTO";
export async function fetchRepartitionCompagnie(annee:number): Promise<
    {   months : Month[];
        repartition_globlal:RepartitionGlobalCompagnieDTO[]; repartition_golabal_mois : RepartitionGlobalCompagnieMoisDTO[];
        repartition_international:RepartitionTypeCompagnieDTO[];repartition_international_mois : RepartitionTypeCompagnieMoisDTO[];
        repartition_domestique:RepartitionTypeCompagnieDTO[]; repartition_domestique_mois: RepartitionTypeCompagnieMoisDTO[];
        repartition_regional:RepartitionTypeCompagnieDTO[]; repartition_regional_mois : RepartitionTypeCompagnieMoisDTO[]
    
    }> {
    const repartionCompagnie = await ApiService.getWithToken<
    {   months : Month[];
        repartition_globlal:RepartitionGlobalCompagnieDTO[]; repartition_golabal_mois : RepartitionGlobalCompagnieMoisDTO[];
        repartition_international:RepartitionTypeCompagnieDTO[];repartition_international_mois : RepartitionTypeCompagnieMoisDTO[];
        repartition_domestique:RepartitionTypeCompagnieDTO[]; repartition_domestique_mois: RepartitionTypeCompagnieMoisDTO[];
        repartition_regional:RepartitionTypeCompagnieDTO[]; repartition_regional_mois : RepartitionTypeCompagnieMoisDTO[]
    
    }>
    (
        `RepartitionGlobalCompagnie?annee=${annee}`
    );
    console.log(repartionCompagnie);
    return  repartionCompagnie;
}