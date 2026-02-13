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
    public class ComparaisonDynamiqueResumerController : ControllerBase
    {
        private readonly ComparaisonDynamiqueResumerService _service;
        public ComparaisonDynamiqueResumerController(ComparaisonDynamiqueResumerService service) { 
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<ComparaisonDynamiqueResumerDTO>> GetComparaisonDynamiqueResumer(int annee)
        {
            try
            {
                var comparaisonDynamiqueResumer = await _service.GetComparaisonDynamiqueResumer(annee);
                return Ok(comparaisonDynamiqueResumer);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
