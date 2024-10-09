using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin, Transportista")]  
    public class RepositorioTransportistaController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/RepositorioTransportista/Index.cshtml");
        }

        private readonly DocumentoClienteCN objusuarioCN = new DocumentoClienteCN();
        private readonly TransportistaCN objtransportistaCN = new TransportistaCN();
        private readonly IConfiguration conf;
        public RepositorioTransportistaController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public ActionResult listarDocumentoFiltradoTransportista([FromBody] int transportista_id)
        {
            var result = Tuple.Create("1", "Error al listar", new List<CMDocumentoResultCliente>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.listarDocumentoFiltradoTransportista(transportista_id, bandera);  // Llamada al método actualizado
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

        [HttpPost]
        public ActionResult transportistaVista([FromBody] int transportista_id)
        {
            var result = Tuple.Create("1", "Error al listar", new List<TransportistaVista>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objtransportistaCN.TransportistaVista(transportista_id, bandera);  // Llamada al método actualizado
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
