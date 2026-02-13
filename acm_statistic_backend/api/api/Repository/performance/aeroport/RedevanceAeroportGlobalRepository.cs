using api.Data;
using api.DTO.evolutionTemporel;
using api.DTO.performance.aeroport;
using api.DTO.performance.compagnie;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.performance.aeroport
{
    public class RedevanceAeroportGlobalRepository
    {
        private readonly AppDbContext _appDbContext;

        public RedevanceAeroportGlobalRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RedevanceAeroportGlobalDTO>> GetRedevanceAeroportGlobal(int annee)
        {
            return await _appDbContext
                            .Set<RedevanceAeroportGlobalDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_aeroport_global @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
