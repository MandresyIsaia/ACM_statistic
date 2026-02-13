using api.DTO.evolutionTemporel;
using api.Repository.evolutionTemporel;

namespace api.Service.evolutionTemporel
{
    public class RedevanceMensuelService
    {
        private readonly RedevanceMensuelRepository _redevanceMensuelRepository;

        public RedevanceMensuelService(RedevanceMensuelRepository redevance)
        {
            _redevanceMensuelRepository = redevance;
        }
        public async Task<List<RedevanceMensuelDTO>> GetRedevanceMensuel(int annee)
        {
            return await _redevanceMensuelRepository.GetRedevanceMensuel(annee);
        }
    }
}
