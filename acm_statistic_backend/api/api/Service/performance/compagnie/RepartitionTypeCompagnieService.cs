using api.DTO.performance.compagnie;
using api.Repository.performance.compagnie;

namespace api.Service.performance.compagnie
{
    public class RepartitionTypeCompagnieService
    {
        private readonly RepartitionTypeCompagnieRepository _repartitionTypeCompagnieRepository;

        public RepartitionTypeCompagnieService(RepartitionTypeCompagnieRepository repartitionTypeCompagnieRepository)
        {
            _repartitionTypeCompagnieRepository = repartitionTypeCompagnieRepository;
        }
        public async Task<List<RepartitionTypeCompagnieDTO>> GetRepartionTypeRegional(int annee)
        {
            return await _repartitionTypeCompagnieRepository.GetRepartionType(annee, "Régional");
        }
        public async Task<List<RepartitionTypeCompagnieDTO>> GetRepartionTypeInternational(int annee)
        {
            return await _repartitionTypeCompagnieRepository.GetRepartionType(annee, "International");
        }
        public async Task<List<RepartitionTypeCompagnieDTO>> GetRepartionTypeDomestique(int annee)
        {
            return await _repartitionTypeCompagnieRepository.GetRepartionType(annee, "Domestique");
        }
    }
}
