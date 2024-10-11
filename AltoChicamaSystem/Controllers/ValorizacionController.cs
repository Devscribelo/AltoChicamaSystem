using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    public class ValorizacionController : Controller
    {
        // GET: ValorizacionController
        public ActionResult Index()
        {
            return View();
        }

        private readonly ValorizacionCN objusuarioCN = new ValorizacionCN();

        private readonly IConfiguration conf;
        public ValorizacionController(IConfiguration config)
        {
            conf = config;
        }

        // GET: ValorizacionController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ValorizacionController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ValorizacionController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ValorizacionController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ValorizacionController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ValorizacionController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ValorizacionController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        public ActionResult ValorizacionSelect([FromBody] CMValorizacion request)
        {
            var result = Tuple.Create("1", "Error al listar Valorizacion", new List<CMValorizacion>());
            try
            {
                if (request == null || request.transportista_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de transportista inválido", new List<CMValorizacion>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                result = objusuarioCN.ValorizacionSelect(request.transportista_id, bandera);

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
        public ActionResult ValorizacionReturn([FromBody] CMValorizacion request)
        {
            var result = Tuple.Create("1", "Error al listar Valorizacion", new List<CMValorizacion>());
            try
            {
                if (request == null || request.valorizacion_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de valorización inválido", new List<CMValorizacion>()));
                }

                string bandera = conf.GetValue<string>("bandera");

                result = objusuarioCN.ValorizacionReturn(request.valorizacion_id, bandera);

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
