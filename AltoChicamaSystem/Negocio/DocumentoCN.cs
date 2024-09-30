using AltoChicamaSystem.Data.Documento;
using AltoChicamaSystem.Models;
using System;
using System.Collections.Generic;

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
            return objDato.listarDocumento(bandera);
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoEmpresa(int empresa_id, bool? estado, string bandera)
        {
            return objDato.listarDocumentoEmpresa(empresa_id, estado, bandera);
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoTransportista(int transportista_id, string bandera)
        {
            return objDato.listarDocumentoTransportista(transportista_id, bandera);
        }

        public Tuple<string, string> eliminarDocumento(int documentoId, string bandera)
        {
            return objDato.eliminarDocumento(documentoId, bandera);
        }

        public Tuple<string, string, string> ObtenerDeudaTransportista(int transportista_id, string bandera)
        {
            try
            {
                var (deuda, nombre) = objDato.ObtenerDeudaTransportista(transportista_id, bandera);
                return new Tuple<string, string, string>("Exito", deuda.ToString(), nombre);
            }
            catch (Exception ex)
            {
                return new Tuple<string, string, string>("Error", ex.Message, string.Empty);
            }
        }

        public Tuple<string, string> ObtenerDeudaTotalTransportistas(string bandera)
        {
            try
            {
                decimal totalDeuda = objDato.ObtenerDeudaTotalTransportistas(bandera);
                return new Tuple<string, string>("Exito", totalDeuda.ToString());
            }
            catch (Exception ex)
            {
                return new Tuple<string, string>("Error", ex.Message);
            }
        }

        public Tuple<string, string> ObtenerGananciaTotalTransportistas(string bandera)
        {
            try
            {
                decimal totalGanancia = objDato.ObtenerGananciaTotalTransportistas(bandera);
                return new Tuple<string, string>("Exito", totalGanancia.ToString());
            }
            catch (Exception ex)
            {
                return new Tuple<string, string>("Error", ex.Message);
            }
        }

        public Tuple<string, string> ObtenerMayorDocumentoID(string bandera)
        {
            try
            {
                int mayorDocumentoID = objDato.ObtenerMayorDocumentoID(bandera);
                return new Tuple<string, string>("Exito", mayorDocumentoID.ToString());
            }
            catch (Exception ex)
            {
                return new Tuple<string, string>("Error", ex.Message);
            }
        }

        public Tuple<string, string> Documento_MaxNumero(string bandera)
        {
            try
            {
                int DocumentoNumero = objDato.Documento_MaxNumero(bandera);
                return new Tuple<string, string>("Exito", DocumentoNumero.ToString());
            }
            catch (Exception ex)
            {
                return new Tuple<string, string>("Error", ex.Message);
            }
        }
    }
}