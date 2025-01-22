using AltoChicamaSystem.Models;
using System.Data;
using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data.TipoServicio
{
    public class TipoServicioDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string, List<CMTipoServicio>> TipoServicioSelect(string bandera)
        {
            List<CMTipoServicio> lst = new List<CMTipoServicio>();
            CMTipoServicio tiposervicioSelect = new CMTipoServicio();
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
                mySqlCmd.CommandText = "listar_tipos_servicio";
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
                        tiposervicioSelect = new CMTipoServicio();
                        tiposervicioSelect.tiposervicio_id = Convert.ToInt32(sdr["tiposervicio_id"]);
                        tiposervicioSelect.tipo_residuo = sdr["tipo_residuo"].ToString().Trim();
                        tiposervicioSelect.tipo_titulo = sdr["tipo_titulo"].ToString().Trim();
                        tiposervicioSelect.tipo_numero_certificado = sdr["tipo_numero_certificado"].ToString().Trim();
                        tiposervicioSelect.tipoResiduotittle = sdr["tipoResiduotittle"].ToString().Trim();
                        tiposervicioSelect.tipoResiduo = sdr["tipoResiduo"].ToString().Trim();
                        tiposervicioSelect.residuoDir = sdr["residuoDir"].ToString().Trim();
                        lst.Add(tiposervicioSelect);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<CMTipoServicio>();
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


        public Tuple<string, string, int?, string> ContarPorTipoServicio(CMTipoServicio cmTipoServicio, string bandera)
        {
            string rpta = "";
            string msg = "";
            int? conteo = null;
            string residuoDir = "";
            MySqlConnection mySqlCon = new MySqlConnection();

            try
            {
                mySqlCon.ConnectionString = con.obtenerDatosConexion(bandera);
                mySqlCon.Open();
                MySqlCommand mySqlCmd = new MySqlCommand();
                mySqlCmd.Connection = mySqlCon;
                mySqlCmd.CommandText = "contar_por_tipo_servicio";
                mySqlCmd.CommandType = CommandType.StoredProcedure;
                mySqlCmd.Parameters.AddWithValue("id_servicio", cmTipoServicio.tiposervicio_id);

                MySqlDataReader sdr = mySqlCmd.ExecuteReader();
                if (sdr.Read())
                {
                    rpta = sdr["Rpta"].ToString();
                    msg = sdr["Msg"].ToString();
                }
                if (sdr.NextResult() && sdr.Read())
                {
                    conteo = Convert.ToInt32(sdr[0]);
                    residuoDir = sdr["residuoDir"].ToString();
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
            return Tuple.Create(rpta, msg, conteo, residuoDir);
        }

    }
}