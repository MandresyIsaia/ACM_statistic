using api.DTO.dashboard;
using api.DTO.evolutionTemporel;
using api.DTO.passager;
using api.DTO.performance.aeroport;
using api.DTO.performance.compagnie;
using api.DTO.redevances;
using api.Model.exploitants;
using api.Model.mois;
using api.Model.utilisateur;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Exploitant> Exploitants { get; set; }
        public DbSet<Month> Months { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ComparaisonDynamiqueDTO>().HasNoKey();
            modelBuilder.Entity<ComparaisonDynamiqueResumerDTO>().HasNoKey();
            modelBuilder.Entity<RedevanceMensuelDTO>().HasNoKey();
            modelBuilder.Entity<RepartitionGlobalCompagnieDTO>().HasNoKey();
            modelBuilder.Entity<RepartitionTypeCompagnieDTO>().HasNoKey();
            modelBuilder.Entity<RedevanceAeroportGlobalDTO>().HasNoKey();
            modelBuilder.Entity<RedevanceAeroportTypeDTO>().HasNoKey();
            modelBuilder.Entity<DashBoardDTO>().HasNoKey();
            modelBuilder.Entity<RepartitionGlobalCompagnieMoisDTO>().HasNoKey();
            modelBuilder.Entity<RepartitionTypeCompagnieMoisDTO>().HasNoKey();
            modelBuilder.Entity<RedevanceAnneeMoisDTO>().HasNoKey();
            modelBuilder.Entity<Passager_detail>().HasNoKey();
            modelBuilder.Entity<Repartition_passager>().HasNoKey();
            modelBuilder.Entity<Comparaison_passager>().HasNoKey();

        }

    }
}
