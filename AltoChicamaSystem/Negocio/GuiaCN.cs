using AltoChicamaSystem.Data.Guia;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class GuiaCN
    {
        private GuiaDB objDato = new GuiaDB();

        public Tuple<string, string> registrarGuia(CMGuia guia, string bandera)
        {
            return objDato.regGuia(guia, bandera);
        }

        public Tuple<string, string, List<GuiaSelect>> GuiaSelect(int transportista_id, string bandera)
        {
            var result = objDato.GuiaSelect(transportista_id, bandera);
            return result;
        }

        public Tuple<string, string, List<GuiaSelect>> GuiaSelectFiltrado(int transportista_id, string bandera)
        {
            var result = objDato.GuiaSelectFiltrado(transportista_id, bandera);
            return result;
        }

        public Tuple<string, string, List<CMGuia>> GuiaSelectValorizacion(int transportista_id, int guia_id, string bandera)
        {
            // Ajustar la llamada al acceso a datos para incluir el parámetro guia_id
            var result = objDato.GuiaSelectValorizacion(transportista_id, guia_id, bandera);
            return result;
        }

        public Tuple<string, string, List<CMGuia>> listarGuia(string bandera)
        {
            return objDato.listarGuia(bandera);
        }
        public Tuple<string, string, List<GuiaResult>> listarGuiaFiltro(int factura_id, string bandera)
        {
            return objDato.listarGuiaFiltro(factura_id, bandera);
        }
        public Tuple<string, string> eliminarGuia(int guiaId, string bandera)
        {
            return objDato.eliminarGuia(guiaId, bandera);
        }

        public Tuple<string, string, List<CMGuia>> listarGuiaTransportista(int transportista_id, bool? estado, string bandera)
        {
            return objDato.listarGuiaTransportista(transportista_id, estado, bandera);
        }
    }
}