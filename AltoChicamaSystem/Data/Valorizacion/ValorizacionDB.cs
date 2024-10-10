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
    }
}
