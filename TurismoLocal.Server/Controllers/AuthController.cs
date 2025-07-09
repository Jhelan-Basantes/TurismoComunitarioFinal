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

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (_context.Usuarios.Any(u => u.Username == dto.Username))
            return BadRequest("El usuario ya existe.");

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

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var usuario = _context.Usuarios.SingleOrDefault(u => u.Username == dto.Username);
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return Unauthorized("Credenciales inválidas");

        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Username),
                new Claim(ClaimTypes.Role, usuario.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new { token = tokenString });
    }
}

public class RegisterDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

public class LoginDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}