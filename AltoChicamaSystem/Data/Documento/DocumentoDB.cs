﻿using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Documento
{
    public class DocumentoDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string> regDocumento(CMDocumento cmDocumento, string bandera)
        {
            string rpta = "1";  // Valor por defecto en caso de error
            string msg = "Error al Registrar";
            SqlConnection sqlCon = new SqlConnection();
            try
            {
                sqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                sqlCon.Open();
                SqlCommand sqlCmd = new SqlCommand
                {
                    Connection = sqlCon,
                    CommandText = "Documento_reg",
                    CommandType = CommandType.StoredProcedure
                };
                sqlCmd.Parameters.AddWithValue("@documento_titulo", cmDocumento.documento_titulo.Trim());
                sqlCmd.Parameters.AddWithValue("@documento_pdf", cmDocumento.documento_pdf);
                sqlCmd.Parameters.AddWithValue("@empresa_id", cmDocumento.empresa_id);

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
