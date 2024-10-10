using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ValorizacionRegistrarController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Valorizacion/ValorizacionReg.cshtml");
        }

        private readonly ValorizacionCN objvalorizacionCN = new ValorizacionCN();
        private readonly IConfiguration conf;

        public ValorizacionRegistrarController(IConfiguration configuration)
        {
            conf = configuration;
        }


        [HttpPost]
        public ActionResult RegistrarValorizacion([FromBody] CMValorizacion cmValorizacion)
        {
            // Respuesta por defecto en caso de error
            var result = Tuple.Create("1", "Error al Registrar Valorización");

            try
            {
                // Obtiene el valor de la bandera desde la configuración
                string bandera = conf.GetValue<string>("Bandera");

                // Llama a la capa de negocio para registrar la valorización
                result = objvalorizacionCN.registrarValorizacion(cmValorizacion, bandera);

                // Si el registro fue exitoso, retorna un OK (código 200)
                if (result.Item1 == "0")
                {
                    return Ok(result);
                }
                else
                {
                    // Si ocurrió un error, retorna un BadRequest (código 400)
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                // En caso de una excepción, también retorna un BadRequest
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}"));
            }
        }


    }
}
