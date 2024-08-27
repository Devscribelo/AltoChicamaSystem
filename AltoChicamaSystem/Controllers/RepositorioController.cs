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

        [HttpPost]
        public IActionResult EliminarDocumento([FromBody] CMDocumento request)
        {
            var result = Tuple.Create("1", "Error al eliminar documento");
            try
            {
                if (request == null || request.documento_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de documento inválido"));
                }

                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.eliminarDocumento(request.documento_id, bandera);

                if (result.Item1 == "0")
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                // Incluye detalles del error en la respuesta
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}"));
            }
        }
    }
}
