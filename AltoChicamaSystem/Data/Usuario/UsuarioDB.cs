using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data.Usuario
{
    public class UsuarioDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string, List<CMUsuario>> listarUsuario(string bandera)
        {
            List<CMUsuario> lst = new List<CMUsuario>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Usuario_list";
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
                            CMUsuario usuario = new CMUsuario
                            {
                                usuario_id = Convert.ToInt32(sdr["usuario_id"]),
                                usuario_user = sdr["usuario_user"].ToString().Trim(),
                                usuario_password = sdr["usuario_password"].ToString().Trim(),
                            };
                            lst.Add(usuario);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMUsuario>();
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
        public Tuple<string, string> regUsuario(CMUsuario cmUsuario, string bandera)
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
                mySqlCmd.CommandText = "Usuario_Reg";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_usuario_user", cmUsuario.usuario_user.Trim());
                mySqlCmd.Parameters.AddWithValue("p_usuario_password", cmUsuario.usuario_password.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", Convert.ToInt32(cmUsuario.empresa_id));

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

    }
}