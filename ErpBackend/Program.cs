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
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlite("Data Source=ErpBackend.db"));
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("your_super_secret_key_123tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyfuvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie()
.AddOpenIdConnect(options =>
{
    var oidcConfig = builder.Configuration.GetSection("OpenIDConnectSettings");
    Console.WriteLine("OIDC Authority: " + oidcConfig["Authority"]);

    options.Authority = oidcConfig["Authority"];
    options.ClientId = oidcConfig["ClientId"];
    options.ClientSecret = oidcConfig["ClientSecret"];
    options.RequireHttpsMetadata = false;
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.ResponseType = OpenIdConnectResponseType.Code;
    options.SaveTokens = true;
    options.GetClaimsFromUserInfoEndpoint = true;

    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = JwtRegisteredClaimNames.Name,
        RoleClaimType = "roles"
    };
});
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


var app = builder.Build();

// Configure the HTTP request pipeline.

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

//MapGroup
var group = app.MapGroup("/auth");

// Redirection
group.MapGet("/", [Microsoft.AspNetCore.Authorization.Authorize] (HttpContext context) =>
{
    var name = context.User.Identity?.Name;
    return $"Welcome {name}";
});
app.MapGet("/login-test", [Microsoft.AspNetCore.Authorization.Authorize] () => "You are logged in");


// Register Endpoint
app.MapPost("/register", async (RegisterDto userDto, AppDbContext db) =>
{

    var userExists = await db.Users.AnyAsync(u => u.Username == userDto.Username);
    if (userExists) return Results.BadRequest("User Already Exists");

    var user = new User
    {
        Username = userDto.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Ok("User registered");
});

// Login endpoint


group.MapPost("/login", async (LoginDto loginDto, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
    if (user is null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        return Results.Unauthorized();

    // Generate JWT
    var claims = new[]
    {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_super_secret_key_123tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyfuvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: null,
        audience: null,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
        );
    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

    return Results.Ok(new { token = tokenString });
});

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = "docs";
    });
};

app.Run();
