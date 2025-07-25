// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción general:
// Este controlador maneja las operaciones CRUD para los usuarios del sistema.
// Incluye autenticación y autorización mediante JWT, acceso al perfil autenticado, 
// y una funcionalidad específica para actualizar la lista de deseos (wishlist).

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TurismoLocal.Server.Data;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/usuarios
    // Obtiene todos los usuarios registrados
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }

    // GET: api/usuarios/{id}
    // Obtiene un usuario específico por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        return usuario == null ? NotFound() : Ok(usuario);
    }

    // GET: api/usuarios/perfil
    // Obtiene el perfil del usuario autenticado (según su token JWT)
    [HttpGet("perfil")]
    [Authorize]
    public async Task<IActionResult> ObtenerPerfil()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var usuario = await _context.Usuarios
            .Where(u => u.Id.ToString() == userId)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Telefono,
                Role = u.Role
            })
            .FirstOrDefaultAsync();

        return usuario == null ? NotFound() : Ok(usuario);
    }

    // POST: api/usuarios
    // Registra un nuevo usuario
    [HttpPost]
    public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
    }

    // PUT: api/usuarios/{id}
    // Actualiza los datos de un usuario específico
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
    {
        if (id != usuario.Id) return BadRequest();

        _context.Entry(usuario).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Usuarios.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // PUT: api/usuarios/{id}/wishlist
    // Actualiza el campo Wishlist de un usuario autenticado
    [HttpPut("{id}/wishlist")]
    [Authorize]
    public async Task<IActionResult> ActualizarWishlist(int id, [FromBody] WishlistDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();

        usuario.Wishlist = dto.Wishlist;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DTO utilizado para la actualización de wishlist
    public class WishlistDto
    {
        public string Wishlist { get; set; } = string.Empty;
    }

    // DELETE: api/usuarios/{id}
    // Elimina un usuario específico
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
