using AltoChicamaSystem.Data.Admin;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class AdminCN
    {
        private AdminDB objDato = new AdminDB();

        public Tuple<string, string> loginAdmin(CMAdmin cmadmin, string bandera)
        {
            var result = objDato.loginAdmin(cmadmin, bandera);
            return result;
        }
    }
}
