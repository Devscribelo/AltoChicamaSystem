using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Admin
{
    public class AdminDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string> loginAdmin(CMAdmin cmadmin, string bandera)
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
                sqlCmd.CommandText = "Login_admin";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@admin_user", cmadmin.admin_user.Trim());
                sqlCmd.Parameters.AddWithValue("@admin_password", cmadmin.admin_password.Trim());

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
