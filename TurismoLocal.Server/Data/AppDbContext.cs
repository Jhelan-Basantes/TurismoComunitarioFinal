// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción general:
// Clase de contexto principal de Entity Framework Core.
// Representa la sesión con la base de datos y permite realizar operaciones sobre las entidades del sistema.

using Microsoft.EntityFrameworkCore;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Definición de las entidades y sus respectivas tablas
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Lugar> Lugares { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Opinion> Opiniones { get; set; }

        // Configuración explícita del nombre de las tablas en la base de datos
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>().ToTable("Usuario");
            modelBuilder.Entity<Lugar>().ToTable("Lugar");
            modelBuilder.Entity<Reserva>().ToTable("Reserva");
            modelBuilder.Entity<Pago>().ToTable("Pago");
            modelBuilder.Entity<Opinion>().ToTable("Opinion");
        }
    }
}
