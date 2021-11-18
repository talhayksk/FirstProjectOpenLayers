using Microsoft.Extensions.FileProviders;
using System.IO;
var builder = WebApplication.CreateBuilder(args);

#region Ýnjection
#endregion




// Add services to the container.
builder.Services.AddControllersWithViews();// projenin mvc mimarisini kullanýcaðýný belirttik ve controller  ve views yapýsýný çaðýrdý.
IWebHostEnvironment env = builder.Environment;
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();//wwwroot klasründeki dosyalara eriþilmesini saðlanýyor

app.UseHttpsRedirection();



app.UseStaticFiles(new StaticFileOptions //wwwroot klasörðü dýþýndaki dosylara eriþim saðlýyor
{
    FileProvider = new PhysicalFileProvider(
            Path.Combine(env.ContentRootPath, "Files")),
    RequestPath = "/Files",
   // kml dosyasý  bu iki satýr eklenmesi gerekiyor çünki .net6 da bilinmeyen dosya türünene izin vermiyor !!
    ServeUnknownFileTypes = true,
    DefaultContentType = "kml"
});


app.UseRouting();// burada gelen riquest e göre  nreye yönlendirmesi gerekiyorse o controllera yönlendiriliyor 

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
