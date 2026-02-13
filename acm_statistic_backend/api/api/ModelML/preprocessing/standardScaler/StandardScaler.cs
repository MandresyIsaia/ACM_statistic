using System.Text.Json;

namespace api.ModelML.preprocessing.standarScaler
{
    public class StandardScaler
    {
        public double[] Mean { get; private set; }
        public double[] Std { get; private set; }

        
        public void Fit(List<float[]> X)
        {
            if (X == null || X.Count == 0)
                throw new ArgumentException("Les données sont vides.");

            int n = X.Count;
            int d = X[0].Length;

            Mean = new double[d];
            Std = new double[d];

            for (int j = 0; j < d; j++)
            {
                var col = X.Select(x => (double)x[j]).ToArray();
                Mean[j] = col.Average();

                double variance = col.Average(v => Math.Pow(v - Mean[j], 2));
                Std[j] = Math.Sqrt(variance);

                // ⚠️ Éviter division par zéro
                //if (Std[j] == 0)
                //    Std[j] = 1e-8;
            }
        }

        
        public List<float[]> Transform(List<float[]> X)
        {
            if (Mean == null || Std == null)
                throw new InvalidOperationException("Le scaler doit être ajusté avec Fit() avant d'appeler Transform().");

            int n = X.Count;
            int d = X[0].Length;

            var scaled = new List<float[]>(n);
            foreach (var row in X)
            {
                float[] scaledRow = new float[d];
                for (int j = 0; j < d; j++)
                {
                    if (Std[j] == 0)
                        scaledRow[j] = 0;
                    else
                        scaledRow[j] = (float)((row[j] - Mean[j]) / Std[j]);
                }
                scaled.Add(scaledRow);
            }
            return scaled;
        }

        public List<float[]> FitTransform(List<float[]> X)
        {
            Fit(X);
            return Transform(X);
        }

        public void Save(string filePath)
        {
            var parameters = new { Mean, Std };
            File.WriteAllText(filePath, JsonSerializer.Serialize(parameters));
        }

        public void Load(string filePath)
        {
            var json = File.ReadAllText(filePath);
            var parameters = JsonSerializer.Deserialize<Dictionary<string, double[]>>(json);

            Mean = parameters["Mean"];
            Std = parameters["Std"];
        }
    }
}
