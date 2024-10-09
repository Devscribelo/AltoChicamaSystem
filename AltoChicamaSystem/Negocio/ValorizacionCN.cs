using AltoChicamaSystem.Data.Guia;
using AltoChicamaSystem.Data.Valorizacion;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class ValorizacionCN
    {
        private ValorizacionDB objDato = new ValorizacionDB();

        public Tuple<string, string> registrarValorizacion(CMValorizacion CMValorizacion, string bandera)
        {
            return objDato.regValorizacion(CMValorizacion, bandera);
        }
    }
}
