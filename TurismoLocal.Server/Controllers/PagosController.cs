// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción general:
// Este controlador gestiona las operaciones relacionadas con los pagos realizados dentro del sistema.
// Permite consultar, registrar, actualizar y eliminar pagos. 
// Utiliza Entity Framework Core y sigue el patrón de arquitectura RESTful.

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

    // GET: api/pagos
    // Retorna la lista de todos los pagos registrados
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pago>>> GetPagos() =>
        await _context.Pagos.ToListAsync();

    // GET: api/pagos/{id}
    // Retorna un pago específico según su ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Pago>> GetPago(int id)
    {
        var pago = await _context.Pagos.FindAsync(id);
        return pago == null ? NotFound() : Ok(pago);
    }

    // POST: api/pagos
    // Registra un nuevo pago en la base de datos
    [HttpPost]
    public async Task<ActionResult<Pago>> PostPago(Pago pago)
    {
        _context.Pagos.Add(pago);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPago), new { id = pago.Id }, pago);
    }

    // PUT: api/pagos/{id}
    // Actualiza un pago existente
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPago(int id, Pago pago)
    {
        if (id != pago.Id) return BadRequest();

        _context.Entry(pago).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Pagos.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent(); // 204
    }

    // DELETE: api/pagos/{id}
    // Elimina un pago de la base de datos
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
