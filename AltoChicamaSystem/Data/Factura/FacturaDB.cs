using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Data.Factura
{
    public class FacturaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string, decimal> listarGananciasTransportistas(string bandera)
        {
            string rpta = "0";
            string msg = "";
            decimal totalGanancias = 0;

            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Ganancias_Transportistas_Factura";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                {
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalGanancias);
        }

        public Tuple<string, string, decimal> listarDeudasTransportistas(string bandera)
        {
            string rpta = "0";
            string msg = "";
            decimal totalDeudas = 0;

            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Deudas_Transportistas_Factura";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                {
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalDeudas);
        }

        public Tuple<string, string, decimal> listarGananciasTransportistasIndividual(int transportista_id, string bandera)
        {
            string rpta = "0";
            string msg = "";
            decimal totalGanancias = 0;

            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Ganancias_Transportistas_Factura_Individual";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);

                using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                {
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalGanancias);
        }

        public Tuple<string, string, decimal> listarDeudasTransportistasIndividual(int transportista_id, string bandera)
        {
            string rpta = "0";
            string msg = "";
            decimal totalDeudas = 0;

            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Perdidas_Transportistas_Factura_Individual";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);

                using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
                {
                    if (sdr.Read())
                    {
                        rpta = sdr["Rpta"].ToString();
                        msg = sdr["Msg"].ToString();
                    }

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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }

            return Tuple.Create(rpta, msg, totalDeudas);
        }

        public Tuple<string, string> regFactura(CMFactura cmFactura, string bandera)
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
                mySqlCmd.CommandText = "Factura_reg";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_factura_monto", cmFactura.factura_monto);
                mySqlCmd.Parameters.AddWithValue("p_num_factura", cmFactura.num_factura.Trim());
                mySqlCmd.Parameters.AddWithValue("p_factura_status", cmFactura.factura_status);
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", cmFactura.transportista_id);
                mySqlCmd.Parameters.AddWithValue("p_guias_ids", cmFactura.guias_ids.Trim());
                mySqlCmd.Parameters.AddWithValue("p_factura_fecha_pago", cmFactura.factura_fecha_pago.Trim());

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

        public Tuple<string, string, List<CMFactura>> listarFactura(string bandera)
        {
            List<CMFactura> lst = new List<CMFactura>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Factura_list";
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<CMFactura>> listarFacturaTransportista(int transportista_id, int estado, string bandera)
        {
            List<CMFactura> lst = new List<CMFactura>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Factura_List_Transportista";
                mySqlCmd.CommandType = CommandType.StoredProcedure;

                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);
                mySqlCmd.Parameters.AddWithValue("p_estado", estado);

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
                    else if (rpta == "1")
                    {
                        msg = "No hay datos para mostrar";
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string> modFactura(CMFactura cmFactura, string bandera)
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
                mySqlCmd.CommandText = "Factura_mod";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_id_factura", cmFactura.id_factura);
                mySqlCmd.Parameters.AddWithValue("p_factura_monto", cmFactura.factura_monto);
                mySqlCmd.Parameters.AddWithValue("p_num_factura", cmFactura.num_factura.Trim());
                mySqlCmd.Parameters.AddWithValue("p_factura_status", cmFactura.factura_status);
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", cmFactura.transportista_id);

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

        public Tuple<string, string> delFactura(int id_factura, string bandera)
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
                mySqlCmd.CommandText = "Factura_delete";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_id_factura", id_factura);

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

        public Tuple<string, string> alterFacturaStatus(int id_factura, string bandera)
        {
            string rpta = "";
            string msg = "";

            try
            {
                using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Factura_alter_status", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;
                        mySqlCmd.Parameters.AddWithValue("p_id_factura", id_factura);

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
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
                rpta = "1";
                msg = ex.Message;
            }

            return Tuple.Create(rpta, msg);
        }
    }
}