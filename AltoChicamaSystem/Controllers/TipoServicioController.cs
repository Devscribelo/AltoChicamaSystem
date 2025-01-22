using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class TipoServicioController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        private readonly TipoServicioCN objusuarioCN = new TipoServicioCN();

        private readonly IConfiguration conf;
        public TipoServicioController(IConfiguration config)
        {
            conf = config;
        }

       

        [HttpGet]
        public ActionResult ListaTipoServicio()
        {
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                var result = objusuarioCN.TipoServicioSelect(bandera);

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
                return BadRequest(Tuple.Create("1", $"Error: {ex.Message}", new List<CMTipoServicio>()));
            }
        }

        [HttpPost]
        public ActionResult ContarPorTipoServicio([FromBody] CMTipoServicio request)
        {
            var result = Tuple.Create("1", "Error", (int?)null, string.Empty);

            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.ContarPorTipoServicio(request, bandera);

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
                return BadRequest(result);
            }
        }


    }
}
