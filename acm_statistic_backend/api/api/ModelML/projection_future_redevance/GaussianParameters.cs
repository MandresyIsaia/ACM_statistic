using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using System.Text.Json;

namespace api.ModelML.projection_future_redevance
{
    public class GaussianParameters
    {
        public double[] Mu { get; set; }
        public double[][] Cov { get; set; }
        public static void SaveGaussianParameters(Vector<double> mu, Matrix<double> cov, string filePath)
        {
            var parameters = new GaussianParameters
            {
                Mu = mu.ToArray(),
                Cov = cov.ToRowArrays() // transforme la matrice en tableau de tableaux
            };
            var json = JsonSerializer.Serialize(parameters, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
        }

        // Charger mu et cov
        public static void LoadGaussianParameters(string filePath, out Vector<double> mu, out Matrix<double> cov)
        {
            var json = File.ReadAllText(filePath);
            var parameters = JsonSerializer.Deserialize<GaussianParameters>(json);
            mu = Vector<double>.Build.Dense(parameters.Mu);
            cov = DenseMatrix.OfRowArrays(parameters.Cov);
        }
    }
}
