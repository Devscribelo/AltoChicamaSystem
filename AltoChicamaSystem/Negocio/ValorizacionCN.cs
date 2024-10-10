using AltoChicamaSystem.Data.Valorizacion;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class ValorizacionCN
    {
        private ValorizacionDB objDato = new ValorizacionDB();

        public Tuple<string, string> registrarValorizacion(CMValorizacion cmValorizacion, string bandera)
        {
            var result  = objDato.regValorizacion(cmValorizacion, bandera);
            return result;
        }
    }
}
