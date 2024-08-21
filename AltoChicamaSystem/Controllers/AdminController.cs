using AltoChicamaSystem.Models;
using Microsoft.AspNetCore.Mvc;
using AltoChicamaSystem.Negocio;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Reflection;

namespace AltoChicamaSystem.Controllers
{
    public class AdminController : Controller
    {
        private readonly AdminCN objadminCN = new AdminCN();
        private readonly IConfiguration conf;
        public AdminController(IConfiguration config)
        {
            conf = config;
        }

        [HttpPost]
        public async Task<ActionResult> LoginAdmin([FromBody] CMAdmin cmadmin)
        {
            var result = Tuple.Create("1","Error al iniciar sesión");
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objadminCN.loginAdmin(cmadmin, bandera);

                if (result.Item1 == "0")  // Verifica si la operación fue exitosa
                {
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Name, cmadmin.admin_user.ToString())
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
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

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }
    }
}
