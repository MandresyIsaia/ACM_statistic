namespace api.DTO.performance.compagnie
{
    public class RepartitionGlobalCompagnieMoisDTO
    {
        public int Mois { get; set; }
        public string Mois_Lettre { get; set; }
        public decimal? Montant { get; set; }
        public string Compagnie { get; set; }
        public int Vols { get; set; }
        public decimal? Part {  get; set; }
        public decimal? Pourcentage_variation { get; set; }

    }
}
