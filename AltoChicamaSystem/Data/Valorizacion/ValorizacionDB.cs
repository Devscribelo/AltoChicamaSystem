using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Valorizacion
{
    public class ValorizacionDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string> regValorizacion(CMValorizacion CMValorizacion, string bandera)
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
                sqlCmd.Parameters.AddWithValue("@guia_ids", CMValorizacion.guia_ids.Trim());
                sqlCmd.Parameters.AddWithValue("@valorizacion_costotn", CMValorizacion.valorizacion_costotn);
                sqlCmd.Parameters.AddWithValue("@valorizacion_subtotal", CMValorizacion.valorizacion_subtotal);
                sqlCmd.Parameters.AddWithValue("@valorizacion_igv", CMValorizacion.valorizacion_igv);
                sqlCmd.Parameters.AddWithValue("@valorizacion_codigo", CMValorizacion.valorizacion_codigo.Trim());
                sqlCmd.Parameters.AddWithValue("@transportista_id", (CMValorizacion.transportista_id));

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
