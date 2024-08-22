using AltoChicamaSystem.Data.Empresa;
using AltoChicamaSystem.Models;
namespace AltoChicamaSystem.Negocio
{
    public class EmpresaCN
    {
        private EmpresaDB objDato = new EmpresaDB();
        public Tuple<string, string> regEmpresa(CMEmpresa cmEmpresa, string bandera)
        {
            var result = objDato.regEmpresa(cmEmpresa, bandera);
            return result;
        }
        public Tuple<string, string, List<CMEmpresa>> listarEmpresa(string bandera)
        {
            var result = objDato.listarEmpresa(bandera);
            return result;
        }

        public Tuple<string, string, List<CMEmpresa>> EmpresaSelect(string bandera)
        {
            var result = objDato.EmpresaSelect(bandera);
            return result;
        }

        public Tuple<string, string> modEmpresa(CMEmpresa cmEmpresa, string bandera)
        {
            var result = objDato.modEmpresa(cmEmpresa, bandera);
            return result;
        }
    }
}
