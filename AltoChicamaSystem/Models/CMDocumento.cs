namespace AltoChicamaSystem.Models
{
    public class CMDocumento
    {
        public int documento_id { get; set; }
        public string documento_titulo { get; set; }
        public byte[] documento_pdf { get; set; }
        public int empresa_id { get; set; }
        public string documento_status { get; set; }
        public int documento_numero { get; set; }
        public int guia_id { get; set; }
    }

    public class DocumentoResult
    {
        public int documento_id { get; set; }
        public string documento_titulo { get; set; }
        public byte[] documento_pdf { get; set; }
        public int empresa_id { get; set; }
        public string empresa_name { get; set; }
        public string documento_status { get; set; }
        public int documento_numero { get; set; }
        public int guia_id { get; set; }
        public string guia_numero { get; set; }
        public string transportista_nombre { get; set; }
    }
}