namespace api.DTO.performance.compagnie
{
    public class RepartitionTypeCompagnieMoisDTO
    {
        public int Mois {  get; set; }
        public string Mois_Lettre { get; set; }
        public string Type_trafic { get; set; }
        public decimal? Montant { get; set; }
        public decimal? Part {  get; set; }
        public string Compagnie { get; set; }
        public int Vols { get; set; }
        public decimal? Pourcentage_Variation { get; set; }
    }
}
