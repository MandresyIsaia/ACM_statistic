using api.DTO.evolutionTemporel;
using api.DTO.performance.compagnie;
using api.Repository.evolutionTemporel;
using api.Repository.performance.compagnie;

namespace api.Service.performance.compagnie
{
    public class RepartitionGlobalCompagnieService
    {
        private readonly RepartitionGlobalCompagnieRepository _repartitionGlobalCompagnieRepository;

        public RepartitionGlobalCompagnieService(RepartitionGlobalCompagnieRepository repartitionGlobalCompagnieRepository)
        {
            _repartitionGlobalCompagnieRepository = repartitionGlobalCompagnieRepository;
        }
        public async Task<List<RepartitionGlobalCompagnieDTO>> GetRepartiionGlobal(int annee)
        {
            return await _repartitionGlobalCompagnieRepository.GetRepartiionGlobal(annee);
        }
    }
}
