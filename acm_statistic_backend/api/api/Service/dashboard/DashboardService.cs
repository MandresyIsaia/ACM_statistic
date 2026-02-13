using api.DTO.dashboard;
using api.DTO.evolutionTemporel;
using api.Repository.dashboard;
using api.Repository.evolutionTemporel;

namespace api.Service.dashboard
{
    public class DashboardService
    {
        private readonly DashboardRepository _repository;
        public DashboardService(DashboardRepository repository)
        {
            _repository = repository;
        }
        public async Task<DashBoardDTO> GetDashBoard(int annee)
        {
            return await _repository.GetDashBoard(annee);
        }
    }
}
