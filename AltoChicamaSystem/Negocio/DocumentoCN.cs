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
        public CMDocumento ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            return objDato.ObtenerDocumentoPorId(documentoId, bandera);
        }
        public Tuple<string, string, List<DocumentoResult>> listarDocumento(string bandera)
        {
            var result = objDato.listarDocumento(bandera);
            return result;
        }
    }
}
