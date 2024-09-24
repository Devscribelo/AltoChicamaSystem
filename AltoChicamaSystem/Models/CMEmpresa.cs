namespace AltoChicamaSystem.Models
{
    public class CMEmpresa
    {
        public int empresa_id { get; set; }
        public string empresa_name { get; set; }
        public string empresa_ruc { get; set; }
        public string empresa_correo { get; set; }
        public string empresa_status { get; set; }
    }

    public class EmpresaResult
    {
        public int empresa_id { get; set; }
        public string empresa_name { get; set; }
        public string empresa_ruc { get; set; }
        public string empresa_correo { get; set; }
        public string empresa_status { get; set; }
        public string usuario_user { get; set; }
        public string usuario_password { get; set; }
    }

    public class Direccion
    {
        public int direccion_id { get; set; }
        public string direccion { get; set; }
        public int empresa_id { get; set; }

    }

}
