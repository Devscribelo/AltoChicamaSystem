﻿using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Usuario
{
    public class UsuarioDB
    {
        private ConexionDB con = new ConexionDB();
        public Tuple<string, string, List<CMUsuario>> listarUsuario(string bandera)
        {
            List<CMUsuario> lst = new List<CMUsuario>();
            SqlConnection sqlCon = new SqlConnection();
            string rpta = "";
            string msg = "";
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand();
                sqlCmd.Connection = sqlCon;
                sqlCmd.CommandText = "Usuario_list";
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
                if (sqlCon.State == ConnectionState.Open)
                {
                    sqlCon.Close();
                }
            }
            return Tuple.Create(rpta, msg, lst);
        }
        public Tuple<string,string> regUsuario(CMUsuario cmUsuario, string bandera)
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
                sqlCmd.CommandText = "Usuario_Reg";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@usuario_user", cmUsuario.usuario_user.Trim());
                sqlCmd.Parameters.AddWithValue("@usuario_password", cmUsuario.usuario_password.Trim());
                sqlCmd.Parameters.AddWithValue("@empresa_id", Convert.ToInt32(cmUsuario.empresa_id));

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
