using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos;

public class Opinion
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public int LugarId { get; set; }
    public string Comentario { get; set; } = null!;
    public int Calificacion { get; set; }  // entre 1 y 5
    public DateTime Fecha { get; set; } = DateTime.Now;
}

