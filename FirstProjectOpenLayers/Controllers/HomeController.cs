using FirstProjectOpenLayers.Models;
using JsonFlatFileDataStore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using System.Diagnostics;

namespace FirstProjectOpenLayers.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SehirKaydet(sehir sehir)
        {
            
            var store = new DataStore("Files/data.json");
            var ilCollection = store.GetCollection<sehir>();
            ilCollection.InsertOne(sehir);

            return Json(sehir);

        }
        [HttpPost]
        public JsonResult SehirDetayKaydet(SehirDetay sehirDetay) {
            var store = new DataStore("Files/sehirDetay.json");
            var ilCollection = store.GetCollection<SehirDetay>();
            ilCollection.InsertOne(sehirDetay);

            return Json(sehirDetay);
        }
        [HttpDelete]
        public JsonResult SehirDetaySil(string id)
        {
            string path = ("Files/sehirDetay.json");
            var store = new DataStore(path);
            var ilCollection = store.GetCollection<SehirDetay>();
            var il = ilCollection.DeleteOne(x=>x.tuikilkodu==id);
            var illist = ilCollection.AsQueryable().ToList();
            return Json(illist);

        }
        [HttpGet]
        public JsonResult GetListe() {
            string path = ("Files/data.json");
            var store = new DataStore(path);
            var ilCollection = store.GetCollection<sehir>();
            var il = ilCollection.AsQueryable().ToList();
            return Json(il);
        }
      
        [HttpPost]
        public async Task<IActionResult> SaveFileAsync(IFormFile file) {
            string savePath = "c:\\temp\\uploads\\";
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var path = Path.Combine(
                        Directory.GetCurrentDirectory(), "Files",
                        file.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return RedirectToAction("Files");
                   

        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public JsonResult SavePoint()
        {
            return Json("");
        }

        [HttpPost]
        public JsonResult SavePoint(Kapi kapi, double x, double y, string no)
        {
            if (ModelState.IsValid)
            {
                kapi.KapiNo = no;
                kapi.x = x;
                kapi.y = y;
                //db.Kapi.Add(kapi);
                //db.SaveChanges();
            }
            return Json("");
        }
    }
}