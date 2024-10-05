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

        public Tuple<string, string, List<GuiaSelect>> GuiaSelect(string bandera)
        {
            var result = objDato.GuiaSelect(bandera);
            return result;
        }

        public Tuple<string, string, List<GuiaResult>> listarGuiaFiltro(int factura_id, string bandera)
        {
            return objDato.listarGuiaFiltro(factura_id, bandera);
        }

    }
}