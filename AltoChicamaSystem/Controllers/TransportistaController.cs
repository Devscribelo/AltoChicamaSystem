using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;

namespace AltoChicamaSystem.Controllers
{
    [Authorize]
    public class TransportistaController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Transportista/Index.cshtml");
        }

        private readonly TransportistaCN objusuarioCN = new TransportistaCN();
        private readonly IConfiguration conf;
        public TransportistaController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public ActionResult RegTransportista([FromBody] CMTransportista cmtransportista)
        {
            var result = Tuple.Create("1", "Error al Registrar");
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.regTransportista(cmtransportista, bandera);

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
        public ActionResult modTransportista([FromBody] CMTransportista cmtransportista)
        {
            var result = Tuple.Create("1", "Error al Modificar");
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objusuarioCN.modTransportista(cmtransportista, bandera);

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
        public ActionResult ListaTransportista()
        {
            var result = Tuple.Create("1", "Error al listar Empresa", new List<CMTransportista>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.listaTransportista(bandera);

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
        public ActionResult TransportistaSelect()
        {
            var result = Tuple.Create("1", "Error al listar Empresa", new List<CMTransportista>());
            try
            {
                string bandera = conf.GetValue<string>("bandera");
                result = objusuarioCN.TransportistaSelect(bandera);
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
        public ActionResult DelTransportista([FromBody] CMTransportista cmtransportista)
        {
            var result = Tuple.Create("1", "Error al Eliminar");
            try
            {
                // Obtén la bandera desde la configuración o un valor por defecto
                string bandera = conf.GetValue<string>("Bandera");

                // Asegúrate de que `empresa_id` se maneje como `int`
                int transportista_id = cmtransportista.transportista_id;  // Suponiendo que `empresa_id` es un int en el modelo

                // Llama al método del negocio para eliminar la empresa
                result = objusuarioCN.delTransportista(cmtransportista, bandera, transportista_id);

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