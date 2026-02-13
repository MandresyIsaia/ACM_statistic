using api.DTO.performance.compagnie;
using api.Repository.performance.compagnie;

namespace api.Service.performance.compagnie
{
    public class RepartitionTypeCompagnieMoisService
    {
        private readonly RepartitionTypeCompagnieMoisRepository _repartitionTypeCompagnieMoisRepository;
        public RepartitionTypeCompagnieMoisService(RepartitionTypeCompagnieMoisRepository repartitionTypeCompagnieMoisRepository)
        {
            _repartitionTypeCompagnieMoisRepository = repartitionTypeCompagnieMoisRepository;
        }
        public async Task<List<RepartitionTypeCompagnieMoisDTO>> GetRepartionTypeRegionalMois(int annee)
        {
            return await _repartitionTypeCompagnieMoisRepository.GetRepartionTypeMois(annee, "Régional");
        }
        public async Task<List<RepartitionTypeCompagnieMoisDTO>> GetRepartionTypeInternationalMois(int annee)
        {
            return await _repartitionTypeCompagnieMoisRepository.GetRepartionTypeMois(annee, "International");
        }
        public async Task<List<RepartitionTypeCompagnieMoisDTO>> GetRepartionTypeMoisDomestiqueMois(int annee)
        {
            return await _repartitionTypeCompagnieMoisRepository.GetRepartionTypeMois(annee, "Domestique");
        }
    }
}
