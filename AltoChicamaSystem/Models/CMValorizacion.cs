namespace AltoChicamaSystem.Models
{
    public class CMValorizacion
    {
        public int valorizacion_id { get; set; }
        public string valorizacion_costotn { get; set; }
        public decimal valorizacion_subtotal { get; set; }
        public decimal valorizacion_igv { get; set; }
        public string valorizacion_codigo { get; set; }
        public decimal valorizacion_total { get; set; }
        public int transportista_id { get; set; }
        public int guia_id { get; set; }
        public string guia_ids { get; set; }
        public string guia_numero { get; set; }
        public string guia_fecha_servicio { get; set; }
        public string guia_descarga { get; set; }
        public decimal guia_cantidad { get; set; }
        public decimal guia_costo { get; set; }
        public decimal valorizacion_monto { get; set; }
        public string transportista_nombre { get; set; }
        public string valorizacion_guias { get; set; }
        public string valorizacion_numeros { get; set; }
        public string transportista_ruc { get; set; }
    }
}
