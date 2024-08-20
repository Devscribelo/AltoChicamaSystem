using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;

namespace AltoChicamaSystem.Controllers
{
    public class EmpresaController : Controller
    {
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
        
    }
}
