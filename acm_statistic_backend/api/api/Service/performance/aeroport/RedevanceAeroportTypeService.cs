using api.DTO.performance.aeroport;
using api.Repository.performance.aeroport;

namespace api.Service.performance.aeroport
{
    public class RedevanceAeroportTypeService
    {
        private readonly RedevanceAeroportTypeRepository _redevanceAeroportTypeRepository;

        public RedevanceAeroportTypeService(RedevanceAeroportTypeRepository repository)
        {
            _redevanceAeroportTypeRepository = repository;
        }
        public async Task<List<RedevanceAeroportTypeDTO>> GetRedevanceAeroportType(int annee)
        {
            return await _redevanceAeroportTypeRepository.GetRedevanceAeroportType(annee);
        }
    }
}
