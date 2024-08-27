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
                sqlCmd.Parameters.AddWithValue("@empresa_id", cmTransportista.empresa_id);

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
        public Tuple<string, string, List<TransportistaResult>> listaTransportista(string bandera)
        {
            List<TransportistaResult> lst = new List<TransportistaResult>();
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
                            TransportistaResult transportista = new TransportistaResult
                            {
                                transportista_id = Convert.ToInt32(sdr["transportista_id"]),
                                transportista_ruc = sdr["transportista_ruc"].ToString().Trim(),
                                transportista_nombre = sdr["transportista_nombre"].ToString().Trim(),
                                empresa_name = sdr["empresa_name"].ToString().Trim(),
                            };
                            lst.Add(transportista);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<TransportistaResult>();
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

    }

    
}
