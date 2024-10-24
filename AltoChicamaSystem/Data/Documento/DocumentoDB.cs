using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Data.Documento
{
    public class DocumentoDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regDocumento(CMDocumento cmDocumento, string bandera)
        {
            string rpta = "1";
            string msg = "Error al Registrar";
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand
                {
                    Connection = mySqlCon,
                    CommandText = "Documento_reg",
                    CommandType = CommandType.StoredProcedure
                };
                mySqlCmd.Parameters.AddWithValue("p_documento_pdf", cmDocumento.documento_pdf);
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", cmDocumento.empresa_id);
                mySqlCmd.Parameters.AddWithValue("p_documento_status", cmDocumento.documento_status);
                mySqlCmd.Parameters.AddWithValue("p_documento_numero", cmDocumento.documento_numero);
                mySqlCmd.Parameters.AddWithValue("p_guia_id", cmDocumento.guia_id);

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();
                if (sdr.Read())
                {
                    rpta = sdr["Rpta"].ToString();
                    msg = sdr["Msg"].ToString();
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg);
        }

        public CMDocumento ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            CMDocumento documento = null;
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand
                {
                    Connection = mySqlCon,
                    CommandText = "Documento_abrir",
                    CommandType = CommandType.StoredProcedure
                };
                mySqlCmd.Parameters.AddWithValue("p_DocumentoID", documentoId);

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();
                if (sdr.Read())
                {
                    documento = new CMDocumento
                    {
                        documento_id = Convert.ToInt32(sdr["documento_id"]),
                        documento_pdf = (byte[])sdr["documento_pdf"]
                    };
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return documento;
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumento(string bandera)
        {
            List<DocumentoResult> lst = new List<DocumentoResult>();
            DocumentoResult documento = new DocumentoResult();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            int count = 0;
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Documento_List";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                MySqlDataReader sdr = mySqlCmd.ExecuteReader();

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
                        documento = new DocumentoResult();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString().Trim();
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<DocumentoResult>();
                msg = ex.Message;
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string> eliminarDocumento(int documentoId, string bandera)
        {
            string rpta = "1";  // Valor por defecto en caso de error
            string msg = "Error al Eliminar";
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand
                {
                    Connection = mySqlCon,
                    CommandText = "Documento_delete",
                    CommandType = CommandType.StoredProcedure
                };
                mySqlCmd.Parameters.AddWithValue("p_documento_id", documentoId);

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();
                if (sdr.Read())
                {
                    rpta = sdr["Rpta"].ToString();
                    msg = sdr["Msg"].ToString();
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg);
        }

        public (decimal, string) ObtenerDeudaTransportista(int transportista_id, string bandera)
        {
            decimal deudaEmpresa = 0; // Valor por defecto en caso de error o no resultados
            string nombreTransportista = string.Empty;

            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Sumar_Deudas_Transportista", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;
                        mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                if (sdr["total_deuda"] != DBNull.Value)
                                {
                                    deudaEmpresa = Convert.ToDecimal(sdr["total_deuda"]);
                                }
                                if (sdr["transportista_nombre"] != DBNull.Value)
                                {
                                    nombreTransportista = sdr["transportista_nombre"].ToString();
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener la deuda: " + ex.Message);
                }
            }
            return (deudaEmpresa, nombreTransportista);
        }

        public decimal ObtenerDeudaTotalTransportistas(string bandera)
        {
            decimal totalDeuda = 0; // Valor por defecto en caso de error o no resultados

            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Sumar_Total_Deudas_Transportistas", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                if (sdr["total_deuda"] != DBNull.Value)
                                {
                                    totalDeuda = Convert.ToDecimal(sdr["total_deuda"]);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener la suma total de deudas: " + ex.Message);
                }
            }
            return totalDeuda;
        }

        public decimal ObtenerGananciaTotalTransportistas(string bandera)
        {
            decimal totalDeuda = 0; // Valor por defecto en caso de error o no resultados

            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Sumar_Total_Ganancias_Transportistas", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                if (sdr["total_deuda"] != DBNull.Value)
                                {
                                    totalDeuda = Convert.ToDecimal(sdr["total_deuda"]);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener la suma total de deudas: " + ex.Message);
                }
            }
            return totalDeuda;
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoEmpresa(int empresa_id, bool? estado, string bandera)
        {
            List<DocumentoResult> lst = new List<DocumentoResult>();
            DocumentoResult documento = new DocumentoResult();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            int count = 0;
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Documento_List_Empresa";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", empresa_id);
                mySqlCmd.Parameters.AddWithValue("p_estado", (object)estado ?? DBNull.Value);
                MySqlDataReader sdr = mySqlCmd.ExecuteReader();

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
                        documento = new DocumentoResult();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString().Trim();
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<DocumentoResult>();
                msg = ex.Message;
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoTransportista(int transportista_id, string bandera)
        {
            List<DocumentoResult> lst = new List<DocumentoResult>();
            DocumentoResult documento = new DocumentoResult();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            int count = 0;
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Documento_List_Transportista";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);
                MySqlDataReader sdr = mySqlCmd.ExecuteReader();

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
                        documento = new DocumentoResult();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString().Trim();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<DocumentoResult>();
                msg = ex.Message;
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public int ObtenerMayorDocumentoID(string bandera)
        {
            int mayorDocumentoID = 0; // Valor por defecto en caso de error o no resultados

            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("ObtenerMayorDocumentoID", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                if (sdr["UltimoDocumentoID"] != DBNull.Value)
                                {
                                    mayorDocumentoID = Convert.ToInt32(sdr["UltimoDocumentoID"]);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener el mayor documento ID: " + ex.Message);
                }
            }
            return mayorDocumentoID;
        }

        public int ObtenerNewNumCertificado(string bandera)
        {
            int numCertificado = 0;
            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("ObtenerMayorDocumentoNumero", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                if (sdr["documento_numero"] != DBNull.Value)
                                {
                                    numCertificado = Convert.ToInt32(sdr["documento_numero"]);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener el mayor documento ID: " + ex.Message);
                }
            }
            return numCertificado;
        }

        public int Documento_MaxNumero(string bandera)
        {
            int MaxDocumentoNumero = 0; // Valor por defecto en caso de error o no resultados

            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Documento_MaxNumero", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                if (sdr["MaxDocumentoNumero"] != DBNull.Value)
                                {
                                    MaxDocumentoNumero = Convert.ToInt32(sdr["MaxDocumentoNumero"]);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener el numero de documento: " + ex.Message);
                }
            }
            return MaxDocumentoNumero;
        }
    }
}