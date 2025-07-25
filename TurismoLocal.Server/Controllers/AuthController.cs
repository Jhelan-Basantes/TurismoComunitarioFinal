// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
// Versión: TurismoLocal v9.  
// Fecha: 22/07/2025

// Descripción general:
// Este controlador gestiona las operaciones de autenticación para la aplicación Turismo Comunitario.
// Incluye endpoints para el registro y login de usuarios, utilizando JWT para la autenticación basada en tokens.
// El controlador emplea hashing de contraseñas (BCrypt) para mayor seguridad y está conectado a la base de datos
// a través de Entity Framework Core (AppDbContext).

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TurismoLocal.Server.Data;
using TurismoLocal.Server.Modelos;

namespace TurismoLocal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    // Constructor que inyecta el contexto de base de datos y la configuración del sistema (para obtener la clave JWT)
    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // Endpoint: POST /api/auth/register
    // Registra un nuevo usuario si el username no existe.
    // La contraseña se almacena usando hashing con BCrypt por razones de seguridad.
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // Verifica si el nombre de usuario ya está registrado
        if (_context.Usuarios.Any(u => u.Username == dto.Username))
            return BadRequest("El usuario ya existe.");

        // Hash de la contraseña antes de guardar
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var usuario = new Usuario
        {
            Username = dto.Username,
            PasswordHash = passwordHash,
            Email = dto.Email,
            Role = dto.Role,
            FechaRegistro = DateTime.Now
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuario registrado con éxito" });
    }

    // Endpoint: POST /api/auth/login
    // Valida las credenciales del usuario y genera un token JWT válido por 2 horas si son correctas.
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        // Busca el usuario por nombre de usuario
        var usuario = _context.Usuarios.SingleOrDefault(u => u.Username == dto.Username);

        // Verifica si el usuario existe y si la contraseña es válida
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return Unauthorized("Credenciales inválidas");

        // Genera los claims (información embebida en el JWT)
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]!);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Username),
            new Claim(ClaimTypes.Role, usuario.Role)
        };

        // Configura el token JWT
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        // Devuelve el token y algunos datos del usuario autenticado
        return Ok(new
        {
            id = usuario.Id,
            username = usuario.Username,
            role = usuario.Role,
            token = tokenString,
            // Lista de claims devueltos como información adicional
            claims = claims.Select(c => new { c.Type, c.Value })
        });
    }
}

// DTO utilizado para el registro de usuarios
public class RegisterDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

// DTO utilizado para el inicio de sesión
public class LoginDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}
