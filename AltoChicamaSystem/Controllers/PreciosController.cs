using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class PreciosController : Controller
    {
        // GET: PreciosController
        public ActionResult Index()
        {
            return View();
        }
    }
}
