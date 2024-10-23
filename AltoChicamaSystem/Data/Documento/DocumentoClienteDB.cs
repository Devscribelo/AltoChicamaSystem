using AltoChicamaSystem.Models;
using AltoChicamaSystem.Data;
using System.Data;
using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data.Documento
{
    public class DocumentoClienteDB
    {
        private ConexionDB con = new ConexionDB();

        public CMDocumentoCliente ObtenerDocumentoPorId(int documentoId, string bandera)
        {
            CMDocumentoCliente documento = null;
            MySqlConnection mySqlCon = new MySqlConnection();
            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand
                {
                    Connection = mySqlCon,
                    CommandText = "Documento_abrir",
                    CommandType = CommandType.StoredProcedure
                };
                mySqlCmd.Parameters.AddWithValue("p_DocumentoID", documentoId);

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();
                if (sdr.Read())
                {
                    documento = new CMDocumentoCliente
                    {
                        documento_id = Convert.ToInt32(sdr["documento_id"]),
                        documento_titulo = sdr["documento_titulo"].ToString(),
                        documento_pdf = (byte[])sdr["documento_pdf"],
                        empresa_id = Convert.ToInt32(sdr["empresa_id"]),
                        documento_status = sdr["documento_status"].ToString(),
                        documento_numero = Convert.ToInt32(sdr["documento_numero"]),
                        guia_id = Convert.ToInt32(sdr["guia_id"])
                    };
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores
            }
            finally
            {
                if (mySqlCon.State == ConnectionState.Open)
                {
                    mySqlCon.Close();
                }
            }
            return documento;
        }

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltrado(int empresa_id, string bandera)
        {
            List<CMDocumentoResultCliente> lst = new List<CMDocumentoResultCliente>();
            CMDocumentoResultCliente documento = new CMDocumentoResultCliente();
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
                mySqlCmd.CommandText = "Documento_List_Empresa_Filtro";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_empresa_id", empresa_id);
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
                        documento = new CMDocumentoResultCliente();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMDocumentoResultCliente>();
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

        public Tuple<string, string, List<CMDocumentoResultCliente>> listarDocumentoFiltradoTransportista(int transportista_id, string bandera)
        {
            List<CMDocumentoResultCliente> lst = new List<CMDocumentoResultCliente>();
            CMDocumentoResultCliente documento = new CMDocumentoResultCliente();
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
                mySqlCmd.CommandText = "Documento_List_Transportista_Filtro";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("p_transportista_id", transportista_id);
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
                        documento = new CMDocumentoResultCliente();
                        documento.documento_id = Convert.ToInt32(sdr["documento_id"]);
                        documento.documento_numero = Convert.ToInt32(sdr["documento_numero"]);
                        documento.documento_titulo = sdr["documento_titulo"].ToString().Trim();
                        documento.empresa_name = sdr["empresa_name"].ToString().Trim();
                        documento.documento_status = sdr["documento_status"].ToString();
                        documento.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        documento.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(documento);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMDocumentoResultCliente>();
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
    }
}