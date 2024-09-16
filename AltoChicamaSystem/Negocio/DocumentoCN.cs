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

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoEmpresa(int empresa_id, int estado, string bandera)
        {
            var result = objDato.listarDocumentoEmpresa(empresa_id, estado, bandera);
            return result;
        }


        public Tuple<string, string> eliminarDocumento(int documentoId, string bandera)
        {
            return objDato.eliminarDocumento(documentoId, bandera);
        }

        public Tuple<string, string> alterDocumentoStatus(int documento_id, string bandera)
        {
            var result = objDato.alterDocumentoStatus(documento_id, bandera);
            return result;
        }

        public Tuple<string, string> ObtenerMayorDocumentoID(string bandera)
        {
            try
            {
                // Llama al método en la carpeta Data que ejecuta el procedimiento almacenado
                int mayorDocumentoID = objDato.ObtenerMayorDocumentoID(bandera);

                // Devuelve el resultado como un Tuple
                return new Tuple<string, string>("Exito", mayorDocumentoID.ToString());
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return new Tuple<string, string>("Error", ex.Message);
            }
        }

        public Tuple<string, string> Documento_MaxNumero(string bandera)
        {
            try
            {
                // Llama al método en la carpeta Data que ejecuta el procedimiento almacenado
                int DocumentoNumero = objDato.Documento_MaxNumero(bandera);

                // Devuelve el resultado como un Tuple
                return new Tuple<string, string>("Exito", DocumentoNumero.ToString());
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return new Tuple<string, string>("Error", ex.Message);
            }
        }



    }
}
