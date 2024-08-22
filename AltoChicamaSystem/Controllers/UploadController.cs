using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize]
    public class UploadController : Controller
    {
        public ActionResult Index()
        {
            // Retorna la vista 'Upload.cshtml'
            return View("~/Views/Repositorio/Upload.cshtml");
        }
        private readonly DocumentoCN objdocumentoCN = new DocumentoCN();
        private readonly IConfiguration conf;

        public UploadController(IConfiguration configuration)
        {
            conf = configuration;
        }

        [HttpPost]
        public ActionResult RegDocumento(IFormFile documento_pdf, string documento_titulo, int empresa_id)
        {
            var result = Tuple.Create("1", "Error al Registrar");
            try
            {
                // Convertir el archivo PDF a byte[]
                byte[] fileData = null;
                using (var memoryStream = new MemoryStream())
                {
                    documento_pdf.CopyTo(memoryStream);
                    fileData = memoryStream.ToArray();
                }

                CMDocumento cmDocumento = new CMDocumento
                {
                    documento_titulo = documento_titulo,
                    documento_pdf = fileData,
                    empresa_id = empresa_id
                };

                string bandera = conf.GetValue<string>("Bandera");
                result = objdocumentoCN.regDocumento(cmDocumento, bandera);

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
                return BadRequest(Tuple.Create("1", $"Error al Registrar: {ex.Message}"));
            }
        }

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

                return File(documento.documento_pdf, "application/pdf", $"{documento.documento_titulo}.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el documento: {ex.Message}");
            }
        }

    }
}
