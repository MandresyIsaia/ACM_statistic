using api.Data;
using api.DTO.evolutionTemporel;
using api.Repository.evolutionTemporel;
using Microsoft.EntityFrameworkCore;

namespace api.Service.evolutionTemporel
{
    public class ComparaisonDynamiqueService
    {
        private readonly ComparaisonDynamiqueRepository _comparaisonDynamique;

        public ComparaisonDynamiqueService(ComparaisonDynamiqueRepository comparaisonDynamique) {
            _comparaisonDynamique = comparaisonDynamique;
        }
        public async Task<List<ComparaisonDynamiqueDTO>> GetComparaisonDynamique(int annee)
        {
            return await _comparaisonDynamique.GetComparaisonDynamique(annee);
        }
    }
}
