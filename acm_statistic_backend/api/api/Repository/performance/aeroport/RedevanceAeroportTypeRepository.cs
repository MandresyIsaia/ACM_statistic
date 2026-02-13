using api.Data;
using api.DTO.performance.aeroport;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.performance.aeroport
{
    public class RedevanceAeroportTypeRepository
    {
        private readonly AppDbContext _appDbContext;

        public RedevanceAeroportTypeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RedevanceAeroportTypeDTO>> GetRedevanceAeroportType(int annee)
        {
            
            return await _appDbContext
                            .Set<RedevanceAeroportTypeDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_aeroport_tarif @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
