using api.Model.mois;
using api.Repository.mois;

namespace api.Service.mois
{
    public class MonthService
    {
        private readonly MonthRepository _monthRepository;
        public MonthService(MonthRepository monthRepository)
        {
            _monthRepository = monthRepository;
        }
        public async Task<List<Month>> getAll()
        {
            return await _monthRepository.getAll();
        }
    }
}
