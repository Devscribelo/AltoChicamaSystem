using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize]
    public class RepositorioClienteController : Controller
    {
        private readonly DocumentoClienteCN objusuarioCN = new DocumentoClienteCN();
        private readonly IConfiguration conf;
        public RepositorioClienteController(IConfiguration config)
        {
            conf = config;
        }
        // GET: RepositorioController
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult listarDocumentoFiltrado()
        {
            var result = Tuple.Create("1", "Error al listar Empresa", new List<DocumentoResult>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.listarDocumentoFiltrado(bandera);

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
