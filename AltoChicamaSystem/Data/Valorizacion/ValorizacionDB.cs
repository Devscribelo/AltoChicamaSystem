using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;
using System;

namespace AltoChicamaSystem.Data.Valorizacion
{
    public class ValorizacionDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string> regValorizacion(CMValorizacion cmValorizacion, string bandera)
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
                sqlCmd.CommandText = "Valorizacion_regGuia";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@guia_ids", cmValorizacion.guia_ids);
                sqlCmd.Parameters.AddWithValue("@valorizacion_costotn", cmValorizacion.valorizacion_costotn);
                sqlCmd.Parameters.AddWithValue("@valorizacion_subtotal", cmValorizacion.valorizacion_subtotal);
                sqlCmd.Parameters.AddWithValue("@valorizacion_igv", cmValorizacion.valorizacion_igv);
                sqlCmd.Parameters.AddWithValue("@valorizacion_codigo", cmValorizacion.valorizacion_codigo.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_id", (cmValorizacion.transportista_id));

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
        public Tuple<string, string, List<CMValorizacion>> ValorizacionSelect(int transportista_id, string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            CMValorizacion valorizacion = new CMValorizacion();
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
                sqlCmd.CommandText = "Valorizacion_list_select";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@transportista_id", transportista_id);
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<CMValorizacion>> ValorizacionReturn(int valorizacion_id, string bandera)
        {
            List<CMValorizacion> lst = new List<CMValorizacion>();
            CMValorizacion valorizacion = new CMValorizacion();
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
                sqlCmd.CommandText = "Valorizacion_list_select_return";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@valorizacion_id", valorizacion_id);
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }
    }
}
