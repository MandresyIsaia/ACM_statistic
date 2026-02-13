using api.DTO.performance.compagnie;
using api.DTO.redevances;
using api.Model.exploitants;
using api.ModelML.anomalie_redevance_compagnie.modelBaseAnomalie;
using api.ModelML.projection_future_redevance;
using api.Service.exploitantService;
using api.Service.modelMl.anomalieRedevance;
using api.Service.modelMl.anomalieRedevanceCompagnie;
using api.Service.performance.compagnie;
using api.Service.redevanceAnneeMois;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers.modelMl.anomalieRedevanceCompagnie
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnomalieRedevanceCompagnieController : ControllerBase
    {
        private readonly AnomalieRedevanceCompagnieService _anomalieRedevanceCompagnieService;
        private readonly RepartitionGloabalCompagnieMoisService _repartitionGloabalCompagnieMoisService;
        private readonly ExploitantService _exploitantService;
        public AnomalieRedevanceCompagnieController(AnomalieRedevanceCompagnieService anomalieRedevanceCompagnieService, RepartitionGloabalCompagnieMoisService repartitionGloabalCompagnieMoisService, ExploitantService exploitantService)
        {
            _anomalieRedevanceCompagnieService = anomalieRedevanceCompagnieService;
            _repartitionGloabalCompagnieMoisService = repartitionGloabalCompagnieMoisService;
            _exploitantService = exploitantService;
        }
        [HttpGet("train")]
        public async Task<IActionResult> Train()
        {
            string projectRoot = Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.FullName;
            string filePath = Path.Combine(projectRoot, "donnees", "airportax_mois_compagnie.csv");
            List<ModelAnomalieBase> data = _anomalieRedevanceCompagnieService.LoadDataAsList(filePath);
            List<Exploitant> exploitants = await _exploitantService.getAll();
            _anomalieRedevanceCompagnieService.trainSave(data,exploitants);

            return Ok(new { Message = "Modèle entraîné avec succès" });
        }
        [HttpGet("predict/{annee}")]
        public async Task<IActionResult> Predict(int annee)
        {
            if (annee <= 0)
                return BadRequest("Année invalide.");
            List<RepartitionGlobalCompagnieMoisDTO> reels = await _repartitionGloabalCompagnieMoisService.GetRepartitionGlobalMois(annee);
            var data = new List<ModelAnomalieBase>();

            foreach (var r in reels)
            {
                data.Add(new ModelAnomalieBase
                {
                    Annee = annee,
                    Mois = r.Mois,
                    Redevances = (float)(r.Montant ?? 0),
                    Compagnies = r.Compagnie
                });
            }
            var prediction = _anomalieRedevanceCompagnieService.loadPredict(data);

            return Ok(new { prediction });

        }
    }
}
