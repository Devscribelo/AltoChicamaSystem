using AltoChicamaSystem.Data.Documento;
using AltoChicamaSystem.Models;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Negocio
{
    public class DocumentoClienteCN
    {
        private DocumentoClienteDB objDato = new DocumentoClienteDB();

        public CMDocumentoCliente ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            return objDato.ObtenerDocumentoPorId(documentoId, bandera);
        }

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltrado(int empresa_id, string bandera)
        {
            return objDato.listarDocumentoFiltrado(empresa_id, bandera);
        }

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltradoTransportista(int transportista_id, string bandera)
        {
            return objDato.listarDocumentoFiltradoTransportista(transportista_id, bandera);
        }
    }
}