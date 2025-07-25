/*
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción:
 * Este archivo representa el punto de entrada principal de la aplicación ASP.NET Core. 
 * Aquí se configuran servicios esenciales como la conexión a la base de datos, la autenticación basada en JWT,
 * políticas de CORS para el cliente React, generación de documentación Swagger, y el pipeline de middleware.
 * Su correcta configuración es fundamental para el funcionamiento seguro, estable y escalable del backend.
 */

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TurismoLocal.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Obtiene la clave secreta JWT desde appsettings.json.
// Esta clave se utiliza para firmar y validar tokens de autenticación.
var secret = builder.Configuration["JwtSettings:Secret"];
if (string.IsNullOrEmpty(secret))
    throw new Exception("Falta JwtKey en appsettings.json");

var key = Encoding.ASCII.GetBytes(secret);

// Configuración del contexto de base de datos (Entity Framework Core)
// Se conecta a SQL Server utilizando la cadena de conexión definida en appsettings.json.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de autenticación mediante JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Se desactiva HTTPS para pruebas locales (no recomendado en producción)
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, // Valida la firma del token
        IssuerSigningKey = new SymmetricSecurityKey(key), // Clave de firma
        ValidateIssuer = false, // No se valida el emisor
        ValidateAudience = false // No se valida el destinatario
    };
});

// Configuración de CORS para permitir el acceso desde el frontend (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Agrega servicios necesarios para controladores, endpoints y documentación
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configura Swagger solo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware del pipeline HTTP
app.UseHttpsRedirection();    // Redirección a HTTPS
app.UseStaticFiles();         // Servir archivos estáticos (como index.html para React)
app.UseRouting();             // Enrutamiento de solicitudes
app.UseCors("AllowAll");      // Política de CORS
app.UseAuthentication();      // Autenticación JWT
app.UseAuthorization();       // Autorización basada en roles o claims
app.MapControllers();         // Mapeo de controladores API

// Redirección de rutas no reconocidas a index.html (para manejo de rutas en SPA)
app.MapFallbackToFile("index.html");

// Inicia la aplicación
app.Run();
