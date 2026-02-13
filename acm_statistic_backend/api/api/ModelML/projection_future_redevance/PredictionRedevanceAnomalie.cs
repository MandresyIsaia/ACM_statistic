using Microsoft.ML.Data;

namespace api.ModelML.projection_future_redevance
{
    public class PredictionRedevanceAnomalie
    {
        
            [ColumnName("PredictedLabel")]
            public bool IsAnomaly { get; set; }

            public float Score { get; set; }
        
    }
}
