
namespace AltoChicamaSystem.Data
{
    public class ConexionDB
    {
        private string HOST = "DESKTOP-0UEULI1\\SQLEXPRESS";
        private string DB_NAME = "altochicama";
        private string USER = "sa";
        private string PASSWORD = "devscribelo";

        public string obtenerDatosConexion(string bandera)
        {
            return "Data Source = " + HOST +
                                  "; Initial Catalog = " + DB_NAME +
                                  "; Integrated Security = False" +
                                  "; User ID = " + USER +
                                  "; Password = " + PASSWORD;
        }
    }
}
