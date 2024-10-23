using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Data.Empresa
{
    public class EmpresaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regEmpresa(EmpresaResult cmEmpresa, string bandera)
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
                mySqlCmd.CommandText = "Empresa_reg";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_empresa_name", cmEmpresa.empresa_name.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_ruc", cmEmpresa.empresa_ruc.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_correo", cmEmpresa.empresa_correo.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_status", cmEmpresa.empresa_status);

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

        public Tuple<string, string, List<CMEmpresa>> listarEmpresa(string bandera)
        {
            List<CMEmpresa> lst = new List<CMEmpresa>();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Empresa_list";
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
                            CMEmpresa empresa = new CMEmpresa
                            {
                                empresa_id = Convert.ToInt32(sdr["empresa_id"]),
                                empresa_name = sdr["empresa_name"].ToString().Trim(),
                                empresa_correo = sdr["empresa_correo"].ToString().Trim(),
                                empresa_ruc = sdr["empresa_ruc"].ToString().Trim(),
                                empresa_status = sdr["empresa_status"].ToString().Trim(),
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string, List<CMEmpresa>> EmpresaSelect(string bandera)
        {
            List<CMEmpresa> lst = new List<CMEmpresa>();
            CMEmpresa empresaselect = new CMEmpresa();
            MySqlConnection mySqlCon = new MySqlConnection();
            string rpta = "";
            string msg = "";
            int count = 0;
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "Empresa_list_select";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                MySqlDataReader sdr = mySqlCmd.ExecuteReader();

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
                        empresaselect.empresa_ruc = sdr["empresa_ruc"].ToString().Trim();
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
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }

        public Tuple<string, string> modEmpresa(CMEmpresa cmEmpresa, string bandera)
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
                mySqlCmd.CommandText = "Empresa_mod";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", cmEmpresa.empresa_id);
                mySqlCmd.Parameters.AddWithValue("p_empresa_name", cmEmpresa.empresa_name.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_ruc", cmEmpresa.empresa_ruc.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_correo", cmEmpresa.empresa_correo.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_status", cmEmpresa.empresa_status);

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

        public Tuple<string, string> delEmpresa(CMEmpresa cmEmpresa, string bandera, int empresa_id)
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
                mySqlCmd.CommandText = "Empresa_delete";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", empresa_id);

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
                cmEmpresa = new CMEmpresa();
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

        public Tuple<string, string> alterEmpresaStatus(int empresa_id, string bandera)
        {
            string rpta = "";
            string msg = "";

            try
            {
                using (MySqlConnection mySqlCon = new MySqlConnection(con.obtenerDatosConexion(bandera)))
                {
                    mySqlCon.Open();
                    using (MySqlCommand mySqlCmd = new MySqlCommand("Empresa_alter_status", mySqlCon))
                    {
                        mySqlCmd.CommandType = CommandType.StoredProcedure;
                        mySqlCmd.Parameters.AddWithValue("p_empresa_id", empresa_id);

                        using (MySqlDataReader sdr = mySqlCmd.ExecuteReader())
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