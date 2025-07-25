// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción:
// Modelo que representa el pago realizado por un usuario asociado a una reserva.

namespace TurismoLocal.Server.Modelos
{
    public class Pago
    {
        public int Id { get; set; }  // Clave primaria

        public int ReservaId { get; set; }  // Clave foránea: referencia a la reserva

        public decimal Monto { get; set; }  // Monto pagado

        public string MetodoPago { get; set; } = null!;  // Ej: "Tarjeta", "Transferencia", "Efectivo"

        public DateTime FechaPago { get; set; } = DateTime.Now;  // Fecha y hora del pago

        public string EstadoPago { get; set; } = null!;  // Ej: "Completado", "Pendiente"
    }
}
