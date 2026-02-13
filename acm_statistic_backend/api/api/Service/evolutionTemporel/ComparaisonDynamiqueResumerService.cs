using api.DTO.evolutionTemporel;
using api.Repository.evolutionTemporel;

namespace api.Service.evolutionTemporel
{
    public class ComparaisonDynamiqueResumerService
    {
        private readonly ComparaisonDynamiqueResumerRepository _repository;
        public ComparaisonDynamiqueResumerService(ComparaisonDynamiqueResumerRepository repository)
        {
            _repository = repository;
        }
        public async Task<ComparaisonDynamiqueResumerDTO> GetComparaisonDynamiqueResumer(int annee)
        {
            return await _repository.GetComparaisonDynamiqueResumer(annee);
        }
    }
}
