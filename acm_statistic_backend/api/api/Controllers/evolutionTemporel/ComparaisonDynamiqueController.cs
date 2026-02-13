using api.DTO.evolutionTemporel;
using api.Service.evolutionTemporel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.evolutionTemporel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ComparaisonDynamiqueController : ControllerBase
    {
        private readonly ComparaisonDynamiqueService _comparaisonDynamiqueService;
        private readonly ComparaisonDynamiqueResumerService _comparaisonDynamiqueResumerService;
        public ComparaisonDynamiqueController(ComparaisonDynamiqueService service,ComparaisonDynamiqueResumerService comparaisonDynamiqueResumerService) { 
                _comparaisonDynamiqueService = service;
            _comparaisonDynamiqueResumerService = comparaisonDynamiqueResumerService;
        }
        [HttpGet]
        public async Task<ActionResult<List<ComparaisonDynamiqueDTO>>> GetComparaisonDynamique(int annee)
        {
            try
            {
                var comparaisonDynamique = await _comparaisonDynamiqueService.GetComparaisonDynamique(annee);
                var comparaisonResumer = await _comparaisonDynamiqueResumerService.GetComparaisonDynamiqueResumer(annee);
                return Ok(
                    new
                    {
                        comparaisonDynamique,
                        comparaisonResumer
                    }
                    );
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
