using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    public class ValorizacionController : Controller
    {
        // GET: ValorizacionController
        public ActionResult Index()
        {
            return View();
        }

        private readonly ValorizacionCN objusuarioCN = new ValorizacionCN();

        private readonly IConfiguration conf;
        public ValorizacionController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public async Task<ActionResult> RegistrarValorizacion(string guia_ids, string valorizacion_costotn, decimal valorizacion_subtotal, decimal valorizacion_igv, string valorizacion_codigo, int transportista_id)
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera") ?? string.Empty;

                CMValorizacion cmvalorizacion = new CMValorizacion
                {
                    guia_ids = guia_ids,
                    valorizacion_costotn = valorizacion_costotn,
                    valorizacion_subtotal = valorizacion_subtotal,
                    valorizacion_igv = valorizacion_igv,
                    valorizacion_codigo = valorizacion_codigo,
                    transportista_id = transportista_id,
                };

                var result = objusuarioCN.registrarValorizacion(cmvalorizacion, bandera);

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
                return StatusCode(500, Tuple.Create("1", $"Error interno del servidor: {ex.Message}"));
            }
        }

        [HttpGet]
        public ActionResult ListaValorizacion()
        {
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.listarValorizacion(bandera);

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
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<CMValorizacion>()));
            }
        }

        [HttpPost]
        public IActionResult EliminarValorizacion([FromBody] CMValorizacion request)
        {
            try
            {
                if (request == null || request.valorizacion_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de guía inválido"));
                }

                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.eliminarValorizacion(request.valorizacion_id, bandera);

                // Registrar el resultado para depuración
                Console.WriteLine($"Resultado de eliminarValorizacion: Item1={result.Item1}, Item2={result.Item2}");

                if (result.Item1 == "0")
                {
                    return Ok(result);
                }
                else
                {
                    // Registrar el error para depuración
                    Console.WriteLine($"Error al eliminar valorizacion: {result.Item2}");
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                // Registrar la excepción para depuración
                Console.WriteLine($"Excepción al eliminar valorizacion: {ex.Message}");
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}"));
            }
        }

        [HttpPost]
        public ActionResult ListarValorizacionDetalle([FromBody] CMValorizacion request)
        {
            try
            {
                if (request == null || request.valorizacion_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de factura inválido", new List<CMValorizacion>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.listarValorizacionDetalle(request.valorizacion_id, bandera);

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
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}", new List<CMValorizacion>()));
            }
        }


        [HttpPost]
        public ActionResult ValorizacionSelect([FromBody] CMValorizacion request)
        {
            var result = Tuple.Create("1", "Error al listar Valorizacion", new List<CMValorizacion>());
            try
            {
                if (request == null || request.transportista_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de transportista inválido", new List<CMValorizacion>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                result = objusuarioCN.ValorizacionSelect(request.transportista_id, bandera);

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
        public ActionResult ValorizacionReturn([FromBody] CMValorizacion request)
        {
            var result = Tuple.Create("1", "Error al listar Valorizacion", new List<CMValorizacion>());
            try
            {
                if (request == null || request.valorizacion_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de valorización inválido", new List<CMValorizacion>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                result = objusuarioCN.ValorizacionReturn(request.valorizacion_id, bandera);

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
        public ActionResult listarValorizacionTransportista([FromBody] CMValorizacion request)
        {
            var result = Tuple.Create("1", "Error al listar", new List<CMValorizacion>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.listarValorizacionTransportista(request.transportista_id, bandera);

                if (result.Item1 == "0")  // Verifica si la operación fue exitosa
                {
                    return Ok(result);
                }
                else if (result.Item1 == "1") // No hay datos
                {
                    return NotFound(new { Rpta = result.Item1, Msg = result.Item2 });
                }
                else // Para cualquier otro error
                {
                    return BadRequest(new { Rpta = result.Item1, Msg = result.Item2 });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Rpta = "1", Msg = ex.Message });
            }
        }
    }
}
