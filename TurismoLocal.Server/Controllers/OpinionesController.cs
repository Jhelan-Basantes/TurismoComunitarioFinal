// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
// Versión: TurismoLocal v9  
// Fecha: 22/07/2025

// Descripción general:
// Este controlador gestiona las operaciones CRUD relacionadas con las opiniones de los usuarios sobre los lugares turísticos.
// Incluye funcionalidades para registrar, consultar, actualizar y eliminar opiniones, así como calcular promedios de calificaciones.
// Utiliza Entity Framework Core y sigue una arquitectura RESTful.

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

    // GET: api/opiniones
    // Retorna la lista completa de opiniones registradas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Opinion>>> GetOpiniones()
    {
        return await _context.Opiniones.ToListAsync();
    }

    // GET: api/opiniones/{id}
    // Obtiene una opinión específica según su ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Opinion>> GetOpinion(int id)
    {
        var opinion = await _context.Opiniones.FindAsync(id);
        return opinion == null ? NotFound() : Ok(opinion);
    }

    // GET: api/opiniones/promedios
    // Retorna el promedio de calificaciones agrupado por ID de lugar
    [HttpGet("promedios")]
    public async Task<ActionResult<Dictionary<int, double>>> GetPromedioPorLugar()
    {
        var promedios = await _context.Opiniones
            .GroupBy(o => o.LugarId)
            .Select(g => new
            {
                LugarId = g.Key,
                Promedio = g.Average(o => o.Calificacion)
            })
            .ToDictionaryAsync(
                g => g.LugarId,
                g => Math.Round(g.Promedio, 1)
            );

        return Ok(promedios);
    }

    // POST: api/opiniones
    // Registra una nueva opinión
    [HttpPost]
    public async Task<ActionResult<Opinion>> PostOpinion(Opinion opinion)
    {
        _context.Opiniones.Add(opinion);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOpinion), new { id = opinion.Id }, opinion);
    }

    // PUT: api/opiniones/{id}
    // Actualiza una opinión existente
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOpinion(int id, Opinion opinion)
    {
        if (id != opinion.Id) return BadRequest();

        _context.Entry(opinion).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Opiniones.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent(); // 204
    }

    // DELETE: api/opiniones/{id}
    // Elimina una opinión existente
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
