using api.DTO.dashboard;
using api.Service.dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        public DashboardController(DashboardService dashboardService) { 
            _dashboardService = dashboardService;
        }
        [HttpGet]
        public async Task<ActionResult<DashBoardDTO>> GetDashboard(int annee)
        {
            try
            {
                var dashboard = await _dashboardService.GetDashBoard(annee);
                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return BadRequest(ex.ToString());
            }
        }
    }
}
