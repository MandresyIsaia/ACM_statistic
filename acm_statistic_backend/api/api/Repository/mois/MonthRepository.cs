using api.Data;
using api.Model.mois;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.mois
{
    public class MonthRepository
    {
        private readonly AppDbContext _context;
        public MonthRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Month>> getAll()
        {
            return await _context.Months.ToListAsync();
        }
    }
}
