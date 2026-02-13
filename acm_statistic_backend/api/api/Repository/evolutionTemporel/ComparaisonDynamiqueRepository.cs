using api.Data;
using api.DTO.evolutionTemporel;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace api.Repository.evolutionTemporel
{
    public class ComparaisonDynamiqueRepository
    {
        private readonly AppDbContext _appDbContext;

        public ComparaisonDynamiqueRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<ComparaisonDynamiqueDTO>> GetComparaisonDynamique(int annee)
        {
            
            return await _appDbContext
                            .Set<ComparaisonDynamiqueDTO>() 
                            .FromSqlRaw("EXEC dbo.Analyse_get_comparaison_dynamique_par_annee @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();

        }
    }
}
