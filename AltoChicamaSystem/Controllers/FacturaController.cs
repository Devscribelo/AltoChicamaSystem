﻿using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Azure.Core;
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

        [HttpGet]
        public ActionResult listarGananciasTransportistas()
        {
            var result = Tuple.Create("1", "Error al obtener ganancias", 0m); // Valor predeterminado

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objFacturaCN.listarGananciasTransportistas(bandera);

                if (result.Item1 == "0") // Verifica si la operación fue exitosa
                {
                    return Ok(result); // Devuelve el resultado completo
                }
                else
                {
                    return BadRequest(result); // Devuelve el resultado en caso de error
                }
            }
            catch
            {
                return BadRequest(result); // Devuelve el resultado en caso de excepción
            }
        }


        [HttpGet]
        public ActionResult listarDeudasTransportistas()
        {
            var result = Tuple.Create("1", "Error al obtener deudas", 0m); // Valor predeterminado

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objFacturaCN.listarDeudasTransportistas(bandera);

                if (result.Item1 == "0") // Verifica si la operación fue exitosa
                {
                    return Ok(result); // Devuelve el resultado completo
                }
                else
                {
                    return BadRequest(result); // Devuelve el resultado en caso de error
                }
            }
            catch
            {
                return BadRequest(result); // Devuelve el resultado en caso de excepción
            }
        }

        [HttpPost]
        public ActionResult listarGananciasTransportistasIndividual([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al obtener ganancias", 0m); // Valor predeterminado

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objFacturaCN.listarGananciasTransportistasIndividual(request.transportista_id, bandera);

                if (result.Item1 == "0") // Verifica si la operación fue exitosa
                {
                    return Ok(result); // Devuelve el resultado completo
                }
                else
                {
                    return BadRequest(result); // Devuelve el resultado en caso de error
                }
            }
            catch
            {
                return BadRequest(result); // Devuelve el resultado en caso de excepción
            }
        }

        [HttpPost]
        public ActionResult listarDeudasTransportistasIndividual([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al obtener deudas", 0m); // Valor predeterminado

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objFacturaCN.listarDeudasTransportistasIndividual(request.transportista_id, bandera);

                if (result.Item1 == "0") // Verifica si la operación fue exitosa
                {
                    return Ok(result); // Devuelve el resultado completo
                }
                else
                {
                    return BadRequest(result); // Devuelve el resultado en caso de error
                }
            }
            catch
            {
                return BadRequest(result); // Devuelve el resultado en caso de excepción
            }
        }

        [HttpPost]
        public ActionResult listarFacturaTransportista([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al listar", new List<CMFactura>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objFacturaCN.listarFacturaTransportista(request.transportista_id, request.estado, bandera);

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



        [HttpPost]
        public IActionResult AlterFacturaStatus([FromBody] CMFactura request)
        {
            var result = Tuple.Create("1", "Error al Alterar Estado");

            try
            {
                string bandera = conf.GetValue<string>("Bandera");

                // Usar empresa_id del modelo CMEmpresa
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
                // logger.LogError(ex, "An error occurred while altering the company status.");

                return BadRequest(result);
            }
        }

        [HttpPost]
        public IActionResult regFactura([FromBody] CMFactura request)
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
        public IActionResult modFactura([FromBody] CMFactura request)
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

    }
}