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

        public Tuple<string, string, List<CMValorizacion>> listarValorizacion(string bandera)
        {
            return objDato.listarValorizacion(bandera);
        }
        public Tuple<string, string> eliminarValorizacion(int valorizacionId, string bandera)
        {
            return objDato.eliminarValorizacion(valorizacionId, bandera);
        }
        public Tuple<string, string, List<CMValorizacion>> listarValorizacionDetalle(int valorizacion_id, string bandera)
        {
            return objDato.listarValorizacionDetalle(valorizacion_id, bandera);
        }
        public Tuple<string, string, List<CMValorizacion>> listarValorizacionTransportista(int transportista_id, string bandera)
        {
            var result = objDato.listarValorizacionTransportista(transportista_id, bandera);
            return result;
        }
    }
}
