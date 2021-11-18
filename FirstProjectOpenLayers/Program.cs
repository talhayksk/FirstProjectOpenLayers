using Microsoft.Extensions.FileProviders;
using System.IO;
var builder = WebApplication.CreateBuilder(args);

#region �njection
#endregion




// Add services to the container.
builder.Services.AddControllersWithViews();// projenin mvc mimarisini kullan�ca��n� belirttik ve controller  ve views yap�s�n� �a��rd�.
IWebHostEnvironment env = builder.Environment;
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();//wwwroot klasr�ndeki dosyalara eri�ilmesini sa�lan�yor

app.UseHttpsRedirection();



app.UseStaticFiles(new StaticFileOptions //wwwroot klas�r�� d���ndaki dosylara eri�im sa�l�yor
{
    FileProvider = new PhysicalFileProvider(
            Path.Combine(env.ContentRootPath, "Files")),
    RequestPath = "/Files",
   // kml dosyas�  bu iki sat�r eklenmesi gerekiyor ��nki .net6 da bilinmeyen dosya t�r�nene izin vermiyor !!
    ServeUnknownFileTypes = true,
    DefaultContentType = "kml"
});


app.UseRouting();// burada gelen riquest e g�re  nreye y�nlendirmesi gerekiyorse o controllera y�nlendiriliyor 

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
