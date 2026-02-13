using api.Data;
using api.DTO.passager;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.passager
{
    public class PassagerRepartitionRepository
    {
        private readonly AppDbContext _appDbContext;
        public PassagerRepartitionRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<Repartition_passager>> GetRepartitionPassager(int annee)
        {

            return await _appDbContext
                            .Set<Repartition_passager>()
                            .FromSqlRaw("EXEC dbo.Analyse_repartition_des_passagers @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
