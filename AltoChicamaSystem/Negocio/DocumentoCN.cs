using AltoChicamaSystem.Data.Documento;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class DocumentoCN
    {
        private DocumentoDB objDato = new DocumentoDB();

        public Tuple<string, string> regDocumento(CMDocumento cmDocumento, string bandera)
        {
            return objDato.regDocumento(cmDocumento, bandera);
        }
    }
}
