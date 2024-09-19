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
            var result = Tuple.Create("1", "Error al iniciar sesión", 0);
            try
            {
                string bandera = conf.GetValue<string>("Bandera");
                result = objadminCN.loginAdmin(cmadmin, bandera);

                if (result.Item1 == "0")  // Inicio de sesión Admin
                {
                    var role = "Admin";
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Name, cmadmin.admin_user.ToString()),
                        new Claim(ClaimTypes.Role, role)
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                    return Ok(result);
                }
                if (result.Item1 == "1")  // Inicio de sesión Usuario
                {
                    var role = "User";
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Name, cmadmin.admin_user.ToString()),
                        new Claim(ClaimTypes.Role, role),
                        new Claim(ClaimTypes.NameIdentifier, result.Item3.ToString())
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                    return Ok(result);
                }
                if (result.Item1 == "3")  // Inicio de sesión Transportista
                {
                    var role = "Transportista";
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Name, cmadmin.admin_user.ToString()),
                        new Claim(ClaimTypes.Role, role),
                        new Claim(ClaimTypes.NameIdentifier, result.Item3.ToString())  // Aquí puedes agregar más claims si es necesario
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                    return Ok(result);  // Devuelve la respuesta para transportista
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
