using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Empresa
{
    public class EmpresaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regEmpresa(CMEmpresa cmEmpresa, string bandera)
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
                sqlCmd.CommandText = "Empresa_reg";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@empresa_name", cmEmpresa.empresa_name.Trim());
                sqlCmd.Parameters.AddWithValue("@empresa_ruc", cmEmpresa.empresa_ruc.Trim());
                sqlCmd.Parameters.AddWithValue("@empresa_correo", cmEmpresa.empresa_correo.Trim());

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
