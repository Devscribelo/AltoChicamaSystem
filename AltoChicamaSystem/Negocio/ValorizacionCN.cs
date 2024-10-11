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
        public Tuple<string, string, List<CMValorizacion>> ValorizacionSelect(int transportista_id, string bandera)
        {
            var result = objDato.ValorizacionSelect(transportista_id, bandera);
            return result;
        }
        public Tuple<string, string, List<CMValorizacion>> ValorizacionReturn(int valorizacion_id, string bandera)
        {
            var result = objDato.ValorizacionReturn(valorizacion_id, bandera);
            return result;
        }
    }
}
