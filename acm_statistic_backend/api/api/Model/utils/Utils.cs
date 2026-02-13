using System.Security.Cryptography;
using System.Text;

namespace api.Model.utils
{
    public class Utils
    {
        public static byte[] ComputeMD5HashBytes(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);
                return md5.ComputeHash(inputBytes);
            }
        }

    }
}
