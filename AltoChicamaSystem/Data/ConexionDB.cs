using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data
{
    public class ConexionDB
    {
        private string SERVER = "192.168.18.79";
        private string DB_NAME = "altochicama";
        private string USER = "devscribelo";
        private string PASSWORD = "canicas123"; 
        private int PORT = 3306;

        public string obtenerDatosConexion(string bandera)
        {
            return $"Server={SERVER};Database={DB_NAME};User ID={USER};Password={PASSWORD};Port={PORT};";
        }
    }
}