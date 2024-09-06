﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AltoChicamaSystem.Controllers
{
    public class GeneradorController : Controller
    {
        // GET: GeneradorController
        public ActionResult Index()
        {
            return View();
        }

        // GET: GeneradorController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: GeneradorController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: GeneradorController/Create
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

        // GET: GeneradorController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: GeneradorController/Edit/5
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

        // GET: GeneradorController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: GeneradorController/Delete/5
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
