namespace api.DTO.evolutionTemporel
{
    public class ComparaisonDynamiqueDTO
    {
        public int Mois { get; set; }

        public String? Mois_Lettre { get; set; }
        public decimal Total_Annee { get; set; }
        public decimal Total_Annee_Precedente { get; set; }
        public decimal Difference { get; set; }
        public decimal? Pourcentage_Variation { get; set; }

        public decimal? Variation_mois { get; set; }
    }
}
