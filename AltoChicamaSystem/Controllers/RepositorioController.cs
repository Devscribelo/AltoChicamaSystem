using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
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
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.listarDocumento(bandera);

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
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<DocumentoResult>()));
            }
        }

        [HttpPost]
        public IActionResult EliminarDocumento([FromBody] CMDocumento request)
        {
            try
            {
                if (request == null || request.documento_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de documento inválido"));
                }

                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.eliminarDocumento(request.documento_id, bandera);

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
        public ActionResult ObtenerDeudaTransportista([FromBody] CMDocumento request)
        {
            try
            {
                if (request == null || request.empresa_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de empresa inválido", string.Empty, string.Empty));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.ObtenerDeudaTransportista(request.empresa_id, bandera);

                if (result.Item1 == "Exito")
                {
                    return Ok(Tuple.Create("0", "Operación exitosa", result.Item2, result.Item3));
                }
                else
                {
                    return BadRequest(Tuple.Create("1", "Error al obtener la deuda", result.Item2, string.Empty));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, Tuple.Create("1", $"Excepción: {ex.Message}", string.Empty, string.Empty));
            }
        }

        [HttpPost]
        public ActionResult ObtenerDeudaTotalTransportistas()
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.ObtenerDeudaTotalTransportistas(bandera);

                if (result.Item1 == "Exito")
                {
                    return Ok(Tuple.Create("0", "Operación exitosa", result.Item2));
                }
                else
                {
                    return BadRequest(Tuple.Create("1", "Error al obtener la deuda total", result.Item2));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, Tuple.Create("1", $"Excepción: {ex.Message}", string.Empty));
            }
        }

        [HttpPost]
        public ActionResult ObtenerGananciaTotalTransportistas()
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.ObtenerGananciaTotalTransportistas(bandera);

                if (result.Item1 == "Exito")
                {
                    return Ok(Tuple.Create("0", "Operación exitosa", result.Item2));
                }
                else
                {
                    return BadRequest(Tuple.Create("1", "Error al obtener la ganancia total", result.Item2));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, Tuple.Create("1", $"Excepción: {ex.Message}", string.Empty));
            }
        }

        [HttpPost]
        public ActionResult listarDocumentoEmpresa([FromBody] DocumentoResult request)
        {
            try
            {
                if (request == null || request.empresa_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de empresa inválido", new List<DocumentoResult>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                bool? estado = request.documento_status == "1";
                var result = objusuarioCN.listarDocumentoEmpresa(request.empresa_id, estado, bandera);

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
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<DocumentoResult>()));
            }
        }

        [HttpPost]
        public ActionResult listarDocumentoTransportista([FromBody] DocumentoResult request)
        {
            try
            {
                if (request == null || request.guia_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de guía inválido", new List<DocumentoResult>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.listarDocumentoTransportista(request.guia_id, bandera);

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
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<DocumentoResult>()));
            }
        }

        [HttpPost]
        public ActionResult ObtenerMayorDocumentoID()
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.ObtenerMayorDocumentoID(bandera);

                if (result.Item1 == "Exito")
                {
                    return Ok(Tuple.Create("0", "Operación exitosa", result.Item2));
                }
                else
                {
                    return BadRequest(Tuple.Create("1", "Error al obtener el mayor documento ID", result.Item2));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, Tuple.Create("1", $"Excepción: {ex.Message}", string.Empty));
            }
        }

        [HttpPost]
        public ActionResult Documento_MaxNumero()
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.Documento_MaxNumero(bandera);

                if (result.Item1 == "Exito")
                {
                    return Ok(Tuple.Create("0", "Operación exitosa", result.Item2));
                }
                else
                {
                    return BadRequest(Tuple.Create("1", "Error al obtener el mayor número de Documento", result.Item2));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, Tuple.Create("1", $"Excepción: {ex.Message}", string.Empty));
            }
        }
    }
}