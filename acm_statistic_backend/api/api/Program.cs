using api.Data;
using api.Repository.dashboard;
using api.Repository.evolutionTemporel;
using api.Repository.exploitant;
using api.Repository.mois;
using api.Repository.passager;
using api.Repository.performance.aeroport;
using api.Repository.performance.compagnie;
using api.Repository.redevance;
using api.Repository.utilisateur;
using api.Service.dashboard;
using api.Service.evolutionTemporel;
using api.Service.exploitantService;
using api.Service.modelMl.anomalieRedevance;
using api.Service.modelMl.anomalieRedevanceCompagnie;
using api.Service.modelMl.projectionRedevance;
using api.Service.modelMl.Standardisation;
using api.Service.mois;
using api.Service.performance.aeroport;
using api.Service.performance.compagnie;
using api.Service.redevanceAnneeMois;
using api.Service.utilisateur;
using api.Settings.token;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ML;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<MLContext>(_ => new MLContext());

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
var key = Encoding.ASCII.GetBytes(jwtSettings.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<JwtTokenService>();


// Add services to the container.
builder.Services.AddScoped<UtilisateurService>();
builder.Services.AddScoped<UtilisateurRepository>();
builder.Services.AddScoped<ComparaisonDynamiqueRepository>();
builder.Services.AddScoped<ComparaisonDynamiqueService>();
builder.Services.AddScoped<ComparaisonDynamiqueResumerService>();
builder.Services.AddScoped<ComparaisonDynamiqueResumerRepository>();
builder.Services.AddScoped<RedevanceMensuelService>();
builder.Services.AddScoped<RedevanceMensuelRepository>();
builder.Services.AddScoped<RepartitionGlobalCompagnieService>();
builder.Services.AddScoped<RepartitionGlobalCompagnieRepository>();
builder.Services.AddScoped<RepartitionTypeCompagnieService>();
builder.Services.AddScoped<RepartitionTypeCompagnieRepository>();
builder.Services.AddScoped<RedevanceAeorportGlobalService>();
builder.Services.AddScoped<RedevanceAeroportGlobalRepository>();
builder.Services.AddScoped<RedevanceAeroportTypeService>();
builder.Services.AddScoped<RedevanceAeroportTypeRepository>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<DashboardRepository>();
builder.Services.AddScoped<MonthService>();
builder.Services.AddScoped<MonthRepository>();
builder.Services.AddScoped<RepartitionGlobalCompagnieMoisRepository>();
builder.Services.AddScoped<RepartitionGloabalCompagnieMoisService>();
builder.Services.AddScoped<RepartitionTypeCompagnieMoisRepository>();
builder.Services.AddScoped<RepartitionTypeCompagnieMoisService>();
builder.Services.AddScoped<ProjectionService>();
builder.Services.AddScoped<RedevanceAnneeMoisService>();
builder.Services.AddScoped<RedevanceAnneeMoisRepository>();
builder.Services.AddScoped<AnomalieRedevanceService>();
builder.Services.AddScoped<StandardisationRedevanceService>();
builder.Services.AddScoped<AnomalieRedevanceCompagnieService>();
builder.Services.AddScoped<ExploitantRepository>();
builder.Services.AddScoped<ExploitantService>();
builder.Services.AddScoped<PassagerDetailRepository>();
builder.Services.AddScoped<PassagerComparaisonRepository>();
builder.Services.AddScoped<PassagerRepartitionRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TestApi", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Entrez 'Bearer {token}' dans le champ ci-dessous.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                In = ParameterLocation.Header,
                Name = "Authorization",
                Scheme = "Bearer"
            },
            new List<string>()
        }
    });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(); 
app.UseAuthentication();
app.UseAuthorization();



app.MapControllers();

app.Run();
