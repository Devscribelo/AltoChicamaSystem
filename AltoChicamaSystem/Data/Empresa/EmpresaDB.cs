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

        public Tuple<string,string, List<CMEmpresa>> listarEmpresa(string bandera)
        {
            List<CMEmpresa> lst = new List<CMEmpresa>();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Empresa_list";
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
                            CMEmpresa empresa = new CMEmpresa
                            {
                                empresa_id = Convert.ToInt32(sdr["empresa_id"]),
                                empresa_name = sdr["empresa_name"].ToString().Trim(),
                                empresa_correo = sdr["empresa_correo"].ToString().Trim(),
                                empresa_ruc = sdr["empresa_ruc"].ToString().Trim(),
                            };
                            lst.Add(empresa);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMEmpresa>();
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
