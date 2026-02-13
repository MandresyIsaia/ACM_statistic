namespace api.DTO.passager
{
    public class Passager_detail
    {
        public int Mois { get; set; }
        public string Mois_lettre { get; set; }

        public int Annee { get; set; }

        public String? Type_trafic { get; set; }
        public decimal? Montant { get; set; }
        public string? Compagnie { get; set; }
        public string? Aeroport { get; set; }
        public int Passagers { get; set; }
        public int Vols { get; set; }
    }
}
