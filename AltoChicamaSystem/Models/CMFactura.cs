namespace AltoChicamaSystem.Models
{
    public class CMFactura
    {
        public int id_factura { get; set; }
        public decimal factura_monto { get; set; }
        public string num_factura { get; set; }
        public string factura_status { get; set; }
        public int transportista_id { get; set; }
        public string transportista_nombre { get; set; }
        public int estado { get; set; }
        public string guias_ids { get; set; }
        public string factura_fecha_pago { get; set; }

    }
}
