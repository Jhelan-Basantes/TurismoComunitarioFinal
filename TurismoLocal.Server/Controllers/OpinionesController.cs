using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoLocal.Server.Data;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OpinionesController : ControllerBase
{
    private readonly AppDbContext _context;

    public OpinionesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Opinion>>> GetOpiniones()
    {
        return await _context.Opiniones.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Opinion>> GetOpinion(int id)
    {
        var opinion = await _context.Opiniones.FindAsync(id);
        return opinion == null ? NotFound() : Ok(opinion);
    }

    [HttpPost]
    public async Task<ActionResult<Opinion>> PostOpinion(Opinion opinion)
    {
        _context.Opiniones.Add(opinion);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOpinion), new { id = opinion.Id }, opinion);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutOpinion(int id, Opinion opinion)
    {
        if (id != opinion.Id) return BadRequest();

        _context.Entry(opinion).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Opiniones.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOpinion(int id)
    {
        var opinion = await _context.Opiniones.FindAsync(id);
        if (opinion == null) return NotFound();

        _context.Opiniones.Remove(opinion);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}