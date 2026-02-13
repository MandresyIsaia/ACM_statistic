using api.Data;
using api.DTO.performance.aeroport;
using api.DTO.redevances;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.redevance
{
    public class RedevanceAnneeMoisRepository
    {
        private readonly AppDbContext _appDbContext;

        public RedevanceAnneeMoisRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<RedevanceAnneeMoisDTO>> GetRedevanceMoisAnnee(int annee)
        {

            return await _appDbContext
                            .Set<RedevanceAnneeMoisDTO>()
                            .FromSqlRaw("select PAX_YEAR as annee,PAX_MONTH as mois, sum(ISNULL((PAX_PAYANT+PAX_GRATUIT_SANS_BEBE+PAX_AUTRES) * dbo.RED_GET_PU_TTC_AR_PART(TARIF,PAX_YEAR,PAX_MONTH,'ACM'),0)) AS Redevances from RED_PAX where PAX_YEAR = @annee group by PAX_YEAR,PAX_MONTH order by PAX_YEAR,PAX_MONTH ",
                                new SqlParameter("@annee", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
