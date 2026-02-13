namespace api.DTO.performance.aeroport
{
    public class RedevanceAeroportGlobalDTO
    {
        public decimal  Montant { get; set; }
        public string Aeroport { get; set; }
        public int Passagers {  get; set; }
        public int Vols { get; set; }
    }
}
