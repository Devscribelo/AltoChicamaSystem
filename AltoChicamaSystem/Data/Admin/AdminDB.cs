using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data.Admin
{
    public class AdminDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string, int> loginAdmin(CMAdmin cmadmin, string bandera)
        {
            string rpta = "";
            string msg = "";
            int loginId = 0;
            MySqlConnection mySqlCon = new MySqlConnection();

            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Login_admin";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_admin_user", cmadmin.admin_user.Trim());
                mySqlCmd.Parameters.AddWithValue("p_admin_password", cmadmin.admin_password.Trim());

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();

                if (sdr.Read())
                {
                    rpta = sdr["Rpta"].ToString();
                    msg = sdr["Msg"].ToString();
                    loginId = Convert.ToInt32(sdr["LoginId"]);
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

            return Tuple.Create(rpta, msg, loginId);
        }
    }
}
