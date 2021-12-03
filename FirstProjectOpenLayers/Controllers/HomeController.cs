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
       

        public HomeController()
        {
          
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SehirKaydet(SehirDetay sehir)
        {
            
            var store = new DataStore("Files/data.json");
            var ilCollection = store.GetCollection<SehirDetay>();
            ilCollection.InsertOneAsync(sehir);

            return Json(sehir);

        }
        [HttpPost]
        public JsonResult SehirDetayKaydet(SehirDetay sehirDetay) {
            //var store = new DataStore("Files/sehirDetay.json");
            //var ilCollection = store.GetCollection<SehirDetay>();
            //ilCollection.InsertOne(sehirDetay);


            string path = ("Files/data.json");
            var store = new DataStore(path);
            var ilCollection = store.GetCollection<SehirDetay>();
            var kayit = ilCollection.AsQueryable().ToList().Where(p=>p.id==sehirDetay.id);
            if (kayit == null)
            {
                ilCollection.InsertOne(sehirDetay);
            }
            else { 
              var il = ilCollection.UpdateOne(x => x.id == sehirDetay.id, sehirDetay);
            var illist = ilCollection.AsQueryable().ToList();
            }
            return Json(null);
        }
        [HttpDelete]
        public JsonResult SehirDetaySil(string id)
        {
            string path = ("Files/data.json");
            var store = new DataStore(path);
            var ilCollection = store.GetCollection<SehirDetay>();
            var il = ilCollection.DeleteOne(x=>x.id == id);
            var illist = ilCollection.AsQueryable().ToList();
            var stores = new DataStore("Files/Data.json");
           var datailcoll = stores.GetCollection<sehir>();
            var datail = datailcoll.DeleteOne(x=>x.id == id);
            return Json(illist);

        }
        [HttpGet]
        public JsonResult GetListe() {
            string path = ("Files/data.json");
            var store = new DataStore(path);
            var ilCollection = store.GetCollection<SehirDetay>();
            var il = ilCollection.AsQueryable().ToList();
            return Json(il);
        }
        [HttpPost]
        public JsonResult GetListItem(string id)
        {
            string path = ("Files/data.json");
            var store = new DataStore(path);
            var ilCollection = store.GetCollection<SehirDetay>();
            var il = ilCollection.Find(id).ToList();
            return Json(il);
        }

        [HttpPost]
        public async Task<IActionResult> SaveFileAsync(IFormFile file) {
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
        [HttpPost]
        public IActionResult Listele() {

            return Index();
        }
        [HttpPost]
        public IActionResult SecilenlerListesi()
        {

            return Index();
        }
        [HttpPost]
        public IActionResult SehirDetay()
        {

            return Index();
        }

        //[HttpPost]
        //public IActionResult Listele()
        //{

        //    return Index();
        //}




    }
}