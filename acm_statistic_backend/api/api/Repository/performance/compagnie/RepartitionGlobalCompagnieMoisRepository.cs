using api.Data;
using api.DTO.performance.compagnie;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.performance.compagnie
{
    public class RepartitionGlobalCompagnieMoisRepository
    {
        private readonly AppDbContext _appDbContext;
        public RepartitionGlobalCompagnieMoisRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RepartitionGlobalCompagnieMoisDTO>> GetRepartitionGlobalMois(int annee)
        {
            return await _appDbContext
                            .Set<RepartitionGlobalCompagnieMoisDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_compagnie_global_par_mois @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
