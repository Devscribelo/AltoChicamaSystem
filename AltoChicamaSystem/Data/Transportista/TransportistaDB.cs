using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;
using System;

namespace AltoChicamaSystem.Data.Transportista
{
    public class TransportistaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regTransportista(CMTransportista cmTransportista, string bandera)
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
                    CommandText = "Transportista_reg",
                    CommandType = CommandType.StoredProcedure
                };
                sqlCmd.Parameters.AddWithValue("@transportista_ruc", cmTransportista.transportista_ruc.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_nombre", cmTransportista.transportista_nombre.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_user", cmTransportista.transportista_user.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_password", cmTransportista.transportista_password.Trim());

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
        public Tuple<string, string> modTransportista(CMTransportista cmTransportista, string bandera)
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
                sqlCmd.CommandText = "Transportista_mod";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@transportista_id", cmTransportista.transportista_id);
                sqlCmd.Parameters.AddWithValue("@transportista_nombre", cmTransportista.transportista_nombre.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_ruc", cmTransportista.transportista_ruc.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_user", cmTransportista.transportista_user.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_password", cmTransportista.transportista_password.Trim());

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
        public Tuple<string, string, List<CMTransportista>> listaTransportista(string bandera)
        {
            List<CMTransportista> lst = new List<CMTransportista>();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Transportista_list";
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }
        public Tuple<string, string, List<CMTransportista>> TransportistaSelect(string bandera)
        {
            List<CMTransportista> lst = new List<CMTransportista>();
            CMTransportista transportistaselect = new CMTransportista();
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
                sqlCmd.CommandText = "Transportista_list";
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
                        transportistaselect = new CMTransportista();
                        transportistaselect.transportista_id = Convert.ToInt32(sdr["transportista_id"]);
                        transportistaselect.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        transportistaselect.transportista_ruc = sdr["transportista_ruc"].ToString().Trim();
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string> delTransportista(CMTransportista cmTransportista, string bandera, int transportista_id)
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
                sqlCmd.CommandText = "Transportista_delete"; // Nombre del procedimiento almacenado para eliminación
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id); // Aceptar int

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
                cmTransportista = new CMTransportista();
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
    }

    
}
