var hostProyecto;

hostProyecto = "https://" + window.location.host;
function getDomain() {
    return "https://" + window.location.host;
}

function trimJSONFields(obj) {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string') {
            return obj.trim();
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(trimJSONFields);
    }

    const trimmedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            trimmedObj[key] = trimJSONFields(value);
        }
    }
    return trimmedObj;
}

function agregarBotonesExportacion(tablaId) {
    var contenedorBotones = document.getElementById("contenedorBotones");

    // Función para crear un botón de exportación
    function crearBoton(clase, icono, evento) {
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn btn-primary " + clase;
        boton.innerHTML = '<img src="/img/' + icono + '" alt="Exportar ' + clase.split("_")[2] + '" style="width:35px; height:35px;">';
        boton.addEventListener("click", function () {
            // Exportar a Excel o PDF según la clase del botón
            if ($.fn.DataTable.isDataTable(tablaId)) {
                $(tablaId).DataTable().button('.' + clase).trigger();
            }
        });
        return boton;
    }

    // Crear botón de exportación Excel
    contenedorBotones.appendChild(crearBoton("btn_export_Excel", "excel.png"));

    // Agregar un margen entre los botones
    contenedorBotones.appendChild(document.createTextNode("\u00A0")); // Agrega un espacio en blanco

    // Crear botón de exportación PDF
    contenedorBotones.appendChild(crearBoton("btn_export_Pdf", "pdf.png"));
}


function formatAndAssignDate(dateString, inputId) {
    if (dateString) {
        var dateParts = dateString.split(' ')[0].split('/');
        var day = dateParts[0].padStart(2, '0');
        var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + day;
        $(inputId).val(formattedDate);
    }
}