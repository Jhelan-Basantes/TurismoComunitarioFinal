using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos
{
    public class Reserva
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int LugarId { get; set; }
        public int CantidadPersonas { get; set; }
        public bool Discapacidad { get; set; }
        public DateTime TiempoInicio { get; set; }
        public DateTime TiempoFin { get; set; }
        public string? PersonasJson { get; set; }
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}
