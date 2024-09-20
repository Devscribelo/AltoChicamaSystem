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
                sqlCmd.Parameters.AddWithValue("@fecha_servicio", cmDocumento.fecha_servicio);
                sqlCmd.Parameters.AddWithValue("@fecha_pago", cmDocumento.fecha_pago);
                sqlCmd.Parameters.AddWithValue("@documento_deuda", cmDocumento.documento_deuda);  // Agregado
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
                        documento.fecha_servicio = Convert.ToDateTime(sdr["fecha_servicio"]);  // Agregado
                        documento.fecha_pago = Convert.ToDateTime(sdr["fecha_pago"]);  // Agregado
                        documento.documento_deuda = Convert.ToDecimal(sdr["documento_deuda"]);  // Agregado
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

        public decimal ObtenerDeudaTransportista(int transportista_id, string bandera)
        {
            decimal deudaEmpresa = 0; // Valor por defecto en caso de error o no resultados

            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Sumar_Deudas_Empresa", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                // Lee el valor máximo del documento_id
                                if (sdr["total_deuda"] != DBNull.Value)
                                {
                                    deudaEmpresa = Convert.ToDecimal(sdr["total_deuda"]);
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
            return deudaEmpresa;
        }


        public Tuple<string, string, List<DocumentoResult>> listarDocumentoEmpresa(int empresa_id, int estado, string bandera)
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
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_matriculas = sdr["documento_matriculas"].ToString().Trim();
                        documento.fecha_servicio = Convert.ToDateTime(sdr["fecha_servicio"]);  // Agregado
                        documento.fecha_pago = Convert.ToDateTime(sdr["fecha_pago"]);  // Agregado
                        documento.documento_deuda = Convert.ToDecimal(sdr["documento_deuda"]);  // Agregado
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

        public Tuple<string, string, List<DocumentoResult>> listarDocumentoTransportista(int transportista_id, int estado, string bandera)
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
                sqlCmd.Parameters.AddWithValue("@transportista_id", Convert.ToInt32(transportista_id));
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
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_matriculas = sdr["documento_matriculas"].ToString().Trim();
                        documento.fecha_servicio = Convert.ToDateTime(sdr["fecha_servicio"]);  // Agregado
                        documento.fecha_pago = Convert.ToDateTime(sdr["fecha_pago"]);  // Agregado
                        documento.documento_deuda = Convert.ToDecimal(sdr["documento_deuda"]);  // Agregado
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
