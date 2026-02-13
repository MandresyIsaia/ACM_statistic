using api.Data;
using api.DTO.evolutionTemporel;
using api.DTO.performance.aeroport;
using api.DTO.performance.compagnie;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.performance.compagnie
{
    public class RepartitionGlobalCompagnieRepository
    {
        private readonly AppDbContext _appDbContext;

        public RepartitionGlobalCompagnieRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RepartitionGlobalCompagnieDTO>> GetRepartiionGlobal(int annee)
        {
            
            return await _appDbContext
                            .Set<RepartitionGlobalCompagnieDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_compagnie_global @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
