﻿using AltoChicamaSystem.Data.Empresa;
using AltoChicamaSystem.Data.Transportista;
using AltoChicamaSystem.Models;

namespace AltoChicamaSystem.Negocio
{
    public class TransportistaCN
    {
        private TransportistaDB objDato = new TransportistaDB();
        public Tuple<string, string> regTransportista(CMTransportista cmTransportista, string bandera)
        {
            var result = objDato.regTransportista(cmTransportista, bandera);
            return result;
        }

        public Tuple<string, string, List<CMTransportista>> listaTransportista(string bandera)
        {
            var result = objDato.listaTransportista(bandera);
            return result;
        }

        public Tuple<string, string, List<CMTransportista>> TransportistaSelect(string bandera)
        {
            var result = objDato.TransportistaSelect(bandera);
            return result;
        }
    }
}
