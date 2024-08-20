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
    }
}
