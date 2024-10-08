using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UploadController : Controller
    {
        private readonly DocumentoCN objdocumentoCN = new DocumentoCN();
        private readonly IConfiguration conf;

        public UploadController(IConfiguration configuration)
        {
            conf = configuration;
        }

        [HttpPost]
        public async Task<ActionResult> RegDocumento(IFormFile documento_pdf, string documento_titulo, int empresa_id, int guia_id)
        {
            try
            {
                if (documento_pdf == null || documento_pdf.Length == 0)
                {
                    return BadRequest(Tuple.Create("1", "No se ha proporcionado un archivo PDF válido."));
                }

                byte[] fileData;
                using (var memoryStream = new MemoryStream())
                {
                    await documento_pdf.CopyToAsync(memoryStream);
                    fileData = memoryStream.ToArray();
                }

                string bandera = conf.GetValue<string>("Bandera");
                int documento_numero = int.Parse(objdocumentoCN.Documento_MaxNumero(bandera).Item2) + 1;

                CMDocumento cmDocumento = new CMDocumento
                {
                    documento_pdf = fileData,
                    empresa_id = empresa_id,
                    documento_status = "1", // Asumiendo que 1 es activo
                    documento_numero = documento_numero,
                    guia_id = guia_id
                };

                var result = objdocumentoCN.regDocumento(cmDocumento, bandera);

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

        [AllowAnonymous]
        [HttpGet]
        [Route("api/Documento/ObtenerDocumento/{documentoId}")]
        public IActionResult ObtenerDocumento(int documentoId)
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var documento = objdocumentoCN.ObtenerDocumentoPorId(documentoId, bandera);

                if (documento == null)
                {
                    return NotFound("Documento no encontrado");
                }

                return File(documento.documento_pdf, "application/pdf", $"{documento.documento_id}.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el documento: {ex.Message}");
            }
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/Documento/Ver/{documentoId}")]
        public IActionResult VerDocumento(int documentoId)
        {
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                var documento = objdocumentoCN.ObtenerDocumentoPorId(documentoId, bandera);

                if (documento == null)
                {
                    return NotFound("Documento no encontrado");
                }

                // Configura el Content-Disposition como inline
                Response.Headers.Add("Content-Disposition", "inline; filename=" + $"{documento.documento_id}.pdf");

                return File(documento.documento_pdf, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el documento: {ex.Message}");
            }
        }


    }
}
