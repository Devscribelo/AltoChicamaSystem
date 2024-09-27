using AltoChicamaSystem.Data.Guia;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class GuiaCN
    {
        private GuiaDB objDato = new GuiaDB();
        public Tuple<string, string, List<GuiaSelect>> GuiaSelect(string bandera)
        {
            var result = objDato.GuiaSelect(bandera);
            return result;
        }
    }
}
