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
            string rpta = "1";
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
                sqlCmd.Parameters.AddWithValue("@documento_status", cmDocumento.documento_status);
                sqlCmd.Parameters.AddWithValue("@documento_numero", cmDocumento.documento_numero);
                sqlCmd.Parameters.AddWithValue("@guia_id", cmDocumento.guia_id);

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

        

        public (decimal, string) ObtenerDeudaTransportista(int transportista_id, string bandera)
        {
            decimal deudaEmpresa = 0; // Valor por defecto en caso de error o no resultados
            string nombreTransportista = string.Empty;

            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Sumar_Deudas_Transportista", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                // Lee el valor total_deuda y transportista_nombre
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
                    // Manejo de errores
                    Console.WriteLine("Error al obtener la deuda: " + ex.Message);
                }
            }
            return (deudaEmpresa, nombreTransportista);
        }


        public decimal ObtenerDeudaTotalTransportistas(string bandera)
        {
            decimal totalDeuda = 0; // Valor por defecto en caso de error o no resultados

            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Sumar_Total_Deudas_Transportistas", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                // Lee el total de deuda
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
                    // Manejo de errores
                    Console.WriteLine("Error al obtener la suma total de deudas: " + ex.Message);
                }
            }
            return totalDeuda;
        }

        public decimal ObtenerGananciaTotalTransportistas(string bandera)
        {
            decimal totalDeuda = 0; // Valor por defecto en caso de error o no resultados

            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Sumar_Total_Ganancias_Transportistas", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                // Lee el total de deuda
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
                    // Manejo de errores
                    Console.WriteLine("Error al obtener la suma total de deudas: " + ex.Message);
                }
            }
            return totalDeuda;
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoEmpresa(int empresa_id, bool? estado, string bandera)
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
                sqlCmd.Parameters.AddWithValue("@empresa_id", empresa_id);
                sqlCmd.Parameters.AddWithValue("@estado", (object)estado ?? DBNull.Value);
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoTransportista(int transportista_id, string bandera)
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
                sqlCmd.CommandText = "Documento_List_Transportista";
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public int ObtenerMayorDocumentoID(string bandera)
        {
            int mayorDocumentoID = 0; // Valor por defecto en caso de error o no resultados

            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("ObtenerMayorDocumentoID", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                // Lee el valor máximo del documento_id
                                if (sdr["MayorDocumentoID"] != DBNull.Value)
                                {
                                    mayorDocumentoID = Convert.ToInt32(sdr["MayorDocumentoID"]);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Manejo de errores: considera registrar el error para fines de depuración
                    Console.WriteLine("Error al obtener el mayor documento ID: " + ex.Message);
                }
            }
            return mayorDocumentoID;
        }

        public int ObtenerNewNumCertificado(string bandera)
        {
            int numCertificado = 0;
            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("ObtenerMayorDocumentoNumero", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
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
                    // Manejo de errores: considera registrar el error para fines de depuración
                    Console.WriteLine("Error al obtener el mayor documento ID: " + ex.Message);
                }
            }
            return numCertificado;
        }

        public int Documento_MaxNumero(string bandera)
        {
            int MaxDocumentoNumero = 0; // Valor por defecto en caso de error o no resultados

            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Documento_MaxNumero", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                // Lee el valor máximo del documento_id
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
                    // Manejo de errores: considera registrar el error para fines de depuración
                    Console.WriteLine("Error al obtener el numero de documento: " + ex.Message);
                }
            }
            return MaxDocumentoNumero;
        }





    }
}
