using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Data.Valorizacion
{
    public class ValorizacionDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string> regValorizacion(CMValorizacion cmValorizacion, string bandera)
        {
            string rpta = "";
            string msg = "";
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Valorizacion_regGuia";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_guia_ids", cmValorizacion.guia_ids);
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_costotn", cmValorizacion.valorizacion_costotn);
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_subtotal", cmValorizacion.valorizacion_subtotal);
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_igv", cmValorizacion.valorizacion_igv);
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_codigo", cmValorizacion.valorizacion_codigo.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", (cmValorizacion.transportista_id));

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
        public Tuple<string, string, List<CMValorizacion>> ValorizacionSelect(int transportista_id, string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            CMValorizacion valorizacion = new CMValorizacion();
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
                mySqlCmd.CommandText = "Valorizacion_list_select";
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
                        valorizacion = new CMValorizacion();
                        valorizacion.valorizacion_id = Convert.ToInt32(sdr["valorizacion_id"]);
                        valorizacion.valorizacion_codigo = sdr["valorizacion_codigo"].ToString().Trim();
                        lst.Add(valorizacion);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMValorizacion>();
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

        public Tuple<string, string, List<CMValorizacion>> ValorizacionReturn(int valorizacion_id, string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            CMValorizacion valorizacion = new CMValorizacion();
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
                mySqlCmd.CommandText = "Valorizacion_list_select_return";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_id", valorizacion_id);
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
                        valorizacion = new CMValorizacion();
                        valorizacion.valorizacion_monto = Convert.ToDecimal(sdr["valorizacion_monto"]);
                        valorizacion.valorizacion_guias = sdr["valorizacion_guias"].ToString().Trim();
                        valorizacion.valorizacion_numeros = sdr["valorizacion_numeros"].ToString().Trim();
                        lst.Add(valorizacion);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMValorizacion>();
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

        public Tuple<string, string, List<CMValorizacion>> listarValorizacion(string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Valorizacion_listGuia";
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
                            CMValorizacion valorizacion = new CMValorizacion
                            {
                                valorizacion_id = Convert.ToInt32(sdr["valorizacion_id"]),
                                valorizacion_codigo = sdr["valorizacion_codigo"].ToString().Trim(),
                                valorizacion_monto = Convert.ToDecimal(sdr["valorizacion_monto"]),
                                transportista_id = Convert.ToInt32(sdr["transportista_id"]),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                guia_id = Convert.ToInt32(sdr["guia_id"]),
                            };
                            lst.Add(valorizacion);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMValorizacion>();
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

        // Método para eliminar una valorización
        public Tuple<string, string> eliminarValorizacion(int valorizacion_id, string bandera)
        {
            string rpta = "";
            string msg = "";
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                // Conexión a la base de datos
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();

                // Crear el comando para ejecutar el procedimiento almacenado
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Valorizacion_delete";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                // Pasar el parámetro valorizacion_id
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_id", valorizacion_id);

                // Ejecutar el comando y leer el resultado
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

            // Devolver el resultado y mensaje de la operación
            return Tuple.Create(rpta, msg);
        }

        public Tuple<string, string, List<CMValorizacion>> listarValorizacionDetalle(int valorizacion_id, string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            CMValorizacion valorizacion = new CMValorizacion();
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
                mySqlCmd.CommandText = "Valorizacion_Detalle";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_valorizacion_id", valorizacion_id);
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
                        valorizacion = new CMValorizacion();
                        valorizacion.valorizacion_id = Convert.ToInt32(sdr["valorizacion_id"]);
                        valorizacion.guia_numero = sdr["guia_numero"].ToString().Trim();
                        valorizacion.guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim();
                        valorizacion.guia_descarga = sdr["guia_descarga"].ToString().Trim();
                        valorizacion.guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]);
                        valorizacion.guia_costo = Convert.ToDecimal(sdr["guia_costo"]);
                        valorizacion.valorizacion_total = Convert.ToDecimal(sdr["valorizacion_total"]);
                        valorizacion.transportista_ruc = sdr["transportista_ruc"].ToString().Trim();
                        valorizacion.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();

                        lst.Add(valorizacion);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMValorizacion>();
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
        public Tuple<string, string, List<CMValorizacion>> listarValorizacionTransportista(int transportista_id, string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Valorizacion_listGuiaPorTransportista";  // Asumiendo que este es el nombre del SP
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                // Añadir parámetros
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", Convert.ToInt32(transportista_id));

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
                            CMValorizacion valorizacion = new CMValorizacion
                            {
                                valorizacion_id = Convert.ToInt32(sdr["valorizacion_id"]),
                                valorizacion_codigo = sdr["valorizacion_codigo"].ToString().Trim(),
                                valorizacion_monto = Convert.ToDecimal(sdr["valorizacion_monto"]),
                                transportista_id = Convert.ToInt32(sdr["transportista_id"]),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                guia_id = Convert.ToInt32(sdr["guia_id"]),
                            };
                            lst.Add(valorizacion);
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
                lst = new List<CMValorizacion>();
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
            return Tuple.Create(rpta, msg, lst);
        }
    }
}