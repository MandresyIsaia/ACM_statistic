import { DashboardDTO } from "../../models/dashboard/DashboardDTO";
import { ApiService } from "../ApiService";
export async function fetchDashboard(): Promise<DashboardDTO> {
    const currentYear = new Date().getFullYear();
    const dashboard = await ApiService.getWithToken<DashboardDTO>(
        `Dashboard?annee=${currentYear}`
    );
    console.log(dashboard);
    return  dashboard;
}