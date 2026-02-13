namespace api.DTO.evolutionTemporel
{
    public class RedevanceMensuelDTO
    {
        public int Mois {  get; set; }
        public string Mois_lettre { get; set; }

        public int Annee { get; set; }

        public String? Type_trafic {  get; set; }
        public decimal? Montant { get; set; }
        public string? Compagnie { get; set; }
        public string? Aeroport { get; set; }
    }
}
