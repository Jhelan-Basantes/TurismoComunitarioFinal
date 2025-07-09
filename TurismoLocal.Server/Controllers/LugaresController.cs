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

    public LugaresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lugar>>> GetLugares() => await _context.Lugares.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Lugar>> GetLugar(int id)
    {
        var lugar = await _context.Lugares.FindAsync(id);
        return lugar == null ? NotFound() : Ok(lugar);
    }

    [HttpPost]
    public async Task<ActionResult<Lugar>> PostLugar(Lugar lugar)
    {
        _context.Lugares.Add(lugar);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLugar), new { id = lugar.Id }, lugar);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutLugar(int id, Lugar lugar)
    {
        if (id != lugar.Id) return BadRequest();
        _context.Entry(lugar).State = EntityState.Modified;

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Lugares.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLugar(int id)
    {
        var lugar = await _context.Lugares.FindAsync(id);
        if (lugar == null) return NotFound();

        _context.Lugares.Remove(lugar);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
