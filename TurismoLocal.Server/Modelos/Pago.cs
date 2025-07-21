using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos;

public class Pago
{
    public int Id { get; set; }
    public int ReservaId { get; set; }
    public decimal Monto { get; set; }
    public string MetodoPago { get; set; } = null!;
    public DateTime FechaPago { get; set; } = DateTime.Now;
    public string EstadoPago { get; set; } = null!;
}

