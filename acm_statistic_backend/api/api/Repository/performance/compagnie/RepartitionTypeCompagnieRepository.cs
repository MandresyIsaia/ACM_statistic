using api.Data;
using api.DTO.performance.compagnie;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.performance.compagnie
{
    public class RepartitionTypeCompagnieRepository
    {
        private readonly AppDbContext _appDbContext;

        public RepartitionTypeCompagnieRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RepartitionTypeCompagnieDTO>> GetRepartionType(int annee,String type_trafic)
        {
            
            return await _appDbContext
                            .Set<RepartitionTypeCompagnieDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_compagnie_tarif @param1, @param2",
                                new SqlParameter("@param1", annee),
                                new SqlParameter("@param2", type_trafic))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
