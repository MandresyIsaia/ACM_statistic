using api.DTO.performance.aeroport;
using api.DTO.performance.compagnie;
using api.Repository.performance.aeroport;
using api.Repository.performance.compagnie;

namespace api.Service.performance.aeroport
{
    public class RedevanceAeorportGlobalService
    {
        private readonly RedevanceAeroportGlobalRepository _redevanceAeroportGlobalRepository;

        public RedevanceAeorportGlobalService(RedevanceAeroportGlobalRepository repository)
        {
            _redevanceAeroportGlobalRepository = repository;
        }
        public async Task<List<RedevanceAeroportGlobalDTO>> GetRedevanceAeroportGlobal(int annee)
        {
            return await _redevanceAeroportGlobalRepository.GetRedevanceAeroportGlobal(annee);
        }
    }
}
