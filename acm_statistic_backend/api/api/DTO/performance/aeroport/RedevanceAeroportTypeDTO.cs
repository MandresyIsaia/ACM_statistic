namespace api.DTO.performance.aeroport
{
    public class RedevanceAeroportTypeDTO
    {
        public string Type_trafic { get; set; }
        public decimal Montant { get; set; }
        public string Aeroport { get; set; }
        public int Passagers { get; set; }
        public int Vols { get; set; }
    }
}
