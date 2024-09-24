using AltoChicamaSystem.Data.Empresa;
using AltoChicamaSystem.Models;
namespace AltoChicamaSystem.Negocio
{
    public class DireccionCN
    {
        private DireccionDB objDato = new DireccionDB();
        public Tuple<string, string> regDireccion(Direccion cmEmpresa, string bandera)
        {
            var result = objDato.regDireccion(cmEmpresa, bandera);
            return result;
        }

        public Tuple<string, string, List<Direccion>> DireccionSelect(int empresa_id, string bandera)
        {
            var result = objDato.DireccionSelect(empresa_id, bandera);
            return result;
        }

    }
}
