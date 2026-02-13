using api.Repository.redevance;
using api.Service.modelMl.projectionRedevance;
using api.Service.redevanceAnneeMois;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;

namespace api.Controllers.modelMl.projectionRedevance
{
    [Route("api/[controller]")]
    //[ApiController]
    public class TrainPredictRedevanceController : ControllerBase
    {
        private readonly ProjectionService _projectionService;
        private readonly RedevanceAnneeMoisService _redevanceAnneeMoisService;

        public TrainPredictRedevanceController(ProjectionService projectionService,RedevanceAnneeMoisService redevanceAnneeMoisService)
        {
            _projectionService = projectionService;
            _redevanceAnneeMoisService = redevanceAnneeMoisService;
        }

        [HttpGet("train")]
        public IActionResult Train()
        {
            _projectionService.EntrainementSauvegard();

            return Ok(new { Message = "Modèle entraîné avec succès" });
        }
        [HttpGet("predict/{annee}")]
        public async Task<IActionResult> Predict(int annee)
        {
            if (annee <= 0)
                return BadRequest("Année invalide.");
            var reels = await _redevanceAnneeMoisService.GetRedevanceMoisAnnee(annee);
            var prediction = _projectionService.loadPredict(annee);

            return Ok(new { reels, prediction});

        }
    }
}
