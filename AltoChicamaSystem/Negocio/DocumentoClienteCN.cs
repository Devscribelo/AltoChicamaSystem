using AltoChicamaSystem.Data.Documento;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class DocumentoClienteCN
    {
        private DocumentoClienteDB objDato = new DocumentoClienteDB();
        public CMDocumento ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            return objDato.ObtenerDocumentoPorId(documentoId, bandera);
        }

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltrado(int empresa_id, string bandera)
        {
            var result = objDato.listarDocumentoFiltrado(empresa_id, bandera);
            return result;
        }

    }
}

