using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin, User")]
    public class RepositorioClienteController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/RepositorioCliente/Index.cshtml");
        }

        private readonly DocumentoClienteCN objusuarioCN = new DocumentoClienteCN();
        private readonly IConfiguration conf;
        public RepositorioClienteController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public ActionResult listarDocumentoFiltrado([FromBody] int empresa_id)
        {
            var result = Tuple.Create("1", "Error al listar", new List<CMDocumentoResultCliente>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.listarDocumentoFiltrado(empresa_id, bandera);
                if (result.Item1 == "0")  // Verifica si la operación fue exitosa
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
