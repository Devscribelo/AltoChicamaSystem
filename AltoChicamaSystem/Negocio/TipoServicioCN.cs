using AltoChicamaSystem.Data.Guia;
using AltoChicamaSystem.Data.TipoServicio;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class TipoServicioCN
    {
        private TipoServicioDB objDato = new TipoServicioDB();


        public Tuple<string, string, List<CMTipoServicio>> TipoServicioSelect(string bandera)
        {
            var result = objDato.TipoServicioSelect(bandera);
            return result;
        }

        public Tuple<string, string, int?, string> ContarPorTipoServicio(CMTipoServicio request, string bandera)
        {
            var result = objDato.ContarPorTipoServicio(request, bandera);
            return result;
        }


    }
}