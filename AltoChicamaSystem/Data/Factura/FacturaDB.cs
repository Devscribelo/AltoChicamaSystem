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


        public Tuple<string, string, decimal> listarGananciasTransportistas(string bandera)
        {
            string rpta = "0"; // Inicializar rpta en "0"
            string msg = "";
            decimal totalGanancias = 0;

            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Ganancias_Transportistas_Factura";
                sqlCmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                {
                    // Leer la primera fila para obtener Rpta y Msg
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

                    // Cambiar a la siguiente tabla de resultados
                    if (sdr.NextResult() && rpta == "0" && sdr.Read())
                    {
                        totalGanancias = Convert.ToDecimal(sdr["total_ganancias"]);
                    }
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                totalGanancias = 0;
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalGanancias);
        }



        public Tuple<string, string, decimal> listarDeudasTransportistas(string bandera)
        {
            string rpta = "0"; // Inicializar rpta en "0"
            string msg = "";
            decimal totalDeudas = 0;

            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Deudas_Transportistas_Factura";
                sqlCmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                {
                    // Leer la primera fila para obtener Rpta y Msg
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

                    // Cambiar a la siguiente tabla de resultados
                    if (sdr.NextResult() && rpta == "0" && sdr.Read())
                    {
                        totalDeudas = Convert.ToDecimal(sdr["total_deudas"]);
                    }
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                totalDeudas = 0;
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalDeudas);
        }

        public Tuple<string, string, decimal> listarGananciasTransportistasIndividual(int transportista_id, string bandera)
        {
            string rpta = "0"; // Inicializar rpta en "0"
            string msg = "";
            decimal totalGanancias = 0;

            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Ganancias_Transportistas_Factura_Individual";
                sqlCmd.CommandType = CommandType.StoredProcedure;

                // Añadir parámetro transportistaId
                sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);

                using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                {
                    // Leer la primera fila para obtener Rpta y Msg
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

                    // Cambiar a la siguiente tabla de resultados
                    if (sdr.NextResult() && rpta == "0" && sdr.Read())
                    {
                        totalGanancias = Convert.ToDecimal(sdr["total_ganancias"]);
                    }
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                totalGanancias = 0;
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalGanancias);
        }

        public Tuple<string, string, decimal> listarDeudasTransportistasIndividual(int transportista_id, string bandera)
        {
            string rpta = "0"; // Inicializar rpta en "0"
            string msg = "";
            decimal totalDeudas = 0;

            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Perdidas_Transportistas_Factura_Individual";
                sqlCmd.CommandType = CommandType.StoredProcedure;

                // Añadir parámetro transportistaId
                sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);

                using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                {
                    // Leer la primera fila para obtener Rpta y Msg
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

                    // Cambiar a la siguiente tabla de resultados
                    if (sdr.NextResult() && rpta == "0" && sdr.Read())
                    {
                        totalDeudas = Convert.ToDecimal(sdr["total_perdidas"]);
                    }
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                totalDeudas = 0;
            }
            finally
            {
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalDeudas);
        }

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
                sqlCmd.Parameters.AddWithValue("@transportista_id", cmFactura.transportista_id);
                sqlCmd.Parameters.AddWithValue("@guias_ids", cmFactura.guias_ids.Trim());
                sqlCmd.Parameters.AddWithValue("@factura_fecha_pago",cmFactura.factura_fecha_pago.Trim());

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
                                transportista_id = Convert.ToInt32(sdr["transportista_id"]),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                factura_fecha_pago = sdr["factura_fecha_pago"].ToString().Trim(),
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
                                transportista_id = Convert.ToInt32(sdr["transportista_id"]),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                factura_fecha_pago = sdr["factura_fecha_pago"].ToString().Trim(),
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
                sqlCmd.Parameters.AddWithValue("@factura_status", cmFactura.factura_status);
                sqlCmd.Parameters.AddWithValue("@transportista_id", cmFactura.transportista_id);

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