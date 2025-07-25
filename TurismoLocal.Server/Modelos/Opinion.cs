// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción:
// Modelo que representa una opinión (comentario y calificación) realizada por un usuario sobre un lugar turístico.

namespace TurismoLocal.Server.Modelos
{
    public class Opinion
    {
        public int Id { get; set; }  // Clave primaria

        public int UsuarioId { get; set; }  // Clave foránea: referencia al Usuario
        public int LugarId { get; set; }    // Clave foránea: referencia al Lugar

        public string Comentario { get; set; } = null!;  // Texto del comentario

        public int Calificacion { get; set; }  // Valor entre 1 y 5
        public DateTime Fecha { get; set; } = DateTime.Now;  // Fecha de publicación
    }
}
