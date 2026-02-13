using api.Data;
using api.DTO.dashboard;
using api.DTO.evolutionTemporel;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.dashboard
{
    public class DashboardRepository
    {
        private readonly AppDbContext _appDbContext;
        public DashboardRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<DashBoardDTO> GetDashBoard(int annee)
        {
            var data = await _appDbContext
                                        .Set<DashBoardDTO>()
                                        .FromSqlRaw("EXEC dbo.Analyse_get_dashboard_elements @param1",
                                            new SqlParameter("@param1", annee))
                                        .AsNoTracking()
                                        .ToListAsync();

            return data.FirstOrDefault();
        }
    }
}
