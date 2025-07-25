/*
* Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
* Versión: TurismoLocal v9.  
* Fecha: 22/07/2025
*
* Descripción:
* Este modelo representa la entidad 'Usuario' dentro del sistema de turismo comunitario.
* Contiene la información básica y de autenticación del usuario, incluyendo su rol,
* datos de contacto, fecha de registro y su lista personalizada de lugares favoritos (wishlist).
* Esta clase es fundamental para la gestión de usuarios, autenticación y personalización de la experiencia.
*/

using Microsoft.AspNetCore.Mvc;

namespace TurismoLocal.Server.Modelos;

public class Usuario
{
    // Identificador único del usuario.
    public int Id { get; set; }

    // Nombre de usuario utilizado para el inicio de sesión.
    public string Username { get; set; } = null!;

    // Contraseña hasheada para autenticación segura.
    public string PasswordHash { get; set; } = null!;

    // Correo electrónico del usuario (opcional).
    public string? Email { get; set; }

    // Número de teléfono del usuario (opcional).
    public string? Telefono { get; set; }

    // Rol del usuario en el sistema (Ej: "Turista", "Guía", "Administrador").
    public string Role { get; set; } = null!;

    // Fecha en la que se registró el usuario (por defecto, la fecha actual).
    public DateTime FechaRegistro { get; set; } = DateTime.Now;

    // Lista de lugares favoritos del usuario, almacenada como una cadena JSON de IDs.
    public string? Wishlist { get; set; }
}
