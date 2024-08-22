using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;
using System;

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
                sqlCmd.Parameters.AddWithValue("@empresa_status", cmEmpresa.empresa_status);

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

        public Tuple<string, string, List<CMEmpresa>> EmpresaSelect(string bandera)
        {
            List<CMEmpresa> lst = new List<CMEmpresa>();
            CMEmpresa empresaselect = new CMEmpresa();
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
                sqlCmd.CommandText = "Empresa_list_select";
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
                        empresaselect = new CMEmpresa();
                        empresaselect.empresa_id = Convert.ToInt32(sdr["empresa_id"]);
                        empresaselect.empresa_name = sdr["empresa_name"].ToString().Trim();
                        lst.Add(empresaselect);
                    }

                }
            }
            catch (Exception ex)
            {
                lst = new List<CMEmpresa>();
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
        public Tuple<string, string> modEmpresa(CMEmpresa cmEmpresa, string bandera)
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
                sqlCmd.CommandText = "Empresa_mod";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@empresa_id", cmEmpresa.empresa_id);
                sqlCmd.Parameters.AddWithValue("@empresa_name", cmEmpresa.empresa_name.Trim());
                sqlCmd.Parameters.AddWithValue("@empresa_ruc", cmEmpresa.empresa_ruc.Trim());
                sqlCmd.Parameters.AddWithValue("@empresa_correo", cmEmpresa.empresa_correo.Trim());
                sqlCmd.Parameters.AddWithValue("@empresa_status", cmEmpresa.empresa_status);

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

        public Tuple<string, string> alterEmpresaStatus(int empresa_id, string bandera)
        {
            string rpta = "";
            string msg = "";

            try
            {
                using (SqlConnection sqlCon = new SqlConnection(con.obtenerDatosConexion(bandera)))
                {
                    sqlCon.Open();
                    using (SqlCommand sqlCmd = new SqlCommand("Empresa_alter_status", sqlCon))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("@empresa_id", empresa_id);

                        using (SqlDataReader sdr = sqlCmd.ExecuteReader())
                        {
                            if (sdr.Read())
                            {
                                rpta = sdr["Rpta"].ToString();
                                msg = sdr["Msg"].ToString();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                rpta = "1"; // Indicar que hubo un error
                msg = ex.Message;
            }

            return Tuple.Create(rpta, msg);
        }

    }
}
