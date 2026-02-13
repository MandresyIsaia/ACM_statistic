using api.Data;
using api.DTO.performance.compagnie;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.performance.compagnie
{
    public class RepartitionTypeCompagnieMoisRepository
    {
        private readonly AppDbContext _appDbContext;
        public RepartitionTypeCompagnieMoisRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RepartitionTypeCompagnieMoisDTO>> GetRepartionTypeMois(int annee, String type_trafic)
        {

            return await _appDbContext
                            .Set<RepartitionTypeCompagnieMoisDTO>()
                            .FromSqlRaw("EXEC dbo.Analyse_get_redevances_compagnie_tarif_par_mois @param1, @param2",
                                new SqlParameter("@param1", annee),
                                new SqlParameter("@param2", type_trafic))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
