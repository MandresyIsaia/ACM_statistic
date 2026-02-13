using api.DTO.performance.compagnie;
using api.Repository.performance.compagnie;

namespace api.Service.performance.compagnie
{
    public class RepartitionGloabalCompagnieMoisService
    {
        private readonly RepartitionGlobalCompagnieMoisRepository _repartitionGlobalCompagnieMoisRepository;
        public RepartitionGloabalCompagnieMoisService(RepartitionGlobalCompagnieMoisRepository repartitionGlobalCompagnieMoisRepository)
        {
            _repartitionGlobalCompagnieMoisRepository = repartitionGlobalCompagnieMoisRepository;
        }
        public async Task<List<RepartitionGlobalCompagnieMoisDTO>> GetRepartitionGlobalMois(int annee)
        {
            return await _repartitionGlobalCompagnieMoisRepository.GetRepartitionGlobalMois(annee);
        }
    }
}
