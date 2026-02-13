using api.Model.exploitants;

namespace api.DTO.utilisateur
{
    public class UtilisateurDTO
    {
        public String? UserCode { get; set; }

        
        public String? UserName { get; set; }
        public String? UserTitle { get; set; }
        public String? UserEmail { get; set; }
        public String? Role { get; set; }

        public string? UserPasswordString { get; set; }

        public String? IdExploitant { get; set; }
        public virtual Exploitant? Exploitant { get; set; }
        public String? Telephone { get; set; }

    }
}
