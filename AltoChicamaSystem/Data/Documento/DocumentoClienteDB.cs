﻿using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Documento
{
    public class DocumentoClienteDB
    {
        private ConexionDB con = new ConexionDB();

        public CMDocumentoCliente ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            CMDocumentoCliente documento = null;
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand
                {
                    Connection = sqlCon,
                    CommandText = "Documento_abrir",
                    CommandType = CommandType.StoredProcedure
                };
                sqlCmd.Parameters.AddWithValue("@DocumentoID", documentoId);

                SqlDataReader sdr = sqlCmd.ExecuteReader();
                if (sdr.Read())
                {
                    documento = new CMDocumentoCliente
                    {
                        documento_id = Convert.ToInt32(sdr["documento_id"]),
                        documento_titulo = sdr["documento_titulo"].ToString(),
                        documento_pdf = (byte[])sdr["documento_pdf"],
                        empresa_id = Convert.ToInt32(sdr["empresa_id"]),
                        documento_status = sdr["documento_status"].ToString(),
                        documento_numero = Convert.ToInt32(sdr["documento_numero"]),
                        guia_id = Convert.ToInt32(sdr["guia_id"])
                    };
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return documento;
        }

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltrado(int empresa_id, string bandera)
        {
            List<CMDocumentoResultCliente> lst = new List<CMDocumentoResultCliente>();
            CMDocumentoResultCliente documento = new CMDocumentoResultCliente();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            int count = 0;

            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Documento_List_Empresa_Filtro";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@empresa_id", empresa_id);
                SqlDataReader sdr = sqlCmd.ExecuteReader();

                while (sdr.Read())
                {
                    count++;
                    if (count == 1)
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                        sdr.NextResult();
                    }
                    if (rpta == "0" && count >= 2)
                    {
                        documento = new CMDocumentoResultCliente();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMDocumentoResultCliente>();
                msg = ex.Message;
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltradoTransportista(int transportista_id, string bandera)
        {
            List<CMDocumentoResultCliente> lst = new List<CMDocumentoResultCliente>();
            CMDocumentoResultCliente documento = new CMDocumentoResultCliente();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            int count = 0;

            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Documento_List_Transportista_Filtro";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);
                SqlDataReader sdr = sqlCmd.ExecuteReader();

                while (sdr.Read())
                {
                    count++;
                    if (count == 1)
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                        sdr.NextResult();
                    }
                    if (rpta == "0" && count >= 2)
                    {
                        documento = new CMDocumentoResultCliente();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMDocumentoResultCliente>();
                msg = ex.Message;
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }
    }
}