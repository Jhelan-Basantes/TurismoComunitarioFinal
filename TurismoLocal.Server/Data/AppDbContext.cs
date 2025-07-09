using Microsoft.EntityFrameworkCore;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Lugar> Lugares { get; set; }
    public DbSet<Reserva> Reservas { get; set; }
    public DbSet<Pago> Pagos { get; set; }
    public DbSet<Opinion> Opiniones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>().ToTable("Usuario");
        modelBuilder.Entity<Lugar>().ToTable("Lugar");
        modelBuilder.Entity<Reserva>().ToTable("Reserva");
        modelBuilder.Entity<Pago>().ToTable("Pago");
        modelBuilder.Entity<Opinion>().ToTable("Opinion");
    }
}
