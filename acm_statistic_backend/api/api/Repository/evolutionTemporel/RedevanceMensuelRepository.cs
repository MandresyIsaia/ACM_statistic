using api.Data;
using api.DTO.evolutionTemporel;
using api.DTO.performance.aeroport;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.evolutionTemporel
{
    public class RedevanceMensuelRepository
    {
        private readonly AppDbContext _appDbContext;
        public RedevanceMensuelRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RedevanceMensuelDTO>> GetRedevanceMensuel(int annee)
        {
            
            return await _appDbContext
                            .Set<RedevanceMensuelDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_total_par_mois @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
