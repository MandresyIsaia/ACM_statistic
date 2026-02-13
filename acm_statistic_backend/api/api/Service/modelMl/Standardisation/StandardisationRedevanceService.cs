using api.ModelML.projection_future_redevance;

namespace api.Service.modelMl.Standardisation
{
    public class StandardisationRedevanceService
    {
        private static float[] ExtractColumn(List<ModelRedevanceDTO> data, Func<ModelRedevanceDTO, float> selector)
        {
            return data.Select(selector).ToArray();
        }
        private static float Mean(float[] arr)
        {
            return arr.Average();
        }
        private static float Std(float[] arr)
        {
            float m = Mean(arr);
            return (float)Math.Sqrt(arr.Average(x => (x - m) * (x - m)));
        }
        private static float Standardize(float value, float mean, float std)
        {
            if (std == 0)
                return 0;
            return (value - mean) / std;
        }
        public List<float[]> FitTransform(List<ModelRedevanceDTO> data)
        {
            if (data.Count == 0) return new List<float[]>();

            
            float[] anneeCol = ExtractColumn(data, d => d.Annee);
            float[] moisCol = ExtractColumn(data, d => d.Mois);
            float[] redevancesCol = ExtractColumn(data, d => d.Redevances);

            
            float muAnnee = Mean(anneeCol);
            float muMois = Mean(moisCol);
            float muRedevances = Mean(redevancesCol);

            float sigmaAnnee = Std(anneeCol);
            float sigmaMois = Std(moisCol);
            float sigmaRedevances = Std(redevancesCol);

            
            List<float[]> scaledData = new List<float[]>();
            foreach (var d in data)
            {
                scaledData.Add(new float[]
                {
                Standardize(d.Annee, muAnnee, sigmaAnnee),
                Standardize(d.Mois, muMois, sigmaMois),
                Standardize(d.Redevances, muRedevances, sigmaRedevances)
                });
            }

            return scaledData;
        }
    
    }
}
