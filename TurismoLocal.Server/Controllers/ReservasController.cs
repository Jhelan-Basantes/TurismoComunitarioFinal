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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
    {
        return await _context.Reservas.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Reserva>> GetReserva(int id)
    {
        var reserva = await _context.Reservas.FindAsync(id);
        return reserva == null ? NotFound() : Ok(reserva);
    }

    [HttpPost]
    public async Task<ActionResult<Reserva>> PostReserva(Reserva reserva)
    {
        _context.Reservas.Add(reserva);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutReserva(int id, Reserva reserva)
    {
        if (id != reserva.Id) return BadRequest();
        _context.Entry(reserva).State = EntityState.Modified;

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Reservas.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReserva(int id)
    {
        var reserva = await _context.Reservas.FindAsync(id);
        if (reserva == null) return NotFound();

        _context.Reservas.Remove(reserva);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}