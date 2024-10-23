using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
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
        public async Task<ActionResult> RegistrarGuia(string guia_numero, string guia_descarga, decimal guia_cantidad,string guia_unidad, int transportista_id, string guia_fecha_servicio, decimal guia_costo, string guia_direccion, IFormFile documento_pdf, int empresa_id, string documento_numero)
        {
            try
            {
                if (documento_pdf == null || documento_pdf.Length == 0)
                {
                    return BadRequest(Tuple.Create("1", "No se ha generado el PDF correctamente"));
                }

                byte[] fileData;
                using (var memoryStream = new MemoryStream())
                {
                    await documento_pdf.CopyToAsync(memoryStream);
                    fileData = memoryStream.ToArray();
                }

                string bandera = conf.GetValue<string>("Bandera") ?? string.Empty;

                CMGuia cmguia = new CMGuia
                {
                    guia_numero = guia_numero,
                    guia_descarga = guia_descarga,
                    guia_unidad = guia_unidad,
                    guia_cantidad = guia_cantidad,
                    transportista_id = transportista_id,
                    guia_fecha_servicio = guia_fecha_servicio.ToString().Trim(),
                    guia_costo = guia_costo,
                    guia_direccion = guia_direccion,
                    documento_pdf = fileData,
                    empresa_id = empresa_id,
                    documento_numero = documento_numero
                };

                var result = objusuarioCN.registrarGuia(cmguia, bandera);

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
                bool? estado = request.guia_status == "1" ? (bool?)true : null; // Manejo del estado

                var result = objusuarioCN.listarGuiaTransportista(request.transportista_id, estado, bandera);

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
        public ActionResult GuiaSelect([FromBody] CMGuia request)
        {
            var result = Tuple.Create("1", "Error al listar Guia", new List<GuiaSelect>());
            try
            {
                if (request == null || request.transportista_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de transportista inválido", new List<CMGuia>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                result = objusuarioCN.GuiaSelect(request.transportista_id, bandera);

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
        public ActionResult GuiaSelectFiltrado([FromBody] CMGuia request)
        {
            var result = Tuple.Create("1", "Error al listar Guia", new List<GuiaSelect>());
            try
            {
                if (request == null || request.transportista_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de transportista inválido", new List<CMGuia>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                result = objusuarioCN.GuiaSelectFiltrado(request.transportista_id, bandera);

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
        public ActionResult GuiaSelectValorizacion([FromBody] CMGuia request)
        {
            var result = Tuple.Create("1", "Error al listar Guia", new List<CMGuia>());
            try
            {
                // Validación de transportista_id y guia_id
                if (request == null || request.transportista_id <= 0 || request.guia_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de transportista o guía inválido", new List<CMGuia>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                // Llamar al método GuiaSelect con ambos parámetros
                result = objusuarioCN.GuiaSelectValorizacion(request.transportista_id, request.guia_id, bandera);

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
