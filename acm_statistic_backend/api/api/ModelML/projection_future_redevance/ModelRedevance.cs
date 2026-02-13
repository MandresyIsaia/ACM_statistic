using Microsoft.ML.Data;

namespace api.ModelML.projection_future_redevance
{
    public class ModelRedevanceDTO
    {
        public float Annee { get; set; }

        public float Mois { get; set; }

        public float Redevances { get; set; }
    }
    public class ModelRedevanceCsv
    {
        [LoadColumn(0)]
        public float Annee { get; set; }

        [LoadColumn(1)]
        public float Mois { get; set; }

        [LoadColumn(2)]
        public float Redevances { get; set; }
    }
    public class ModelRedevance
    {
        public float Annee { get; set; }

        public float Mois { get; set; }

        public float Redevances { get; set; }

        public float Trimestre { get; set; }

        public float SinMois { get; set; }

        public float CosMois { get; set; }

        //public float RedevancesLag1 { get; set; }
        [VectorType(10)]
        public float[] PolyFeatures { get; set; }
    }
}
