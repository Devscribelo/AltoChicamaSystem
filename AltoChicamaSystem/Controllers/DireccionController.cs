using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class DireccionController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Generador/Index.cshtml");
        }

        private readonly DireccionCN objusuarioCN = new DireccionCN();
        private readonly IConfiguration conf;
        public DireccionController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public ActionResult RegDireccion([FromBody] Direccion cmempresa)
        {
            var result = Tuple.Create("1", "Error al Direccion");
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.regDireccion(cmempresa, bandera);

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
        public ActionResult DireccionSelect([FromBody] Direccion request)
        {
            var result = Tuple.Create("1", "Error al listar Direccion", new List<Direccion>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.DireccionSelect(request.empresa_id, bandera);
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
        public ActionResult DelDireccion([FromBody] Direccion request)
        {
            var result = Tuple.Create("1", "Error al Eliminar");
            try
            {
                // Obtén la bandera desde la configuración o un valor por defecto
                string bandera = conf.GetValue<string>("Bandera");


                // Llama al método del negocio para eliminar la empresa
                result = objusuarioCN.delDireccion( bandera, request.direccion_id);

                return Ok(result);
            }
            catch
            {
                // En caso de error, retorna un BadRequest con el mensaje de error
                return BadRequest(result);
            }
        }



    }
}
