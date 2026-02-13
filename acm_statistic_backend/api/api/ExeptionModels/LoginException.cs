namespace api.ExeptionModels
{
    public class LoginException : System.Exception
    {
        public LoginException(string message) : base(message)
        {
        }

        public LoginException() : base("Identifiants incorrects !")
        {
        }
    }
}
