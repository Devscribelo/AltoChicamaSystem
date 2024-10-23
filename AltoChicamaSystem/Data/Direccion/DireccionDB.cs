using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace AltoChicamaSystem.Data.Empresa
{
    public class DireccionDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regDireccion(Direccion cmEmpresa, string bandera)
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
                mySqlCmd.CommandText = "Direcciones_reg";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_direccion", cmEmpresa.direccion.Trim());
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", cmEmpresa.empresa_id);

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

        public Tuple<string, string, List<Direccion>> DireccionSelect(int empresa_id, string bandera)
        {
            List<Direccion> lst = new List<Direccion>();
            Direccion direccionselect = new Direccion();
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
                mySqlCmd.CommandText = "Direcciones_list";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", Convert.ToInt32(empresa_id));
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
                        direccionselect = new Direccion();
                        direccionselect.direccion_id = Convert.ToInt32(sdr["direccion_id"]);
                        direccionselect.direccion = sdr["direccion"].ToString().Trim();
                        lst.Add(direccionselect);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<Direccion>();
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

        public Tuple<string, string> delDireccion(string bandera, int direccion_id)
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
                mySqlCmd.CommandText = "Direcciones_delete";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_direccion_id", direccion_id);

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