using api.DTO.evolutionTemporel;
using api.Service.evolutionTemporel;
using api.Service.mois;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.evolutionTemporel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RedevanceMensuelController : ControllerBase
    {
        private readonly RedevanceMensuelService redevanceMensuelService;
        private readonly MonthService _monthService;
        
        public RedevanceMensuelController(RedevanceMensuelService service,MonthService monthService)
        {
            redevanceMensuelService = service;
            this._monthService = monthService;
        }
        [HttpGet]
        public async Task<ActionResult<List<RedevanceMensuelDTO>>> GetRedevanceMensuel(int annee)
        {
            try
            {
                var comparaisonDynamique = await redevanceMensuelService.GetRedevanceMensuel(annee);
                var months = await _monthService.getAll();
                return Ok(new{ 
                    comparaisonDynamique,
                    months
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
