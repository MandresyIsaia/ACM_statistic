using api.Model.exploitants;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model.utilisateur
{
    [Table("RED_USR")]
    public class Utilisateur
    {
        [Key]
        [Column("USRCOD")]
        public String? UserCode { get; set; }

        [Column("USRNAM")]
        public String? UserName { get; set; }
        [Column("USRTIT")]
        public String? UserTitle { get; set; }
        [Column("USREML")]
        public String? UserEmail { get; set; }
        [Column("ROLE")]
        public String? Role { get; set; }
        [Column("USRPSS")]
        public byte[]? UserPassWord { get; set; }


        [Column("EXPLOITANT")]
        public String? IdExploitant { get; set; }
        [ForeignKey("IdExploitant")]
        public virtual Exploitant? Exploitant {  get; set; }
        [Column("TEL")]
        public String? Telephone { get; set; }


    }
}
