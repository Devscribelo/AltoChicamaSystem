using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    public class GuiaController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        private readonly GuiaCN objusuarioCN = new GuiaCN();

        private readonly IConfiguration conf;
        public GuiaController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public ActionResult RegistrarGuia([FromBody] CMGuia guia)
        {
            try
            {
                if (guia == null)
                {
                    return BadRequest(Tuple.Create("1", "Datos de guía inválidos"));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.registrarGuia(guia, bandera);

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
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}"));
            }
        }

        [HttpGet]
        public ActionResult GuiaSelect()
        {
            var result = Tuple.Create("1", "Error al listar Guia", new List<GuiaSelect>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.GuiaSelect(bandera);
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
        public ActionResult ListarGuiaFiltro([FromBody] GuiaResult request) {
            try
            {
                if (request == null || request.id_factura <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de factura inválido", new List<GuiaResult>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.listarGuiaFiltro(request.id_factura, bandera);

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
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}", new List<GuiaResult>()));
            }
        }
    }
}
