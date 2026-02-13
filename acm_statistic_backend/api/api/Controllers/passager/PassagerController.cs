using api.DTO.dashboard;
using api.Repository.passager;
using api.Service.dashboard;
using api.Service.evolutionTemporel;
using api.Service.mois;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.passager
{
    [Route("api/[controller]")]
    [ApiController]
    public class PassagerController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        private readonly PassagerComparaisonRepository _passagerComparaisonRepository;
        private readonly PassagerDetailRepository _passagerDetailRepository;
        private readonly PassagerRepartitionRepository _passagerRepartitionRepository;
        private readonly MonthService _monthService;

        public PassagerController(DashboardService dashboardService, PassagerComparaisonRepository passagerComparaisonRepository,PassagerDetailRepository passagerDetailRepository, PassagerRepartitionRepository passagerRepartitionRepository, MonthService monthService)
        {
            _dashboardService = dashboardService;
            _passagerComparaisonRepository = passagerComparaisonRepository;
            _passagerDetailRepository = passagerDetailRepository;
            _passagerRepartitionRepository = passagerRepartitionRepository;
            _monthService = monthService;
        }
        [HttpGet]
        public async Task<ActionResult<DashBoardDTO>> GetPassagers(int annee, int annee_autre)
        {
            try
            {
                var dashboard = await _dashboardService.GetDashBoard(annee);
                var passager_comparaison = await _passagerComparaisonRepository.GetComparaison(annee,annee_autre);
                var passager_repartition = await _passagerRepartitionRepository.GetRepartitionPassager(annee);
                var passager_detail = await _passagerDetailRepository.GetPassagerDetail(annee);
                var months = await _monthService.getAll();
                return Ok(new
                {
                    dashboard,
                    months,
                    passager_comparaison,
                    passager_repartition,
                    passager_detail
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            }
        }

    }
}
