using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class EmpresaController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Empresa/Index.cshtml");
        }

        private readonly EmpresaCN objusuarioCN = new EmpresaCN();
        private readonly IConfiguration conf;
        public EmpresaController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public ActionResult RegEmpresa([FromBody] CMEmpresa cmempresa)
        {
            var result = Tuple.Create("1", "Error al Registrar");
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.regEmpresa(cmempresa, bandera);

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

        [HttpGet]
        public ActionResult ListaEmpresa()
        {
            var result = Tuple.Create("1", "Error al listar Empresa", new List<CMEmpresa>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.listarEmpresa(bandera);

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
        public ActionResult EmpresaSelect()
        {
            var result = Tuple.Create("1", "Error al listar Empresa", new List<CMEmpresa>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.EmpresaSelect(bandera);
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
        public ActionResult modEmpresa([FromBody] CMEmpresa cmempresa)
        {
            var result = Tuple.Create("1", "Error al Modificar");
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.modEmpresa(cmempresa, bandera);

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
        public ActionResult DelEmpresa([FromBody] CMEmpresa cmempresa)
        {
            var result = Tuple.Create("1", "Error al Eliminar");
            try
            {
                // Obtén la bandera desde la configuración o un valor por defecto
                string bandera = conf.GetValue<string>("Bandera");

                // Asegúrate de que `empresa_id` se maneje como `int`
                int empresa_id = cmempresa.empresa_id;  // Suponiendo que `empresa_id` es un int en el modelo

                // Llama al método del negocio para eliminar la empresa
                result = objusuarioCN.delEmpresa(cmempresa, bandera, empresa_id);

                return Ok(result);
            }
            catch
            {
                // En caso de error, retorna un BadRequest con el mensaje de error
                return BadRequest(result);
            }
        }




        [HttpPost]
        public IActionResult AlterEmpresaStatus([FromBody] CMEmpresa request)
        {
            var result = Tuple.Create("1", "Error al Alterar Estado");

            try
            {
                string bandera = conf.GetValue<string>("Bandera");

                // Usar empresa_id del modelo CMEmpresa
                result = objusuarioCN.alterEmpresaStatus(request.empresa_id, bandera);

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



    }
}
