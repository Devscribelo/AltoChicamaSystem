namespace AltoChicamaSystem.Models
{
    public class CMGuia
    {
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
        public string guia_descarga { get; set; }
        public decimal guia_cantidad { get; set; }
        public string guia_unidad { get; set; }
        public string guia_direccion { get; set; }
        public string guia_status { get; set; }
        public int transportista_id { get; set; }
        public string guia_fecha_servicio { get; set; }
        public decimal guia_costo { get; set; }
        public string empresa_name { get; set; }
        public string transportista_nombre { get; set; }
        public string empresa_ruc { get; set; }
        public int documento_id { get; set; }
    }
    public class GuiaSelect
    {
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
    }
    public class GuiaResult
    {
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
        public string guia_descarga { get; set; }
        public decimal guia_cantidad { get; set; }
        public string guia_unidad { get; set; }
        public string transportista_nombre { get; set; }
        public string guia_fecha_servicio { get; set; }
        public decimal guia_costo { get; set; }
        public int id_factura { get; set; }
    }
}