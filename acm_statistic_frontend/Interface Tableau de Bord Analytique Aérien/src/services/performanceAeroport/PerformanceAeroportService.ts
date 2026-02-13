import { ApiService } from "../ApiService";
import { RedevanceAeroportGlobalDTO } from "../../models/performanceAeroport/RedevanceAeroportGlobalDTO";
import { RedevanceAeroportTypeDTO } from "../../models/performanceAeroport/RedevanceAeroportTypeDTO";
export async function fetchPerformanceAeroport(annee:number): Promise<{redevance_aerport_globlal: RedevanceAeroportGlobalDTO[]; redevance_aeoroport_type:RedevanceAeroportTypeDTO[] }> {
    const repartionGLobal = await ApiService.getWithToken<{redevance_aerport_globlal: RedevanceAeroportGlobalDTO[]; redevance_aeoroport_type:RedevanceAeroportTypeDTO[] }>(
        `RedevanceAeroportGlobal?annee=${annee}`
    );
    console.log(repartionGLobal);
    return  repartionGLobal;
}