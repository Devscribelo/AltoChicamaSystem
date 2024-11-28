using MySql.Data.MySqlClient;

namespace AltoChicamaSystem.Data
{
    public class ConexionDB
    {
        private string SERVER = "190.234.242.76";
        private string DB_NAME = "altochicama";
        private string USER = "devscribelo";
        private string PASSWORD = "rzwn9uRc5Q11T42dO9KE"; 
        private int PORT = 3306;

        public string obtenerDatosConexion(string bandera)
        {
            return $"Server={SERVER};Database={DB_NAME};User ID={USER};Password={PASSWORD};Port={PORT};";
        }
    }
}