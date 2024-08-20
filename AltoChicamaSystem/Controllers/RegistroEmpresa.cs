using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    public class RegistroEmpresa : Controller
    {
        // GET: RegistroEmpresa
        public ActionResult Index()
        {
			return View("~/Views/Repositorio/RegistroEmpresa.cshtml");
		}

		// GET: RegistroEmpresa/Details/5
		public ActionResult Details(int id)
        {
            return View();
        }

        // GET: RegistroEmpresa/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: RegistroEmpresa/Create
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

        // GET: RegistroEmpresa/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: RegistroEmpresa/Edit/5
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

        // GET: RegistroEmpresa/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: RegistroEmpresa/Delete/5
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
    }
}
