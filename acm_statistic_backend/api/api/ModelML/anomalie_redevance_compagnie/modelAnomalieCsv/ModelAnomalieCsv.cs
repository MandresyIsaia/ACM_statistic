using Microsoft.ML.Data;

namespace api.ModelML.anomalie_redevance_compagnie.modelAnomalieCsv
{
    public class ModelAnomalieCsv
    {
        [LoadColumn(0)]
        public int Annee { get; set; }

        [LoadColumn(1)]
        public int Mois { get; set; }

        [LoadColumn(2)]
        public string Compagnies { get; set; }
        [LoadColumn(3)]
        public float Redevances { get; set; }
    }
}
