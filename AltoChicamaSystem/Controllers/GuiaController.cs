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
        public ActionResult ListaGuia()
        {
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.listarGuia(bandera);

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
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<CMGuia>()));
            }
        }

        [HttpPost]
        public ActionResult listarGuiaTransportista([FromBody] CMGuia request)
        {
            try
            {
                if (request == null || request.transportista_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de transportista inválido", new List<CMGuia>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                bool? estado = request.guia_status == "1";
                var result = objusuarioCN.listarGuiaTransportista(request.transportista_id, estado, bandera);

                if (result.Item1 == "0")
                {
                    if (result.Item3.Count == 0)
                    {
                        // No se encontraron guías, pero no es un error
                        return Ok(Tuple.Create("0", result.Item2, result.Item3));
                    }
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<CMGuia>()));
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
        public IActionResult EliminarGuia([FromBody] CMGuia request)
        {
            try
            {
                if (request == null || request.guia_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de guía inválido"));
                }

                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.eliminarGuia(request.guia_id, bandera);

                // Registrar el resultado para depuración
                Console.WriteLine($"Resultado de eliminarGuia: Item1={result.Item1}, Item2={result.Item2}");

                if (result.Item1 == "0")
                {
                    return Ok(result);
                }
                else
                {
                    // Registrar el error para depuración
                    Console.WriteLine($"Error al eliminar guía: {result.Item2}");
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                // Registrar la excepción para depuración
                Console.WriteLine($"Excepción al eliminar guía: {ex.Message}");
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}"));
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
