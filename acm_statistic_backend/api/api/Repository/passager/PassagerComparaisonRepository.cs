using api.Data;
using api.DTO.passager;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.passager
{
    public class PassagerComparaisonRepository
    {
        private readonly AppDbContext _appDbContext;
        public PassagerComparaisonRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<Comparaison_passager>> GetComparaison(int annee, int annee_autre)
        {

            return await _appDbContext
                            .Set<Comparaison_passager>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_comparaison_passager @param1, @param2",
                                new SqlParameter("@param1", annee),
                                new SqlParameter("@param2", annee_autre))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
