using api.DTO.redevances;
using api.ModelML.projection_future_redevance;
using api.Service.modelMl.anomalieRedevance;
using api.Service.modelMl.projectionRedevance;
using api.Service.redevanceAnneeMois;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ML;

namespace api.Controllers.modelMl.anomalieRedevance
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnomalieRedevanceController : ControllerBase
    {
        private readonly RedevanceAnneeMoisService _redevanceAnneeMoisService;
        private readonly AnomalieRedevanceService _anomalieRedevanceService;
        public AnomalieRedevanceController(RedevanceAnneeMoisService redevanceAnneeMoisService, AnomalieRedevanceService anomalieRedevanceService)
        {
            _redevanceAnneeMoisService = redevanceAnneeMoisService;
            _anomalieRedevanceService = anomalieRedevanceService;
        }
        [HttpGet("train")]
        public IActionResult Train()
        {
            string projectRoot = Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.FullName;
            string filePath = Path.Combine(projectRoot, "donnees", "redevances_mois_genere.csv");
            List<ModelRedevanceDTO> data = _anomalieRedevanceService.LoadDataAsList(filePath);
            _anomalieRedevanceService.trainSave(data);

            return Ok(new { Message = "Modèle entraîné avec succès" });
        }
        [HttpGet("predict/{annee}")]
        public async Task<IActionResult> Predict(int annee)
        {
            if (annee <= 0)
                return BadRequest("Année invalide.");
            List<RedevanceAnneeMoisDTO> reels = await _redevanceAnneeMoisService.GetRedevanceMoisAnnee(annee);
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
            var prediction = _anomalieRedevanceService.loadPredict(data);

            return Ok(prediction );

        }
    }
}
