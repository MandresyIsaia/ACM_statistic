using api.DTO.performance.compagnie;
using api.DTO.redevances;
using api.ModelML.anomalie_redevance_compagnie.modelBaseAnomalie;
using api.ModelML.projection_future_redevance;
using api.Service.exploitantService;
using api.Service.modelMl.anomalieRedevance;
using api.Service.modelMl.anomalieRedevanceCompagnie;
using api.Service.modelMl.projectionRedevance;
using api.Service.performance.compagnie;
using api.Service.redevanceAnneeMois;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.modelMl.analyse
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnalyseController : ControllerBase
    {
        private readonly ProjectionService _projectionService;
        private readonly RedevanceAnneeMoisService _redevanceAnneeMoisService;
        private readonly AnomalieRedevanceCompagnieService _anomalieRedevanceCompagnieService;
        private readonly RepartitionGloabalCompagnieMoisService _repartitionGloabalCompagnieMoisService;
        private readonly ExploitantService _exploitantService;
        private readonly AnomalieRedevanceService _anomalieRedevanceService;
        public AnalyseController(ProjectionService projectionService, RedevanceAnneeMoisService redevanceAnneeMoisService, AnomalieRedevanceCompagnieService anomalieRedevanceCompagnieService, RepartitionGloabalCompagnieMoisService repartitionGloabalCompagnieMoisService, ExploitantService exploitantService, AnomalieRedevanceService anomalieRedevanceService)
        {
            _projectionService = projectionService;
            _anomalieRedevanceCompagnieService = anomalieRedevanceCompagnieService;
            _repartitionGloabalCompagnieMoisService = repartitionGloabalCompagnieMoisService;
            _exploitantService = exploitantService;
            _redevanceAnneeMoisService = redevanceAnneeMoisService;
            _anomalieRedevanceService = anomalieRedevanceService;
        }
        [HttpGet]
        public async Task<ActionResult> Predict(int annee)
        {
            if (annee <= 0)
                return BadRequest("Année invalide.");
            var reels = await _redevanceAnneeMoisService.GetRedevanceMoisAnnee(annee);
            var prediction = _projectionService.loadPredict(annee);

            var data = new List<ModelRedevanceDTO>();
            foreach (var r in reels)
            {
                data.Add(new ModelRedevanceDTO
                {
                    Annee = r.Annee,
                    Mois = r.Mois,
                    Redevances = (float)(r.Redevances ?? 0)
                });
            }
            var anomalieRedevance = _anomalieRedevanceService.loadPredict(data);


            List<RepartitionGlobalCompagnieMoisDTO> reels1 = await _repartitionGloabalCompagnieMoisService.GetRepartitionGlobalMois(annee);
            var data1 = new List<ModelAnomalieBase>();

            foreach (var r in reels1)
            {
                data1.Add(new ModelAnomalieBase
                {
                    Annee = annee,
                    Mois = r.Mois,
                    Redevances = (float)(r.Montant ?? 0),
                    Compagnies = r.Compagnie
                });
            }
            var anomalieRedevanceCompagnie = _anomalieRedevanceCompagnieService.loadPredict(data1);

            return Ok(new { reels, prediction,anomalieRedevance,anomalieRedevanceCompagnie });

        }
    }
}
