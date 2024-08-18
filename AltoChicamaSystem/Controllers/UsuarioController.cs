using AltoChicamaSystem.Data.Usuario;
using AltoChicamaSystem.Models;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Negocio;
using Microsoft.Extensions.Configuration;


namespace AltoChicamaSystem.Controllers
{
    public class UsuarioController : Controller
    {
        private readonly UsuarioCN objusuarioCN = new UsuarioCN();
        private readonly IConfiguration conf;

        public UsuarioController(IConfiguration config)
        {
            conf = config;
        }

        [HttpGet]
        public ActionResult ListaUsuario()
        {
            var result = Tuple.Create("1", "Error al listar Usuario", new List<CMUsuario>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.listarUsuario(bandera);

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
    }
}
