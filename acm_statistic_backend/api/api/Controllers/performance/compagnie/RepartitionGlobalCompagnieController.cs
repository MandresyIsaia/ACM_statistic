using api.DTO.evolutionTemporel;
using api.DTO.performance.compagnie;
using api.Repository.mois;
using api.Service.evolutionTemporel;
using api.Service.mois;
using api.Service.performance.compagnie;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.performance.compagnie
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RepartitionGlobalCompagnieController : ControllerBase
    {
        private readonly RepartitionGlobalCompagnieService _repartitionGlobalCompagnieService;
        private readonly RepartitionTypeCompagnieService _repartitionTypeCompagnieService;
        private readonly RepartitionTypeCompagnieMoisService _repartitionTypeMoisService;
        private readonly RepartitionGloabalCompagnieMoisService _repartitionGloabalCompagnieMoisService;
        private readonly MonthService _monthService;
        public RepartitionGlobalCompagnieController(RepartitionGlobalCompagnieService repartitionGlobalCompagnieService,RepartitionTypeCompagnieService repartitionTypeCompagnieService
            , RepartitionTypeCompagnieMoisService repartitionTypeMoisService, RepartitionGloabalCompagnieMoisService repartitionGloabalCompagnieMoisService,
            MonthService monthService)
        {
            _repartitionGlobalCompagnieService = repartitionGlobalCompagnieService;
            _repartitionTypeCompagnieService = repartitionTypeCompagnieService;
            _repartitionTypeMoisService = repartitionTypeMoisService;
            _repartitionGloabalCompagnieMoisService = repartitionGloabalCompagnieMoisService;
            _monthService = monthService;
        }
        [HttpGet]
        public async Task<ActionResult<List<RepartitionGlobalCompagnieDTO>>> GetRepartiionGlobal(int annee)
        {
            try
            {
                var months = await _monthService.getAll();

                var repartition_globlal = await _repartitionGlobalCompagnieService.GetRepartiionGlobal(annee);
                var repartition_golabal_mois = await _repartitionGloabalCompagnieMoisService.GetRepartitionGlobalMois(annee);

                var repartition_regional= await _repartitionTypeCompagnieService.GetRepartionTypeRegional(annee);
                var repartition_regional_mois = await _repartitionTypeMoisService.GetRepartionTypeRegionalMois(annee);

                var repartition_international = await _repartitionTypeCompagnieService.GetRepartionTypeInternational(annee);
                var repartition_international_mois = await _repartitionTypeMoisService.GetRepartionTypeInternationalMois(annee);

                var repartition_domestique = await _repartitionTypeCompagnieService.GetRepartionTypeDomestique(annee);
                var repartition_domestique_mois = await _repartitionTypeMoisService.GetRepartionTypeMoisDomestiqueMois(annee);
                return Ok(new
                {
                    months,
                    repartition_globlal,
                    repartition_golabal_mois,
                    repartition_international,
                    repartition_international_mois,
                    repartition_domestique,
                    repartition_domestique_mois,
                    repartition_regional,
                    repartition_regional_mois
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
