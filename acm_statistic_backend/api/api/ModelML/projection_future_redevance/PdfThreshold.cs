using System.Text.Json;

namespace api.ModelML.projection_future_redevance
{
    public class PdfThreshold
    {
        public double Threshold { get; set; }
        public static void SaveThreshold(double threshold, string filePath)
        {
            var obj = new PdfThreshold { Threshold = threshold };
            var json = JsonSerializer.Serialize(obj, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
        }

        // Charger le threshold
        public static double LoadThreshold(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Le fichier {filePath} n'existe pas.");

            var json = File.ReadAllText(filePath);
            var obj = JsonSerializer.Deserialize<PdfThreshold>(json);
            return obj.Threshold;
        }
    }
}
