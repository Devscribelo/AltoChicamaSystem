using AltoChicamaSystem.Models;
using System.Data;
using System.Data.SqlClient;

namespace AltoChicamaSystem.Data.Guia
{
    public class GuiaDB
    {
        private ConexionDB con = new ConexionDB();

        public Tuple<string, string, List<GuiaSelect>> GuiaSelect(string bandera)
        {
            List<GuiaSelect> lst = new List<GuiaSelect>();
            GuiaSelect guiaselect = new GuiaSelect();
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
                sqlCmd.CommandText = "Guia_list_select";
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
                        guiaselect = new GuiaSelect();
                        guiaselect.guia_id = Convert.ToInt32(sdr["guia_id"]);
                        guiaselect.guia_numero = sdr["guia_numero"].ToString().Trim();
                        lst.Add(guiaselect);
                    }

                }
            }
            catch (Exception ex)
            {
                lst = new List<GuiaSelect>();
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

        public Tuple<string, string, List<GuiaResult>> listarGuiaFiltro(int id_factura, string bandera)
        {
            List<GuiaResult> lst = new List<GuiaResult>();
            GuiaResult guia = new GuiaResult();
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
                sqlCmd.CommandText = "Factura_Detalle_Guias";
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("@id_factura", id_factura);
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
                        guia = new GuiaResult();
                        guia.guia_id = Convert.ToInt32(sdr["guia_id"]);
                        guia.guia_numero = sdr["guia_numero"].ToString().Trim();
                        guia.guia_descarga = sdr["guia_descarga"].ToString().Trim();
                        guia.guia_cantidad = Convert.ToDecimal(sdr["guia_cantidad"]);
                        guia.guia_unidad = sdr["guia_unidad"].ToString().Trim();
                        guia.guia_costo = Convert.ToDecimal(sdr["guia_costo"]);
                        guia.guia_fecha_servicio = sdr["guia_fecha_servicio"].ToString().Trim();
                        guia.transportista_nombre = sdr["transportista_nombre"].ToString().Trim();
                        
                        lst.Add(guia);
                    }
                }
            }
            catch (Exception ex)
            {
                lst = new List<GuiaResult>();
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
    }
}
