// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción general:
// Este controlador gestiona las operaciones CRUD relacionadas con los lugares turísticos disponibles en el sistema.
// Proporciona endpoints para consultar, registrar, actualizar y eliminar lugares almacenados en la base de datos.
// Se utiliza Entity Framework Core para el acceso a datos, y las operaciones se exponen a través de una API RESTful.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoLocal.Server.Data;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LugaresController : ControllerBase
{
    private readonly AppDbContext _context;

    // Constructor que recibe el contexto de base de datos inyectado
    public LugaresController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/lugares
    // Obtiene y devuelve la lista completa de lugares
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lugar>>> GetLugares()
    {
        return await _context.Lugares.ToListAsync();
    }

    // GET: api/lugares/{id}
    // Obtiene los detalles de un lugar específico según su ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Lugar>> GetLugar(int id)
    {
        var lugar = await _context.Lugares.FindAsync(id);
        return lugar == null ? NotFound() : Ok(lugar);
    }

    // POST: api/lugares
    // Registra un nuevo lugar en la base de datos
    [HttpPost]
    public async Task<ActionResult<Lugar>> PostLugar(Lugar lugar)
    {
        _context.Lugares.Add(lugar);
        await _context.SaveChangesAsync();

        // Devuelve 201 Created con la URL del nuevo recurso
        return CreatedAtAction(nameof(GetLugar), new { id = lugar.Id }, lugar);
    }

    // PUT: api/lugares/{id}
    // Actualiza los datos de un lugar existente
    [HttpPut("{id}")]
    public async Task<IActionResult> PutLugar(int id, Lugar lugar)
    {
        // Verifica si el ID de la URL coincide con el ID del objeto recibido
        if (id != lugar.Id) return BadRequest();

        // Marca el objeto como modificado
        _context.Entry(lugar).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // Verifica si el lugar todavía existe
            if (!_context.Lugares.Any(e => e.Id == id)) return NotFound();
            throw; // Lanza excepción si hay un conflicto de concurrencia
        }

        return NoContent(); // 204 No Content
    }

    // DELETE: api/lugares/{id}
    // Elimina un lugar existente
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLugar(int id)
    {
        var lugar = await _context.Lugares.FindAsync(id);
        if (lugar == null) return NotFound();

        _context.Lugares.Remove(lugar);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 No Content
    }
}
