using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class FacturaController : Controller
    {
        private readonly FacturaCN objFacturaCN = new FacturaCN();
        private readonly IConfiguration conf;

        public FacturaController(IConfiguration config)
        {
            conf = config;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ListaFactura()
        {
            var result = Tuple.Create("1", "Error al listar Facturas", new List<CMFactura>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objFacturaCN.listarFactura(bandera);

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
        public IActionResult RegistrarFactura([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al registrar factura");
            try
            {
                if (request == null || request.factura_monto <= 0 || string.IsNullOrEmpty(request.num_factura))
                {
                    return BadRequest(Tuple.Create("1", "Datos de factura inválidos"));
                }

                string bandera = conf.GetValue<string>("bandera");
                result = objFacturaCN.regFactura(request, bandera);

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

        [HttpPost]
        public IActionResult ModificarFactura([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al modificar factura");
            try
            {
                if (request == null || request.id_factura <= 0 || request.factura_monto <= 0 || string.IsNullOrEmpty(request.num_factura))
                {
                    return BadRequest(Tuple.Create("1", "Datos de factura inválidos"));
                }

                string bandera = conf.GetValue<string>("bandera");
                result = objFacturaCN.modFactura(request, bandera);

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

        [HttpPost]
        public IActionResult EliminarFactura([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al eliminar factura");
            try
            {
                if (request == null || request.id_factura <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de factura inválido"));
                }

                string bandera = conf.GetValue<string>("bandera");
                result = objFacturaCN.delFactura(request.id_factura, bandera);

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

        [HttpPost]
        public IActionResult AlterFacturaStatus([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al Alterar Estado de la Factura");

            try
            {
                if (request == null || request.id_factura <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de factura inválido"));
                }

                string bandera = conf.GetValue<string>("bandera");

                // Usar id_factura del modelo CMFactura
                result = objFacturaCN.alterFacturaStatus(request.id_factura, bandera);

                if (result.Item1 == "0")  // Verifica si la operación fue exitosa
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
                // Log the exception (optional)
                // logger.LogError(ex, "An error occurred while altering the invoice status.");

                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}"));
            }
        }
    }
}