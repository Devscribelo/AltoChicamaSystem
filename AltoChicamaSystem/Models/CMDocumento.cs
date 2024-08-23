namespace AltoChicamaSystem.Models
{
    public class CMDocumento
    {
        public int documento_id { get; set; }
        public string documento_titulo { get; set; }
        public byte[] documento_pdf { get; set; }
        public int empresa_id { get; set; }
    }

    public class DocumentoResult
    {
        public int documento_id { get; set; }
        public string documento_titulo { get; set; }
        public string empresa_name { get; set; } // Propiedad para almacenar el nombre de la empresa
    }
}
