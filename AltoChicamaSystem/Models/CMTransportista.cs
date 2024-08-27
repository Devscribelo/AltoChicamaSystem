namespace AltoChicamaSystem.Models
{
    public class CMTransportista
    {
        public int transportista_id { get; set; }
        public string transportista_ruc { get; set; }
        public string transportista_nombre { get; set; }
        public int empresa_id { get; set; }
    }

    public class TransportistaResult
    {
        public int transportista_id { get; set; }
        public string transportista_ruc { get; set; }
        public string transportista_nombre { get; set; }
        public string empresa_name { get; set; }
    }
}
