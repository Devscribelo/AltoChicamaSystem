using AltoChicamaSystem.Data.Usuario;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class UsuarioCN
    {

        private UsuarioDB objDato = new UsuarioDB();

        public Tuple<string, string, List<CMUsuario>> listarUsuario(string bandera)
        {
            var result = objDato.listarUsuario(bandera);
            return result;
        }

        public Tuple<string, string> regUsuario(CMUsuario cmUsuario, string bandera)
        {
            var result = objDato.regUsuario(cmUsuario, bandera);
            return result;
        }

    }
}
