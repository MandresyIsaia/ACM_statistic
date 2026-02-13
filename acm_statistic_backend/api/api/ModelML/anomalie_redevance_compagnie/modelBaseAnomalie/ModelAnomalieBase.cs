namespace api.ModelML.anomalie_redevance_compagnie.modelBaseAnomalie
{
    public class ModelAnomalieBase
    {
        public float Annee { get; set; }
        public float Mois { get; set; }
        public string Compagnies { get; set; }
        public float Redevances { get; set; }
        public float? compagnieEncoder { get; set; }
        
    }
}
