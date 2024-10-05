using AltoChicamaSystem.Models;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Guia
{
    public class GuiaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regGuia(CMGuia guia, string bandera)
        {
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";

            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Guia_reg";
                sqlCmd.CommandType = CommandType.StoredProcedure;

                sqlCmd.Parameters.AddWithValue("@guia_numero", guia.guia_numero);
                sqlCmd.Parameters.AddWithValue("@guia_descarga", guia.guia_descarga);
                sqlCmd.Parameters.AddWithValue("@guia_cantidad", guia.guia_cantidad);
                sqlCmd.Parameters.AddWithValue("@guia_unidad", guia.guia_unidad);
                sqlCmd.Parameters.AddWithValue("@transportista_id", guia.transportista_id);
                sqlCmd.Parameters.AddWithValue("@guia_fecha_servicio", guia.guia_fecha_servicio);
                sqlCmd.Parameters.AddWithValue("@guia_costo", guia.guia_costo);
                sqlCmd.Parameters.AddWithValue("@guia_direccion", guia.guia_direccion);

                SqlDataReader sdr = sqlCmd.ExecuteReader();

                if (sdr.Read())
                {
                    rpta = sdr["Rpta"].ToString();
                    msg = sdr["Msg"].ToString();
                }
            }
            catch (Exception ex)
            {
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

            return Tuple.Create(rpta, msg);
        }

        public Tuple<string, string, List<GuiaSelect>> GuiaSelect(string bandera)
        {
            List<GuiaSelect> lst = new List<GuiaSelect>();
            GuiaSelect guiaselect = new GuiaSelect();
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
                sqlCmd.CommandText = "Guia_list_select";
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
                        guiaselect = new GuiaSelect();
                        guiaselect.guia_id = Convert.ToInt32(sdr["guia_id"]);
                        guiaselect.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(guiaselect);
                    }

                }
            }
            catch (Exception ex)
            {
                lst = new List<GuiaSelect>();
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
        public Tuple<string, string, List<CMGuia>> listarGuia(string bandera)
        {
            List<CMGuia> lst = new List<CMGuia>();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Guia_list";
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
                            CMGuia guia = new CMGuia
                            {
                                guia_id = Convert.ToInt32(sdr["guia_id"]),
                                empresa_name = sdr["empresa_name"].ToString().Trim(),
                                guia_direccion = sdr["guia_direccion"].ToString().Trim(),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                empresa_ruc = sdr["empresa_ruc"].ToString().Trim(),
                                guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim(),
                                guia_costo = Convert.ToDecimal(sdr["guia_costo"]),
                                guia_numero = sdr["guia_numero"].ToString().Trim(),
                                guia_descarga = sdr["guia_descarga"].ToString().Trim(),
                                guia_unidad = sdr["guia_unidad"].ToString().Trim(),
                                guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]),
                                guia_status = sdr["guia_status"].ToString().Trim(),
                                documento_id = Convert.ToInt32(sdr["documento_id"]),
                            };
                            lst.Add(guia);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMGuia>();
                rpta = ex.Message;
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

        public Tuple<string, string> eliminarGuia(int guiaId, string bandera)
        {
            string rpta = "1";
            string msg = "Error al Eliminar";
            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Guia_delete", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("@guia_id", guiaId);

                        // Registrar los parámetros para depuración
                        Console.WriteLine($"Ejecutando Guia_delate con guia_id={guiaId}");

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                rpta = sdr["Rpta"].ToString();
                                msg = sdr["Msg"].ToString();
                                // Registrar el resultado para depuración
                                Console.WriteLine($"Resultado de Guia_delate: Rpta={rpta}, Msg={msg}");
                            }
                            else
                            {
                                // Registrar si no se leyó ningún resultado
                                Console.WriteLine("No se leyó ningún resultado de Guia_delate");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    rpta = "1";
                    msg = $"Error al eliminar guía: {ex.Message}";
                    // Registrar la excepción para depuración
                    Console.WriteLine(msg);
                }
            }
            return Tuple.Create(rpta, msg);
        }

        public Tuple<string, string, List<CMGuia>> listarGuiaTransportista(int transportista_id, bool? estado, string bandera)
        {
            List<CMGuia> lst = new List<CMGuia>();
            string rpta = "1";  // Cambiado de "" a "1" para indicar error por defecto
            string msg = "No se encontraron guías";  // Mensaje por defecto
            int count = 0;
            using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
            {
                sqlCon.Open();
                using (SqlCommand sqlCmd = new SqlCommand("Guia_List_Transportista", sqlCon))
                {
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);
                    sqlCmd.Parameters.AddWithValue("@status", (object)estado ?? DBNull.Value);
                    SqlDataReader sdr = sqlCmd.ExecuteReader();

                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                        sdr.NextResult();
                    }

                    while (sdr.Read())
                    {
                        CMGuia guia = new CMGuia
                        {
                            guia_id = Convert.ToInt32(sdr["guia_id"]),
                            empresa_name = sdr["empresa_name"].ToString().Trim(),
                            guia_direccion = sdr["guia_direccion"].ToString().Trim(),
                            transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                            empresa_ruc = sdr["empresa_ruc"].ToString().Trim(),
                            guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim(),
                            guia_costo = Convert.ToDecimal(sdr["guia_costo"]),
                            guia_numero = sdr["guia_numero"].ToString().Trim(),
                            guia_descarga = sdr["guia_descarga"].ToString().Trim(),
                            guia_unidad = sdr["guia_unidad"].ToString().Trim(),
                            guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]),
                            guia_status = estado.HasValue ? (estado.Value ? "1" : "0") : null
                        };
                        lst.Add(guia);
                        count++;
                    }
                }
            }

            if (count == 0 && rpta == "0")
            {
                msg = "NO HAY GUÍAS CON EL ESTADO ESPECIFICADO PARA ESTE TRANSPORTISTA";
            }

            return Tuple.Create(rpta, msg, lst);
        }


        public Tuple<string, string, List<GuiaResult>> listarGuiaFiltro(int id_factura, string bandera)
        {
            List<GuiaResult> lst = new List<GuiaResult>();
            GuiaResult guia = new GuiaResult();
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
                sqlCmd.CommandText = "Factura_Detalle_Guias";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@id_factura", id_factura);
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
                        guia = new GuiaResult();
                        guia.guia_id = Convert.ToInt32(sdr["guia_id"]);
                        guia.guia_numero = sdr["guia_numero"].ToString().Trim();
                        guia.guia_descarga = sdr["guia_descarga"].ToString().Trim();
                        guia.guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]);
                        guia.guia_unidad = sdr["guia_unidad"].ToString().Trim();
                        guia.guia_costo = Convert.ToDecimal(sdr["guia_costo"]);
                        guia.guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim();
                        guia.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        
                        lst.Add(guia);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<GuiaResult>();
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
