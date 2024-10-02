// Función para calcular el total
function calcularTotal() {
    var inputToneladas = document.getElementById('input_toneladas');
    var inputPrecioTonelada = document.getElementById('input_precioTonelada');

    // Verifica que los elementos de toneladas y precio por tonelada existan
    if (inputToneladas && inputPrecioTonelada) {
        var toneladas = parseFloat(inputToneladas.value) || 0;
        var precio = parseFloat(inputPrecioTonelada.value) || 0;

        var totalSinIGV = toneladas * precio;
        var igv = 0.18; // 18%
        var totalConIGV = totalSinIGV * (1 + igv);

        // Verifica si los campos para mostrar resultados existen
        var inputTotal = document.getElementById('input_total');
        var inputIGV = document.getElementById('input_igv');

        if (inputTotal) {
            inputTotal.value = totalSinIGV.toFixed(2);
        }

        if (inputIGV) {
            inputIGV.value = totalConIGV.toFixed(2);
        }

        calcularTotalConDetraccion(totalConIGV);
    }
}

// Función para calcular el total después de la detracción
function calcularTotalConDetraccion(totalConIGV) {
    var inputDetraccion = document.getElementById('input_detraccion');

    if (inputDetraccion) {
        var detraccion = parseFloat(inputDetraccion.value) || 0;
        var totalConDetraccion = totalConIGV - detraccion;

        var inputTotalIGV = document.getElementById('input_totalIGV');
        if (inputTotalIGV) {
            inputTotalIGV.value = totalConDetraccion.toFixed(2);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var inputToneladas = document.getElementById('input_toneladas');
    var inputPrecioTonelada = document.getElementById('input_precioTonelada');
    var inputDetraccion = document.getElementById('input_detraccion');

    // Asocia los eventos solo si los elementos existen
    if (inputToneladas) {
        inputToneladas.addEventListener('input', calcularTotal);
    }

    if (inputPrecioTonelada) {
        inputPrecioTonelada.addEventListener('input', calcularTotal);
    }

    if (inputDetraccion) {
        inputDetraccion.addEventListener('input', calcularTotal);
    }
});