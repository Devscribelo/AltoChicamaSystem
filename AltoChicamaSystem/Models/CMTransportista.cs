namespace AltoChicamaSystem.Models
{
    public class CMTransportista
    {
        public int transportista_id { get; set; }
        public string transportista_ruc { get; set; }
        public string transportista_nombre { get; set; }
        public string transportista_user { get; set; }
        public string transportista_password { get; set; }
    }

    public class TransportistaResult
    {
        public int transportista_id { get; set; }
        public string transportista_ruc { get; set; }
        public string transportista_nombre { get; set; }
        public string transportista_user { get; set; }
        public string transportista_password { get; set; }
    }
    public class TransportistaVista
    {
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
        public string empresa_name { get; set; }
        public string empresa_ruc { get; set; }
        public string guia_fecha_servicio { get; set; }
        public string guia_direccion { get; set; }
        public decimal guia_costo { get; set; }
        public decimal guia_cantidad { get; set; }
        public string guia_unidad { get; set; }
        public string guia_descarga { get; set; }
        public int documento_id { get; set; }

    }
}
