using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Data.Transportista
{
    public class TransportistaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regTransportista(CMTransportista cmTransportista, string bandera)
        {
            string rpta = "1";  // Valor por defecto en caso de error
            string msg = "Error al Registrar";
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand
                {
                    Connection = mySqlCon,
                    CommandText = "Transportista_reg",
                    CommandType = CommandType.StoredProcedure
                };
                mySqlCmd.Parameters.AddWithValue("p_transportista_ruc", cmTransportista.transportista_ruc.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_nombre", cmTransportista.transportista_nombre.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_user", cmTransportista.transportista_user.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_password", cmTransportista.transportista_password.Trim());

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

        public Tuple<string, string> modTransportista(CMTransportista cmTransportista, string bandera)
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
                mySqlCmd.CommandText = "Transportista_mod";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", cmTransportista.transportista_id);
                mySqlCmd.Parameters.AddWithValue("p_transportista_nombre", cmTransportista.transportista_nombre.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_ruc", cmTransportista.transportista_ruc.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_user", cmTransportista.transportista_user.Trim());
                mySqlCmd.Parameters.AddWithValue("p_transportista_password", cmTransportista.transportista_password.Trim());

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

        public Tuple<string, string, List<CMTransportista>> listaTransportista(string bandera)
        {
            List<CMTransportista> lst = new List<CMTransportista>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Transportista_list";
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
                            CMTransportista transportista = new CMTransportista
                            {
                                transportista_id = Convert.ToInt32(sdr["transportista_id"]),
                                transportista_ruc = sdr["transportista_ruc"].ToString().Trim(),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                transportista_user = sdr["transportista_user"].ToString().Trim(),
                                transportista_password = sdr["transportista_password"].ToString().Trim()
                            };
                            lst.Add(transportista);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMTransportista>();
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

        public Tuple<string, string, List<CMTransportista>> TransportistaSelect(string bandera)
        {
            List<CMTransportista> lst = new List<CMTransportista>();
            CMTransportista transportistaselect = new CMTransportista();
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
                mySqlCmd.CommandText = "Transportista_list";
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
                        transportistaselect = new CMTransportista();
                        transportistaselect.transportista_id = Convert.ToInt32(sdr["transportista_id"]);
                        transportistaselect.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        transportistaselect.transportista_ruc = sdr["transportista_ruc"].ToString().Trim();
                        transportistaselect.transportista_user = sdr["transportista_user"].ToString().Trim();
                        transportistaselect.transportista_password = sdr["transportista_password"].ToString().Trim();
                        lst.Add(transportistaselect);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMTransportista>();
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

        public Tuple<string, string> delTransportista(CMTransportista cmTransportista, string bandera, int transportista_id)
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
                mySqlCmd.CommandText = "Transportista_delete"; // Nombre del procedimiento almacenado para eliminación
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id); // Aceptar int

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
                cmTransportista = new CMTransportista();
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

        public Tuple<string, string, List<TransportistaVista>> TransportistaVista(int transportista_id, string bandera)
        {
            List<TransportistaVista> lst = new List<TransportistaVista>();
            TransportistaVista transportistaselect = new TransportistaVista();
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
                mySqlCmd.CommandText = "Guia_Vista_Transportista";
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
                        transportistaselect = new TransportistaVista();
                        transportistaselect.guia_id = Convert.ToInt32(sdr["guia_id"]);
                        transportistaselect.guia_numero = sdr["guia_numero"].ToString().Trim();
                        transportistaselect.empresa_name = sdr["empresa_name"].ToString().Trim();
                        transportistaselect.empresa_ruc = sdr["empresa_ruc"].ToString().Trim();
                        transportistaselect.guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim();
                        transportistaselect.guia_direccion = sdr["guia_direccion"].ToString().Trim();
                        transportistaselect.guia_costo = Convert.ToDecimal(sdr["guia_costo"]);
                        transportistaselect.guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]);
                        transportistaselect.guia_unidad = sdr["guia_unidad"].ToString().Trim();
                        transportistaselect.guia_descarga = sdr["guia_descarga"].ToString().Trim();
                        transportistaselect.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        lst.Add(transportistaselect);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<TransportistaVista>();
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