using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public IActionResult AlterDocumentoStatus([FromBody] CMDocumento request)
        {
            var result = Tuple.Create("1", "Error al Alterar Estado");

            try
            {
                string bandera = conf.GetValue<string>("Bandera");

                // Usar empresa_id del modelo CMEmpresa
                result = objusuarioCN.alterDocumentoStatus(request.documento_id, bandera);

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

        public ActionResult ObtenerDeudaTransportista([FromBody] CMDocumento request)
        {
            var result = Tuple.Create("1", "Error al obtener la deuda", string.Empty, string.Empty);

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var negocioResult = objusuarioCN.ObtenerDeudaTransportista(request.transportista_id, bandera);

                if (negocioResult.Item1 == "Exito")
                {
                    result = Tuple.Create("0", "Operación exitosa", negocioResult.Item2, negocioResult.Item3);
                }
                else
                {
                    result = Tuple.Create("1", "Error al obtener la deuda", negocioResult.Item2, string.Empty);
                }
                return Json(result);
            }
            catch (Exception ex)
            {
                result = Tuple.Create("1", "Excepción: " + ex.Message, string.Empty, string.Empty);
                return Json(result);
            }
        }


        [HttpPost]
        public ActionResult ObtenerDeudaTotalTransportistas([FromBody] object request)
        {
            var result = Tuple.Create("1", "Error al obtener la deuda", string.Empty);

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var negocioResult = objusuarioCN.ObtenerDeudaTotalTransportistas(bandera);

                if (negocioResult.Item1 == "Exito")
                {
                    result = Tuple.Create("0", "Operación exitosa", negocioResult.Item2);
                }
                else
                {
                    result = Tuple.Create("1", "Error al obtener la deuda", negocioResult.Item2);
                }
                return Json(result);
            }
            catch (Exception ex)
            {
                result = Tuple.Create("1", "Excepción: " + ex.Message, string.Empty);
                return Json(result);
            }
        }

        [HttpPost]
        public ActionResult ObtenerGananciaTotalTransportistas([FromBody] object request)
        {
            var result = Tuple.Create("1", "Error al obtener la deuda", string.Empty);

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var negocioResult = objusuarioCN.ObtenerGananciaTotalTransportistas(bandera);

                if (negocioResult.Item1 == "Exito")
                {
                    result = Tuple.Create("0", "Operación exitosa", negocioResult.Item2);
                }
                else
                {
                    result = Tuple.Create("1", "Error al obtener la deuda", negocioResult.Item2);
                }
                return Json(result);
            }
            catch (Exception ex)
            {
                result = Tuple.Create("1", "Excepción: " + ex.Message, string.Empty);
                return Json(result);
            }
        }


        [HttpPost]
        public ActionResult listarDocumentoEmpresa([FromBody] DocumentoResult request)
        {
            var result = Tuple.Create("1", "Error al listar", new List<DocumentoResult>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.listarDocumentoEmpresa(request.empresa_id, request.estado, bandera);
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
        public ActionResult listarDocumentoTransportista([FromBody] DocumentoResult request)
        {
            var result = Tuple.Create("1", "Error al listar", new List<DocumentoResult>());

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.listarDocumentoTransportista(request.transportista_id, request.estado, bandera);
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
        public ActionResult ObtenerMayorDocumentoID()
        {
            var result = Tuple.Create("1", "Error al obtener el mayor documento ID", string.Empty);

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var negocioResult = objusuarioCN.ObtenerMayorDocumentoID(bandera);

                if (negocioResult.Item1 == "Exito")
                {
                    result = Tuple.Create("0", "Operación exitosa", negocioResult.Item2);
                }
                else
                {
                    result = Tuple.Create("1", "Error al obtener el mayor documento ID", negocioResult.Item2);
                }
                return Json(result);
            }
            catch (Exception ex)
            {
                result = Tuple.Create("1", "Excepción: " + ex.Message, string.Empty);
                return Json(result);
            }
        }

        [HttpPost]
        public ActionResult Documento_MaxNumero()
        {
            var result = Tuple.Create("1", "Error al obtener el mayor numero de Documento", string.Empty);

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var negocioResult = objusuarioCN.Documento_MaxNumero(bandera);

                if (negocioResult.Item1 == "Exito")
                {
                    result = Tuple.Create("0", "Operación exitosa", negocioResult.Item2);
                }
                else
                {
                    result = Tuple.Create("1", "Error al obtener el mayor documento ID", negocioResult.Item2);
                }
                return Json(result);
            }
            catch (Exception ex)
            {
                result = Tuple.Create("1", "Excepción: " + ex.Message, string.Empty);
                return Json(result);
            }
        }



    }
}
