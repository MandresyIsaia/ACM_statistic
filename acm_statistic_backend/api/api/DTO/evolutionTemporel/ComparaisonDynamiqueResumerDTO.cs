namespace api.DTO.evolutionTemporel
{
    public class ComparaisonDynamiqueResumerDTO
    {
        public decimal? Annee_actuelle { get; set; }
        public decimal? Annee_precedente { get; set; }
        public decimal? Variation {  get; set; }
    }
}
