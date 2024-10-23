using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data
{
    public class ConexionDB
    {
        private string SERVER = "localhost";
        private string DB_NAME = "altochicama";
        private string USER = "root";
        private string PASSWORD = "admin";
        private int PORT = 3306;

        public string obtenerDatosConexion(string bandera)
        {
            return $"Server={SERVER};Database={DB_NAME};User ID={USER};Password={PASSWORD};Port={PORT};";
        }
    }
}