using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos;

public class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? Email { get; set; }
    public string? Telefono { get; set; } 
    public string Role { get; set; } = null!;
    public DateTime FechaRegistro { get; set; } = DateTime.Now;
    public string? Wishlist { get; set; }  // json de ids

}