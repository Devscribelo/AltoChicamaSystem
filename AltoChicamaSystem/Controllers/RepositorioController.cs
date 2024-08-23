using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize]
    public class RepositorioController : Controller
    {
        private readonly DocumentoCN objusuarioCN = new DocumentoCN();
        private readonly IConfiguration conf;
        public RepositorioController(IConfiguration config)
        {
            conf = config;
        }
        // GET: RepositorioController
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ListaDocumento()
        {
            var result = Tuple.Create("1", "Error al listar Empresa", new List<DocumentoResult>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.listarDocumento(bandera);

                if (result.Item1 == "0")
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch
            {
                return BadRequest(result);
            }
        }
    }
}
