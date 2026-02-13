using api.DTO.utilisateur;
using api.Model.utilisateur;
using api.Repository.utilisateur;

namespace api.Service.utilisateur
{
    public class UtilisateurService
    {
        private readonly UtilisateurRepository _repository;
        public UtilisateurService(UtilisateurRepository repository) { 
            _repository = repository;
        }
        public async Task<UtilisateurDTO> Login(UtilisateurDTO userlogin) { 
            return await _repository.Login(userlogin);
        }
    }
}
