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
    }
}
