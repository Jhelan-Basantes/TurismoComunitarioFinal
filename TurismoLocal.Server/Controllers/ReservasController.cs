// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción general:
// Este controlador gestiona las operaciones CRUD relacionadas con las reservas realizadas por los usuarios.
// Permite consultar, registrar, modificar y eliminar reservas en el sistema de turismo comunitario.
// Utiliza Entity Framework Core y sigue el estándar RESTful.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoLocal.Server.Data;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReservasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/reservas
    // Devuelve la lista completa de reservas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
    {
        return await _context.Reservas.ToListAsync();
    }

    // GET: api/reservas/{id}
    // Devuelve una reserva específica por su ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Reserva>> GetReserva(int id)
    {
        var reserva = await _context.Reservas.FindAsync(id);
        return reserva == null ? NotFound() : Ok(reserva);
    }

    // POST: api/reservas
    // Registra una nueva reserva en la base de datos
    [HttpPost]
    public async Task<ActionResult<Reserva>> PostReserva(Reserva reserva)
    {
        _context.Reservas.Add(reserva);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
    }

    // PUT: api/reservas/{id}
    // Actualiza los datos de una reserva existente
    [HttpPut("{id}")]
    public async Task<IActionResult> PutReserva(int id, Reserva reserva)
    {
        if (id != reserva.Id) return BadRequest();

        _context.Entry(reserva).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Reservas.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent(); // 204
    }

    // DELETE: api/reservas/{id}
    // Elimina una reserva específica y sus pagos asociados
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReserva(int id)
    {
        var reserva = await _context.Reservas
            .Include(r => r.Pagos) // Incluye los pagos relacionados
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reserva == null)
            return NotFound();

        // Elimina los pagos relacionados
        if (reserva.Pagos != null && reserva.Pagos.Any())
        {
            _context.Pagos.RemoveRange(reserva.Pagos);
        }

        _context.Reservas.Remove(reserva);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
