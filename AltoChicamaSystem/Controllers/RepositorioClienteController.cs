using AltoChicamaSystem.Models;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Controllers
{
    [Authorize(Roles = "Admin, User")]
    public class RepositorioClienteController : Controller
    {
        private readonly DocumentoClienteCN objusuarioCN;
        private readonly IConfiguration conf;

        public RepositorioClienteController(IConfiguration config, DocumentoClienteCN documentoClienteCN)
        {
            conf = config;
            objusuarioCN = documentoClienteCN;
        }

        public ActionResult Index()
        {
            return View("~/Views/RepositorioCliente/Index.cshtml");
        }

        [HttpPost]
        public ActionResult listarDocumentoFiltrado([FromBody] CMDocumentoCliente request)
        {
            try
            {
                if (request == null || request.empresa_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de empresa inválido", new List<CMDocumentoResultCliente>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.listarDocumentoFiltrado(request.empresa_id, bandera);

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
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}", new List<CMDocumentoResultCliente>()));
            }
        }

        [HttpPost]
        public ActionResult listarDocumentoFiltradoTransportista([FromBody] CMDocumentoCliente request)
        {
            try
            {
                if (request == null || request.guia_id <= 0)
                {
                    return BadRequest(Tuple.Create("1", "ID de guía inválido", new List<CMDocumentoResultCliente>()));
                }

                string bandera = conf.GetValue<string>("Bandera");
                var result = objusuarioCN.listarDocumentoFiltradoTransportista(request.guia_id, bandera);

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
                return StatusCode(500, Tuple.Create("1", $"Error interno: {ex.Message}", new List<CMDocumentoResultCliente>()));
            }
        }
    }
}