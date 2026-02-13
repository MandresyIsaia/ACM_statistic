using api.Data;
using api.DTO.evolutionTemporel;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.evolutionTemporel
{
    public class ComparaisonDynamiqueResumerRepository
    {
        private readonly AppDbContext _appDbContext;
        public ComparaisonDynamiqueResumerRepository(AppDbContext appDbContext) { 
            _appDbContext = appDbContext;
        }
        public async Task<ComparaisonDynamiqueResumerDTO> GetComparaisonDynamiqueResumer(int annee)
        {
            
            var data = await _appDbContext
                                        .Set<ComparaisonDynamiqueResumerDTO>()
                                        .FromSqlRaw("EXEC dbo.Analyse_get_comparaison_dynamique_resumer @param1",
                                            new SqlParameter("@param1", annee))
                                        .AsNoTracking()
                                        .ToListAsync();

            return data.FirstOrDefault();
        }
    }
}
