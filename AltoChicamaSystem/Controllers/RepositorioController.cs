using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    [Authorize]
    public class RepositorioController : Controller
    {
        // GET: RepositorioController
        public ActionResult Index()
        {
            return View();
        }

        // GET: RepositorioController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: RepositorioController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: RepositorioController/Create
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

        // GET: RepositorioController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: RepositorioController/Edit/5
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

        // GET: RepositorioController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: RepositorioController/Delete/5
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
