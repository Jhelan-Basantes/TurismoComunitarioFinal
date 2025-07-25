/*
* Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
* Versión: TurismoLocal v9.  
* Fecha: 22/07/2025
*
* Descripción:
* Esta clase define el modelo de datos 'Reserva' dentro del sistema de turismo comunitario.
* Representa la estructura base para registrar y gestionar reservas realizadas por los usuarios,
* incluyendo información sobre el lugar, fechas de inicio y fin, número de personas, accesibilidad,
* y otros datos necesarios para la planificación y trazabilidad de las reservas.
*/

using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos
{
    public class Reserva
    {
        // Identificador único de la reserva.
        public int Id { get; set; }

        // ID del usuario que realiza la reserva.
        public int UsuarioId { get; set; }

        // ID del lugar turístico reservado.
        public int LugarId { get; set; }

        // Número de personas incluidas en la reserva.
        public int CantidadPersonas { get; set; }

        // Indica si hay alguna persona con discapacidad en el grupo.
        public bool Discapacidad { get; set; }

        // Fecha y hora de inicio de la reserva.
        public DateTime TiempoInicio { get; set; }

        // Fecha y hora de finalización de la reserva.
        public DateTime TiempoFin { get; set; }

        // Información adicional de las personas, almacenada como JSON (opcional).
        public string? PersonasJson { get; set; }

        // Fecha en la que se registró la reserva (valor predeterminado: fecha actual).
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        public ICollection<Pago> Pagos { get; set; }
    }
}
