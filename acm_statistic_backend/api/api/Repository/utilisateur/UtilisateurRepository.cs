using api.Data;
using api.DTO.utilisateur;
using api.ExeptionModels;
using api.Model.utilisateur;
using api.Model.utils;
using Microsoft.EntityFrameworkCore;

namespace api.Repository.utilisateur
{
    public class UtilisateurRepository
    {
        private readonly AppDbContext _appDbContext;
        public UtilisateurRepository(AppDbContext appDbContext) { 
            _appDbContext = appDbContext;
        }
        public async Task<UtilisateurDTO> Login(UtilisateurDTO userlogin)
        {
            byte[] hashedPassword = Utils.ComputeMD5HashBytes(userlogin.UserPasswordString);
            Console.WriteLine(hashedPassword);
            var utilisateur = await _appDbContext.Utilisateurs
                                        .Where(t => t.UserCode == userlogin.UserCode && t.UserPassWord == hashedPassword && t.IdExploitant == "0001")
                                        .Include(t => t.Exploitant)
                                        .Select(t => new UtilisateurDTO
                                        {
                                            UserCode = t.UserCode,
                                            UserName = t.UserName,
                                            UserTitle = t.UserTitle,
                                            UserEmail = t.UserEmail,
                                            Role = t.Role,
                                            IdExploitant = t.IdExploitant,
                                            Telephone = t.Telephone,
                                            Exploitant = t.Exploitant
                                        })
                                        .FirstOrDefaultAsync();

            if (utilisateur == null)
            {
                throw new LoginException();
            }
            return utilisateur;
        }
    }
}
