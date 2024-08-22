using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;

namespace AltoChicamaSystem.Controllers
{
    [Authorize]
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

    }
}
