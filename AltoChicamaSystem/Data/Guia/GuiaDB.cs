using AltoChicamaSystem.Models;
using System.Data;
using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data.Guia
{
    public class GuiaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regGuia(CMGuia guia, string bandera)
        {
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";

            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Guia_reg";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                mySqlCmd.Parameters.AddWithValue("p_guia_numero", guia.guia_numero);
                mySqlCmd.Parameters.AddWithValue("p_guia_descarga", guia.guia_descarga);
                mySqlCmd.Parameters.AddWithValue("p_guia_cantidad", guia.guia_cantidad);
                mySqlCmd.Parameters.AddWithValue("p_guia_unidad", guia.guia_unidad);
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", guia.transportista_id);
                mySqlCmd.Parameters.AddWithValue("p_guia_fecha_servicio", guia.guia_fecha_servicio);
                mySqlCmd.Parameters.AddWithValue("p_guia_costo", guia.guia_costo);
                mySqlCmd.Parameters.AddWithValue("p_guia_direccion", guia.guia_direccion);
                mySqlCmd.Parameters.AddWithValue("p_documento_pdf", guia.documento_pdf);
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", guia.empresa_id);
                mySqlCmd.Parameters.AddWithValue("p_documento_numero", guia.documento_numero);

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();

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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg);
        }

        public Tuple<string, string, List<GuiaSelect>> GuiaSelect(int transportista_id, string bandera)
        {
            List<GuiaSelect> lst = new List<GuiaSelect>();
            GuiaSelect guiaselect = new GuiaSelect();
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
                mySqlCmd.CommandText = "Guia_list_select";
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<GuiaSelect>> GuiaSelectFiltrado(int transportista_id, string bandera)
        {
            List<GuiaSelect> lst = new List<GuiaSelect>();
            GuiaSelect guiaselect = new GuiaSelect();
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
                mySqlCmd.CommandText = "Guia_list_select_filtrado";
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<CMGuia>> GuiaSelectValorizacion(int transportista_id, int guia_id, string bandera)
        {
            List<CMGuia> lst = new List<CMGuia>();
            CMGuia guiaselect = new CMGuia();
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
                mySqlCmd.CommandText = "Guia_list_select_Valorizacion";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);
                mySqlCmd.Parameters.AddWithValue("p_guia_id", guia_id);

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
                        guiaselect = new CMGuia();
                        guiaselect.guia_id = Convert.ToInt32(sdr["guia_id"]);
                        guiaselect.guia_numero = sdr["guia_numero"].ToString().Trim();
                        guiaselect.guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim();
                        guiaselect.guia_descarga = sdr["guia_descarga"].ToString().Trim();
                        guiaselect.guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]);
                        lst.Add(guiaselect);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMGuia>();
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

        public Tuple<string, string, List<CMGuia>> listarGuia(string bandera)
        {
            List<CMGuia> lst = new List<CMGuia>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Guia_list";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string> eliminarGuia(int guiaId, string bandera)
        {
            string rpta = "1";
            string msg = "Error al Eliminar";
            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                try
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Guia_delete", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;
                        mySqlCmd.Parameters.AddWithValue("p_guia_id", guiaId);

                        Console.WriteLine($"Ejecutando Guia_delete con guia_id={guiaId}");

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                rpta = sdr["Rpta"].ToString();
                                msg = sdr["Msg"].ToString();
                                Console.WriteLine($"Resultado de Guia_delete: Rpta={rpta}, Msg={msg}");
                            }
                            else
                            {
                                Console.WriteLine("No se leyó ningún resultado de Guia_delete");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    rpta = "1";
                    msg = $"Error al eliminar guía: {ex.Message}";
                    Console.WriteLine(msg);
                }
            }
            return Tuple.Create(rpta, msg);
        }

        public Tuple<string, string, List<CMGuia>> listarGuiaTransportista(int transportista_id, bool? estado, string bandera)
        {
            List<CMGuia> lst = new List<CMGuia>();
            string rpta = "1";
            string msg = "No se encontraron guías";
            int count = 0;
            using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
            {
                mySqlCon.Open();
                using (MySqlCommand mySqlCmd = new MySqlCommand("Guia_List_Transportista", mySqlCon))
                {
                    mySqlCmd.CommandType = CommandType.StoredProcedure;
                    mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);
                    mySqlCmd.Parameters.AddWithValue("p_status", (object)estado ?? DBNull.Value);
                    MySqlDataReader sdr = mySqlCmd.ExecuteReader();

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
                            guia_status = sdr["guia_status"].ToString().Trim(),
                            documento_id = Convert.ToInt32(sdr["documento_id"]),
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
                mySqlCmd.CommandText = "Factura_Detalle_Guias";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_id_factura", id_factura);
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }
    }
}