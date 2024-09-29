using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    public class GuiaController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        private readonly GuiaCN objusuarioCN = new GuiaCN();

        private readonly IConfiguration conf;
        public GuiaController(IConfiguration config)
        {
            conf = config;
        }

        [HttpGet]
        public ActionResult GuiaSelect()
        {
            var result = Tuple.Create("1", "Error al listar Guia", new List<GuiaSelect>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.GuiaSelect(bandera);
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
