using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoLocal.Server.Data;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PagosController : ControllerBase
{
    private readonly AppDbContext _context;

    public PagosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pago>>> GetPagos() => await _context.Pagos.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Pago>> GetPago(int id)
    {
        var pago = await _context.Pagos.FindAsync(id);
        return pago == null ? NotFound() : Ok(pago);
    }

    [HttpPost]
    public async Task<ActionResult<Pago>> PostPago(Pago pago)
    {
        _context.Pagos.Add(pago);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPago), new { id = pago.Id }, pago);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPago(int id, Pago pago)
    {
        if (id != pago.Id) return BadRequest();
        _context.Entry(pago).State = EntityState.Modified;

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Pagos.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePago(int id)
    {
        var pago = await _context.Pagos.FindAsync(id);
        if (pago == null) return NotFound();

        _context.Pagos.Remove(pago);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}