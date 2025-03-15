using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.EntityFrameworkCore;
using ForumStudenti;
using ForumStudenti.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure services
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Add Azure Storage Service
builder.Services.AddScoped<IAzureStorageService, AzureStorageService>();

// Add Database Context
builder.Services.AddDbContext<ForumDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Forum and File Services
builder.Services.AddScoped<IForumService, ForumService>();
builder.Services.AddScoped<IFileService, FileService>();

// Add Configuration
builder.Services.AddScoped(sp => builder.Configuration);

await builder.Build().RunAsync();
