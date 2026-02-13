using Microsoft.ML.Data;

namespace api.ModelML.projection_future_redevance
{
    public class Prediction
    {
        [ColumnName("Score")]
        public float RedevancesPred { get; set; }
    }
}
