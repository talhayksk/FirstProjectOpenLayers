using FirstProjectOpenLayers.Models;
using Microsoft.AspNetCore.Mvc;
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