using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos;

public class Lugar
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Descripcion { get; set; } = null!;
    public decimal Precio { get; set; }
    public string Ubicacion { get; set; } = null!;
    public string? Categoria { get; set; }
    public int IdGuia { get; set; }

    // Relaciones opcionales:
    // public Usuario? Guia { get; set; }
}
