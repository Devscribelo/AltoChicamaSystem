namespace AltoChicamaSystem.Models
{
    public class CMGuia
    {
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
        public string guia_descarga { get; set; }
        public decimal guia_cantidad { get; set; }
        public string guia_unidad { get; set; }
        public int transportista_id { get; set; }
    }
    public class GuiaSelect
    {
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
    }
}