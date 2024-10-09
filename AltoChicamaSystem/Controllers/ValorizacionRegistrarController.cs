using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ValorizacionRegistrarController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Valorizacion/ValorizacionReg.cshtml");
        }

        private readonly DocumentoCN objdocumentoCN = new DocumentoCN();
        private readonly IConfiguration conf;

        public ValorizacionRegistrarController(IConfiguration configuration)
        {
            conf = configuration;
        }

        

    }
}
