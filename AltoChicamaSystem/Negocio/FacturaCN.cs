using AltoChicamaSystem.Data.Factura;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class FacturaCN
    {
        private FacturaDB objDato = new FacturaDB();

        public Tuple<string, string> regFactura(CMFactura cmFactura, string bandera)
        {
            return objDato.regFactura(cmFactura, bandera);
        }

        public Tuple<string, string, List<CMFactura>> listarFactura(string bandera)
        {
            var result = objDato.listarFactura(bandera);
            return result;
        }

        public Tuple<string, string> modFactura(CMFactura cmFactura, string bandera)
        {
            return objDato.modFactura(cmFactura, bandera);
        }

        public Tuple<string, string> delFactura(int id_factura, string bandera)
        {
            return objDato.delFactura(id_factura, bandera);
        }
    }
}