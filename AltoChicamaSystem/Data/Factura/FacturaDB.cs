using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;
using System;

namespace AltoChicamaSystem.Data.Factura
{
    public class FacturaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regFactura(CMFactura cmFactura, string bandera)
        {
            string rpta = "";
            string msg = "";
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Factura_reg";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@factura_monto", cmFactura.factura_monto);
                sqlCmd.Parameters.AddWithValue("@num_factura", cmFactura.num_factura.Trim());
                sqlCmd.Parameters.AddWithValue("@factura_status", cmFactura.factura_status);

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

        public Tuple<string, string, List<CMFactura>> listarFactura(string bandera)
        {
            List<CMFactura> lst = new List<CMFactura>();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Factura_list";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                {
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                        sdr.NextResult();
                    }

                    if (rpta == "0")
                    {
                        while (sdr.Read())
                        {
                            CMFactura factura = new CMFactura
                            {
                                id_factura = Convert.ToInt32(sdr["id_factura"]),
                                factura_monto = Convert.ToDecimal(sdr["factura_monto"]),
                                num_factura = sdr["num_factura"].ToString().Trim(),
                                factura_status = sdr["factura_status"].ToString().Trim(),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                            };
                            lst.Add(factura);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMFactura>();
                rpta = "1";
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

        public Tuple<string, string, List<CMFactura>> listarFacturaTransportista(int transportista_id, int estado, string bandera)
        {
            List<CMFactura> lst = new List<CMFactura>();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Factura_List_Transportista";  // Asumiendo que este es el nombre del SP
                sqlCmd.CommandType = CommandType.StoredProcedure;

                // Añadir parámetros
                sqlCmd.Parameters.AddWithValue("@transportista_id", Convert.ToInt32(transportista_id));
                sqlCmd.Parameters.AddWithValue("@estado", Convert.ToInt32(estado));

                using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                {
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                        sdr.NextResult();
                    }

                    if (rpta == "0")
                    {
                        while (sdr.Read())
                        {
                            CMFactura factura = new CMFactura
                            {
                                id_factura = Convert.ToInt32(sdr["id_factura"]),
                                factura_monto = Convert.ToDecimal(sdr["factura_monto"]),
                                num_factura = sdr["num_factura"].ToString().Trim(),
                                factura_status = sdr["factura_status"].ToString().Trim(),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                            };
                            lst.Add(factura);
                        }
                    }
                    else if (rpta == "1") // Si no hay datos
                    {
                        msg = "No hay datos para mostrar"; // Mensaje personalizado
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMFactura>();
                rpta = "1";
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


        public Tuple<string, string> modFactura(CMFactura cmFactura, string bandera)
        {
            string rpta = "";
            string msg = "";
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Factura_mod";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@id_factura", cmFactura.id_factura);
                sqlCmd.Parameters.AddWithValue("@factura_monto", cmFactura.factura_monto);
                sqlCmd.Parameters.AddWithValue("@num_factura", cmFactura.num_factura.Trim());

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

        public Tuple<string, string> delFactura(int id_factura, string bandera)
        {
            string rpta = "";
            string msg = "";
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Factura_delete";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@id_factura", id_factura);

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

        public Tuple<string, string> alterFacturaStatus(int id_factura, string bandera)
        {
            string rpta = "";
            string msg = "";

            try
            {
                using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Factura_alter_status", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("@id_factura", id_factura);

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
    }
}