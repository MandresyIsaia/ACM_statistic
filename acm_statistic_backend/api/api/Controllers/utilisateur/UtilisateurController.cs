using api.DTO.utilisateur;
using api.ExeptionModels;
using api.Model.utilisateur;
using api.Service.utilisateur;
using api.Settings.token;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.utilisateur
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {
        private readonly UtilisateurService utilisateurService;
        private readonly JwtTokenService jwtTokenService; 
        public UtilisateurController(UtilisateurService utilisateurService, JwtTokenService jwtTokenService)
        {
            this.utilisateurService = utilisateurService;
            this.jwtTokenService = jwtTokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UtilisateurDTO>> PostTicket([FromBody] UtilisateurDTO userLogin)
        {
            try
            {
                UtilisateurDTO utilisateur = await utilisateurService.Login(userLogin);
                var token = jwtTokenService.GenerateToken(utilisateur);
                return Ok(new
                {
                    token,
                    utilisateur = utilisateur
                });

            }
            catch (LoginException ex)
            {

                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return BadRequest(ex.Message);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
