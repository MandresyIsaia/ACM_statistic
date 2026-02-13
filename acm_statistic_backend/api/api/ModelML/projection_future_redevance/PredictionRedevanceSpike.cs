using Microsoft.ML.Data;

namespace api.ModelML.projection_future_redevance
{
    public class PredictionRedevanceSpike
    {
        [VectorType(3)]
        public double[] Prediction { get; set; }
    }
}
