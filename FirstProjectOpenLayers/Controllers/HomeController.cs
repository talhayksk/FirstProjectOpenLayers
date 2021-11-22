using FirstProjectOpenLayers.Models;
using JsonFlatFileDataStore;
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
            //   string path = @HostingEnvironment.ApplicationPhysicalPath + "Files\\data.json";


            //string filepath = Server.MapPath(Url.Content("~/Content/Xsl/"));
            //filepath += "/Content/Xsl/pubmed.xslt";
            var store = new DataStore("Files/data.json");
            var ilCollection = store.GetCollection<sehir>();
            ilCollection.InsertOne(sehir);

            return Json(sehir);

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