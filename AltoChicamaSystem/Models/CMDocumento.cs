﻿namespace AltoChicamaSystem.Models
{
    public class CMDocumento
    {
        public int documento_id { get; set; }
        public string documento_titulo { get; set; }
        public byte[] documento_pdf { get; set; }
        public int empresa_id { get; set; }
        public int transportista_id { get; set; }
        public string documento_status { get; set; } 
        public string documento_matriculas { get; set; }
        public int documento_numero { get; set; }
        public DateTime fecha_servicio { get; set; }
        public DateTime fecha_pago { get; set; }
        public decimal documento_deuda { get; set; }
        public decimal total_deuda { get; set; }
    }

    public class DocumentoResult
    {
        public int documento_id { get; set; }
        public int empresa_id { get; set; }
        public int estado { get; set; }
        public byte[] documento_pdf { get; set; }
        public string documento_titulo { get; set; }
        public int transportista_id { get; set; }
        public string empresa_name { get; set; } // Propiedad para almacenar el nombre de la empresa
        public string transportista_nombre { get; set; }
        public string documento_status { get; set; }

        public string documento_matriculas { get; set; }
        public int documento_numero { get; set; }
        public DateTime fecha_servicio { get; set; }
        public DateTime fecha_pago { get; set; }
        public decimal documento_deuda { get; set; }
    }

}
