using api.Data;
using api.DTO.evolutionTemporel;
using api.DTO.passager;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.passager
{
    public class PassagerDetailRepository
    {
        private readonly AppDbContext _appDbContext;
        public PassagerDetailRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<Passager_detail>> GetPassagerDetail(int annee)
        {

            return await _appDbContext
                            .Set<Passager_detail>()
                            .FromSqlRaw("EXEC dbo.Analyse_statistique_passager @param1",
                                new SqlParameter("@param1", annee))
                            .AsNoTracking()
                            .ToListAsync();
        }
    }
}
