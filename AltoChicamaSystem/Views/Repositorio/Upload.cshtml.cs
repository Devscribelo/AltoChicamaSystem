using AltoChicamaSystem.Views.Home;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AltoChicamaSystem.Views.Repositorio
{
    public class UploadModel : PageModel
    {
        private readonly ILogger<UploadModel> _logger;

        public UploadModel(ILogger<UploadModel> logger)
        {
            _logger = logger;
        }
        public void OnGet()
        {
        }
    }
}