using api.DTO.redevances;
using api.Repository.performance.compagnie;
using api.Repository.redevance;

namespace api.Service.redevanceAnneeMois
{
    public class RedevanceAnneeMoisService
    {
        private readonly RedevanceAnneeMoisRepository _redevanceAnneeMoisRepository;

        public RedevanceAnneeMoisService(RedevanceAnneeMoisRepository redevanceAnneeMoisRepository)
        {
            _redevanceAnneeMoisRepository = redevanceAnneeMoisRepository;
        }
        public async Task<List<RedevanceAnneeMoisDTO>> GetRedevanceMoisAnnee(int annee)
        {
            return await _redevanceAnneeMoisRepository.GetRedevanceMoisAnnee(annee);
        }
    }
}
