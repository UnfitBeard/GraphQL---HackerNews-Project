using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ErpBackend.Models;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlite("Data Source=ErpBackend.db"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key"))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// Register Endpoint
app.MapPost("/register", async (User userDto, AppDbContext db) =>
{
    var userExists = await db.Users.AnyAsync(u => u.Username == userDto.Username);
    if (userExists) return Results.BadRequest("User Already Exists");

    var user = new User
    {
        Username = userDto.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.PasswordHash),
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Ok("User registered");
});

app.MapPost("/login", async (User userDto, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
    if (user is null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
        return Results.Unauthorized();
});
app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
