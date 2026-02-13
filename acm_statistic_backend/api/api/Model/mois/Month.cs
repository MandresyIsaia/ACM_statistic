using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model.mois
{
    [Table("P_MONTH")]
    public class Month
    {
        [Key]
        [Column("MONTH_NUM")]
        public int month_num { get; set; }

        [Column("MONTH_NAME")]
        public string month_name { get; set; }

    }
}
