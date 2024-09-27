using AltoChicamaSystem.Models;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Guia
{
    public class GuiaDB
    {
        private ConexionDB con = new ConexionDB();

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
    }
}
