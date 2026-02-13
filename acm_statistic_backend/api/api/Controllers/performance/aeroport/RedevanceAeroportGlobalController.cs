using api.DTO.performance.aeroport;
using api.DTO.performance.compagnie;
using api.Service.performance.aeroport;
using api.Service.performance.compagnie;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.performance.aeroport
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RedevanceAeroportGlobalController : ControllerBase
    {
        private readonly RedevanceAeorportGlobalService _redevanceAeorportGlobalService;
        private readonly RedevanceAeroportTypeService _redevanceAeorportTypelService;
        public RedevanceAeroportGlobalController(RedevanceAeorportGlobalService service, RedevanceAeroportTypeService redevanceAeorportTypelService)
        {
            _redevanceAeorportGlobalService = service;
            _redevanceAeorportTypelService = redevanceAeorportTypelService;
        }
        
        [HttpGet]
        public async Task<ActionResult<List<RedevanceAeroportGlobalDTO>>> GetRedevanceAeroportGlobal(int annee)
        {
            try
            {
                var redevance_aerport_globlal = await _redevanceAeorportGlobalService.GetRedevanceAeroportGlobal(annee);
                var redevance_aeoroport_type = await _redevanceAeorportTypelService.GetRedevanceAeroportType(annee);
                return Ok(new { redevance_aerport_globlal , redevance_aeoroport_type } );
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
