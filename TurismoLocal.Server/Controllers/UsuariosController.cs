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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        return usuario == null ? NotFound() : Ok(usuario);
    }
    [HttpGet("perfil")]
    [Authorize]
    public async Task<IActionResult> ObtenerPerfil()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var usuario = await _context.Usuarios
            .Where(u => u.Id.ToString() == userId)
            .Select(u => new {
                u.Id,
                u.Username,
                u.Email,
                u.Telefono,
                Role = u.Role
            })
            .FirstOrDefaultAsync();

        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }


    [HttpPost]
    public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
    }

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

    //Método Wishlist PUT + DTO 
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

    public class WishlistDto
    {
        public string Wishlist { get; set; } = string.Empty;
    }

    //último update: 19:47


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