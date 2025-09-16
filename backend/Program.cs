using backend.Data;
using backend.GraphQL;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register EF Core DbContext (PostgreSQL)
builder.Services.AddPooledDbContextFactory<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS: allow frontend to call backend
var frontendOrigin = Environment.GetEnvironmentVariable("FrontendOrigin") ?? "http://localhost:8082";
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(frontendOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Register GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<TasksQuery>()
    .AddMutationType<TasksMutation>()
    .AddSubscriptionType<TasksSubscription>()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");

// In container we often terminate TLS at proxy; skip HTTPS redirection when ASPNETCORE_URLS already set
var aspnetcoreUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (string.IsNullOrWhiteSpace(aspnetcoreUrls))
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseWebSockets();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapGraphQL();
});

app.Run();
