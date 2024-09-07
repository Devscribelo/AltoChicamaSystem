using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;
using System;

namespace AltoChicamaSystem.Data.Documento
{
    public class DocumentoDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regDocumento(CMDocumento cmDocumento, string bandera)
        {
            string rpta = "1";  // Valor por defecto en caso de error
            string msg = "Error al Registrar";
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand
                {
                    Connection = sqlCon,
                    CommandText = "Documento_reg",
                    CommandType = CommandType.StoredProcedure
                };
                sqlCmd.Parameters.AddWithValue("@documento_titulo", cmDocumento.documento_titulo.Trim());
                sqlCmd.Parameters.AddWithValue("@documento_pdf", cmDocumento.documento_pdf);
                sqlCmd.Parameters.AddWithValue("@empresa_id", cmDocumento.empresa_id);
                sqlCmd.Parameters.AddWithValue("@transportista_id", cmDocumento.transportista_id);
                sqlCmd.Parameters.AddWithValue("@documento_matriculas", cmDocumento.documento_matriculas.Trim());
                //sqlCmd.Parameters.AddWithValue("@documento_status", cmDocumento.documento_status);

                SqlDataReader sdr = sqlCmd.ExecuteReader();
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg);
        }

        public CMDocumento ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            CMDocumento documento = null;
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
                    documento = new CMDocumento
                    {
                        documento_id = Convert.ToInt32(sdr["documento_id"]),
                        documento_titulo = sdr["documento_titulo"].ToString(),
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return documento;
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumento(string bandera)
        {
            List<DocumentoResult> lst = new List<DocumentoResult>();
            DocumentoResult documento = new DocumentoResult();
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
                sqlCmd.CommandText = "Documento_List";
                sqlCmd.CommandType = CommandType.StoredProcedure;
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
                        documento = new DocumentoResult();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString().Trim();
                        documento.documento_matriculas = sdr["documento_matriculas"].ToString().Trim();
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string> eliminarDocumento(int documentoId, string bandera)
        {
            string rpta = "1";  // Valor por defecto en caso de error
            string msg = "Error al Eliminar";
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand
                {
                    Connection = sqlCon,
                    CommandText = "Documento_delate",
                    CommandType = CommandType.StoredProcedure
                };
                sqlCmd.Parameters.AddWithValue("@documento_id", documentoId);

                SqlDataReader sdr = sqlCmd.ExecuteReader();
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg);
        }

        public Tuple<string, string> alterDocumentoStatus(int documento_id, string bandera)
        {
            string rpta = "";
            string msg = "";

            try
            {
                using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Documento_alter_status", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("@documento_id", documento_id);

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                rpta = sdr["Rpta"].ToString();
                                msg = sdr["Msg"].ToString();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                rpta = "1"; // Indicar que hubo un error
                msg = ex.Message;
            }

            return Tuple.Create(rpta, msg);
        }

 
        public Tuple<string, string, List<DocumentoResult>> listarDocumentoEmpresa(int empresa_id, int estado , string bandera)
        {
            List<DocumentoResult> lst = new List<DocumentoResult>();
            DocumentoResult documento = new DocumentoResult();
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
                sqlCmd.CommandText = "Documento_List_Empresa";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@empresa_id", Convert.ToInt32(empresa_id));
                sqlCmd.Parameters.AddWithValue("@estado", Convert.ToInt32(estado));
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
                        documento = new DocumentoResult();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString().Trim();
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }



    }
}
