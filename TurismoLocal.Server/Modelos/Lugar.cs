// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción:
// Modelo de datos que representa un lugar turístico disponible en la plataforma.

namespace TurismoLocal.Server.Modelos
{
    public class Lugar
    {
        public int Id { get; set; } // Clave primaria

        public string Nombre { get; set; } = null!; // Nombre del lugar
        public string Descripcion { get; set; } = null!; // Descripción detallada
        public decimal Precio { get; set; } // Costo del servicio o entrada
        public string Ubicacion { get; set; } = null!; // Dirección o zona geográfica

        public string? Categoria { get; set; } // Ejemplo: "Aventura", "Cultural", etc.
        public int IdGuia { get; set; } // ID del guía asociado (clave foránea)
        public string? ImagenUrl { get; set; } // URL de la imagen principal del lugar
    }
}
