namespace AltoChicamaSystem.Models
{
    public class CMValorizacion
    {
        public int valorizacion_id { get; set; }
        public decimal valorizacion_costotn { get; set; }
        public decimal valorizacion_subtotal { get; set; }
        public decimal valorizacion_igv { get; set; }
        public string valorizacion_codigo { get; set; }
        public int transportista_id { get; set; }
        public string guia_ids { get; set; }

    }
}
