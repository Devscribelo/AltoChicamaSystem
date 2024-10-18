var consult = false;
var tableEmpresa;

$(document).ready(function () {
    TransportistaSelect("#input_transportista");
    getListValorizacion();
    $('#btnConsultar').click(function () {
        capturarValoresSeleccionados();
    });
});

function capturarValoresSeleccionados() {
    // Capturar los valores seleccionados
    var transportista_id = $("#input_transportista").val();
    var transportista_nombre = $("#input_transportista option:selected").text();

    // Validar que el transportista_id sea válido (no sea vacío, null o undefined)
    if (transportista_id && transportista_id.trim() !== "") {
        // Llamar a la función para enviar los datos
        getListValorizacionTransportista(transportista_id);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione un transportista.",
        });
    }
}


function modalDetalleValorizacion(valorizacion_id) {
    $("#modal_detalles_valorizacion").modal("show").css('display', 'flex');
    getListValorizacionDetail(valorizacion_id);
}

function formatDateString(dateString) {
    if (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
}

function formatearFecha(fechaString) {
    if (!fechaString) return '';

    // Dividir la fecha y hora
    const [fecha, hora] = fechaString.split(' ');

    // Dividir la fecha en día, mes y año
    const [dia, mes, anio] = fecha.split('/');

    // Verificar si tenemos todas las partes necesarias
    if (dia && mes && anio) {
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${anio}`;
    }

    console.error('Formato de fecha inesperado:', fechaString);
    return 'Fecha inválida';
}

function agregarBotonesExportacion1(tablaId) {
    var contenedorBotones = document.getElementById("contenedorBotones1");

    if (contenedorBotones.querySelector("#btnExportExcel1") && contenedorBotones.querySelector("#btnExportPdf1")) {
        return; // Si los botones ya están presentes, no los agregues de nuevo
    }

    // Función para crear un botón de exportación
    function crearBoton(id, clase, svgPath, altText) {
        var boton = document.createElement("button");
        boton.id = id;
        boton.type = "button";
        boton.className = "button " + clase;

        boton.innerHTML = `
            <span class="button__text">${altText}</span>
            <span class="button__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" class="svg">
                    <path d="${svgPath}"></path>
                </svg>
            </span>
        `;

        boton.addEventListener("click", function () {
            // Exportar a Excel o PDF según la clase del botón
            if ($.fn.DataTable.isDataTable(tablaId)) {
                $(tablaId).DataTable().button('.' + clase).trigger();
            }
        });

        return boton;
    }

    // Crear botón de exportación Excel
    contenedorBotones.appendChild(crearBoton(
        "btnExportExcel1",
        "btn_export_Excel",
        "M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z",
        "Exportar Excel"
    ));

    // Agregar un margen entre los botones
    contenedorBotones.appendChild(document.createTextNode("\u00A0")); // Agrega un espacio en blanco

    // Crear botón de exportación PDF
    contenedorBotones.appendChild(crearBoton(
        "btnExportPdf1",
        "btn_export_Pdf",
        "M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z",
        "Exportar PDF"
    ));
}

function getListValorizacion() {
    var endpoint = getDomain() + "/Valorizacion/ListaValorizacion";

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            success: function (data) {
                console.log(data)
                var valorizacion = data.item3;
                console.log(valorizacion);
                var datosRow = "";

                for (var i = 0; i < valorizacion.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-valorizacion_id='" + formatDateString(valorizacion[i].valorizacion_id) + "'>" + // Corregido aquí
                        "<td>" + valorizacion[i].valorizacion_id + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_codigo + "</td>" +
                        "<td>" + valorizacion[i].transportista_nombre + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_monto + "</td>" +
                        "<td id='acciones'>" +
                        `<a href='#' onclick='modalConfirmacionEliminarValorizacion(${valorizacion[i].valorizacion_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>` +
                        `<i class='bx bx-detail detalle-valorizacion icon-circle' id='detalle_valorizacion" + i + "' onclick='modalDetalleValorizacion(${valorizacion[i].valorizacion_id})'></i>` +
                        "</td>" +
                        "</tr>";
                }
                if ($.fn.DataTable.isDataTable("#table_empresa")) {
                    // Destruir la instancia existente de DataTable
                    $("#table_empresa").DataTable().destroy();
                }

                if (!$("#tb_empresa").hasClass("dataTable")) {
                    tableFactura = $("#table_empresa").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
                        },
                        dom: 'frtip',
                        buttons: [
                            {
                                extend: 'excel',
                                className: 'btn_export_Excel',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(2))' // Oculta la penúltima y la última columna en la exportación a Excel
                                }
                            },
                            {
                                extend: 'pdf',
                                className: 'btn_export_Pdf',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(2))' // Oculta la penúltima y la última columna en la exportación a Excel
                                }
                            }
                        ],
                        colResize: {
                            tableWidthFixed: 'false'
                        },
                        colReorder: true
                    });
                }

                tableFactura.clear();
                tableFactura.rows.add($(datosRow)).draw();
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure");
            }
        });
    });
}

function TransportistaSelect(id_transportista) {
    var endpoint = getDomain() + "/Transportista/TransportistaSelect";

    return new Promise((resolve, reject) => {

        $.ajax({
            type: "GET",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("Cargando transportistas...");
            },
            success: function (data) {
                var TransportistaSelect = data.item3;

                // Limpiar el select y agregar opción por defecto
                $('#input_transportista').empty();
                $('#input_transportista').append(new Option("Seleccione un transportista...", "", true, true));

                // Verificar si la data es null, vacía, o contiene solo espacios en blanco
                if (TransportistaSelect && TransportistaSelect.length > 0) {
                    // Agregar opciones al select
                    for (var i = 0; i < TransportistaSelect.length; i++) {
                        var item = TransportistaSelect[i];
                        $('#input_transportista').append(new Option(item.transportista_nombre, item.transportista_id));

                    }
                } else {
                    console.log("No se encontraron transportistas.");
                    $('#input_transportista').append(new Option("No hay transportistas disponibles", ""));
                }



                // Inicializar o actualizar Select2 usando directamente el ID del select
                $('#input_transportista').select2({
                    placeholder: "Seleccione un transportista...",
                    allowClear: true,
                    language: "es",
                    dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
                });

                // Habilitar el select
                $('#input_transportista').prop("disabled", false);



            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error al cargar transportistas: ' + textStatus);
                console.error("Error al cargar transportistas:", textStatus, errorThrown);
            }
        });
    })
}

TransportistaSelect("#input_transportista");

function modalConfirmacionEliminarValorizacion(valorizacionId) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Estás segur@?',
        text: "Recuerda que no podrás revertir los cambios. Al eliminar, se borrará la valorizacion permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarValorizacion(valorizacionId);
            swalWithBootstrapButtons.fire(
                'Eliminada',
                'La guía ha sido eliminada.',
                'success'
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'La guía no ha sido eliminada',
                'error'
            );
        }
    });
}

function eliminarValorizacion(valorizacionId) {
    var endpoint = getDomain() + "/Valorizacion/EliminarValorizacion";

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify({ valorizacion_id: valorizacionId }),
        success: function (response) {
            if (response.item1 === "0") {
                Swal.fire('Eliminada', response.item2, 'success');
                getListValorizacion(); // Actualiza la lista de guías
            } else {
                Swal.fire('Error', 'Error al eliminar la valorizacion: ' + response.item2, 'error');
                console.error('Error al eliminar valorizacion:', response.item2);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en eliminarValorizacion:', xhr.responseText);
            var errorMessage = 'Hubo un problema al eliminar la valorizacion';
            try {
                var response = JSON.parse(xhr.responseText);
                if (response && response.item2) {
                    errorMessage = response.item2;
                }
            } catch (e) {
                console.error('Error al parsear la respuesta:', e);
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}


function getListValorizacionDetail(valorizacion_id) {
    agregarBotonesExportacion1("#table_detalles_valorizacion");
    return new Promise((resolve, reject) => {

        const endpoint = getDomain() + "/Valorizacion/ListarValorizacionDetalle";

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ valorizacion_id: valorizacion_id }), // Serializa los datos a JSON
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
            },
            success: function (data) {
                console.log(data);
                var dataValorizacion = data.item3;
                var datosRow = "";

                if (data.Item1 === "1") {
                    datosRow += "<tr><td colspan='6' style='text-align:center;'>No hay datos para mostrar</td></tr>";
                } else {
                    for (var i = 0; i < dataValorizacion.length; i++) {
                        datosRow +=
                            "<tr class='filaTabla' " +
                            "data-valorizacion_id='" + dataValorizacion[i].valorizacion_id + "' " +
                            "data-guia_numero='" + dataValorizacion[i].guia_numero + "' " +
                            "data-guia_fecha_servicio='" + formatearFecha(dataValorizacion[i].guia_fecha_servicio) + "' " +
                            "data-guia_descarga='" + dataValorizacion[i].guia_descarga + "'" +
                            "data-guia_cantidad='" + dataValorizacion[i].guia_cantidad + "'" +
                            "data-valorizacion_costotn='" + dataValorizacion[i].guia_costo + "' >" +
                            "<td>" + dataValorizacion[i].valorizacion_id + "</td>" +
                            "<td>" + dataValorizacion[i].guia_numero + "</td>" +
                            "<td>" + formatearFecha(dataValorizacion[i].guia_fecha_servicio) + "</td>" +
                            "<td>" + dataValorizacion[i].guia_descarga + "</td>" +
                            "<td>" + dataValorizacion[i].guia_cantidad + "</td>" +
                            "<td>" + dataValorizacion[i].guia_costo + "</td>" +
                            "<td>" + dataValorizacion[i].valorizacion_total + "</td>"
                    }

                }

                if (!$.fn.DataTable.isDataTable("#table_detalles_valorizacion")) {
                    tableFactura = $("#table_detalles_valorizacion").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
                        },
                        dom: 'frtip',
                        buttons: [
                            {
                                extend: 'excel',
                                className: 'btn_export_Excel',
                            },
                            {
                                extend: 'pdf',
                                className: 'btn_export_Pdf',
                            }
                        ],
                        colResize: {
                            tableWidthFixed: 'false'
                        },
                        colReorder: true,
                        searching: false
                    });
                }


                // Limpiar la tabla y agregar las filas
                tableFactura.clear();
                tableFactura.rows.add($(datosRow)).draw();

                resolve(data); // Resuelve la promesa con la respuesta complet
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.close();
                console.log("failure: " + textStatus + " - " + errorThrown);
            }
        });
    });
}




async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Función para cargar una imagen de manera asíncrona
    const loadImage = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob); // Convertir a base64
        });
    };

    // Configuración inicial del documento
    const margin = 10;
    const reducedWidth = 18; // Ajustar este valor para reducir el ancho
    const contentWidth = doc.internal.pageSize.getWidth() - 2 * margin - reducedWidth; // Reducir el ancho total
    let startY = 20; // Ajustar la posición inicial del texto según sea necesario
    const lineHeightFactor = 1.8;

    // Dibuja el cuadro superior con dos columnas
    const boxWidth = contentWidth; // Ancho total del cuadro
    const boxHeight = 32; // Altura total del cuadro (ajustar según sea necesario)

    const leftColumnWidth = boxWidth * 0.3; // 30% para la columna izquierda
    const rightColumnWidth = boxWidth * 0.7; // 70% para la columna derecha

    // Calcular la posición centrada del cuadro superior
    const boxX = (doc.internal.pageSize.getWidth() - boxWidth) / 2; // Cálculo para centrar el cuadro

    // Dibujar el borde del cuadro superior
    doc.setDrawColor(0, 100, 0); // Color del borde verde
    doc.rect(boxX, startY, boxWidth, boxHeight, 'S'); // Cuadro centrado

    // Dividir el cuadro en filas
    let firstRowHeight = 8; // Altura de la primera fila (ajustado a 8)
    let subsequentRowHeight = 8; // Altura de las filas subsiguientes (ajustado a 8)
    let currentY = startY; // Y inicial para el cuadro

    // Fila vacía en la columna izquierda
    doc.rect(boxX, currentY, leftColumnWidth, subsequentRowHeight * 4, 'S'); // Columna izquierda
    // Cargar la imagen de manera asíncrona
    const img = await loadImage("/img/gh.png");

    // Añadir la imagen en lugar del texto "Columna Izquierda"
    const imgWidth = leftColumnWidth - 12; // Ajustar el ancho de la imagen para que encaje en la columna
    const imgHeight = subsequentRowHeight * 3 - 3; // Ajustar la altura para que encaje en la columna
    doc.addImage(img, 'JPEG', boxX + 6, currentY + 5, imgWidth, imgHeight);

    // Dibujar las filas en la columna derecha (4 filas divididas)
    for (let i = 0; i < 4; i++) { // Cambiar a 4 para mostrar solo 4 filas
        doc.rect(boxX + leftColumnWidth, currentY, rightColumnWidth, subsequentRowHeight, 'S'); // Columna derecha
        if (i === 0) {
            doc.text("Fila 1 en columna derecha", boxX + leftColumnWidth + 4, currentY + 4); // Texto en la primera fila derecha (ajustado a 4)
        } else {
            // Dividir las siguientes filas en dos partes (20% - 80%)
            const splitRowHeight = subsequentRowHeight; // Altura de la fila dividida
            const splitLeftWidth = rightColumnWidth * 0.2; // 20% para la parte izquierda
            const splitRightWidth = rightColumnWidth * 0.8; // 80% para la parte derecha

            // Dibujar parte izquierda
            doc.rect(boxX + leftColumnWidth, currentY, splitLeftWidth, splitRowHeight, 'S'); // Parte izquierda
            doc.text("20%", boxX + leftColumnWidth + 4, currentY + 4); // Texto en parte izquierda (ajustado a 4)

            // Dibujar parte derecha
            doc.rect(boxX + leftColumnWidth + splitLeftWidth, currentY, splitRightWidth, splitRowHeight, 'S'); // Parte derecha
            doc.text("80%", boxX + leftColumnWidth + splitLeftWidth + 4, currentY + 4); // Texto en parte derecha (ajustado a 4)
        }
        currentY += subsequentRowHeight; // Moverse hacia abajo
    }

    // Espacio después del cuadro superior
    startY = currentY + 10; // Añadir un margen de 10 unidades

    // **Nuevo cuadro debajo del existente**
    const newBoxHeight = 32; // Altura total del nuevo cuadro
    const newBoxWidth = contentWidth; // Ancho total del nuevo cuadro

    const leftColumnWidthNew = newBoxWidth * 0.4; // 40% para la columna izquierda
    const middleColumnWidthNew = newBoxWidth * 0.5; // 50% para la columna del medio
    const rightColumnWidthNew = newBoxWidth * 0.1; // 10% para la columna derecha

    // Calcular la posición centrada del nuevo cuadro
    const newBoxX = (doc.internal.pageSize.getWidth() - newBoxWidth) / 2; // Cálculo para centrar el nuevo cuadro

    // Dibujar el borde del nuevo cuadro
    doc.setDrawColor(0, 100, 0); // Color del borde verde
    doc.rect(newBoxX, startY, newBoxWidth, newBoxHeight, 'S'); // Cuadro centrado

    // Dibujar las columnas en el nuevo cuadro
    let currentYNew = startY; // Y inicial para el nuevo cuadro

    // Columna izquierda
    doc.rect(newBoxX, currentYNew, leftColumnWidthNew, newBoxHeight, 'S'); // Parte izquierda
    doc.text("Columna Izquierda", newBoxX + 6, currentYNew + 5); // Texto en la columna izquierda

    // Columna del medio
    doc.rect(newBoxX + leftColumnWidthNew, currentYNew, middleColumnWidthNew, newBoxHeight, 'S'); // Parte del medio
    doc.text("Columna del Medio", newBoxX + leftColumnWidthNew + 6, currentYNew + 5); // Texto en la columna del medio

    // Columna derecha
    doc.rect(newBoxX + leftColumnWidthNew + middleColumnWidthNew, currentYNew, rightColumnWidthNew, newBoxHeight, 'S'); // Parte derecha
    doc.text("Columna Derecha", newBoxX + leftColumnWidthNew + middleColumnWidthNew + 6, currentYNew + 5); // Texto en la columna derecha

    // **Fin del nuevo cuadro**

    // Configurar las columnas de la tabla
    const columns = ["Ítem", "N° Guia", "Fecha", "Tipo", "Cantidad", "Costo/TN", "Costo Total"];
    const columnWidths = [10, 25, 25, 42.5, 20, 25, 25]; // Ajustar los anchos para la nueva configuración

    // Calcular la posición centrada para toda la tabla
    const totalWidth = columnWidths.reduce((acc, val) => acc + val, 0);
    const tableX = (doc.internal.pageSize.getWidth() - totalWidth) / 2; // Posición centrada para la tabla

    // Título del documento (en una sola celda de la tabla)
    const titulo = "VALORIZACIÓN POR SERVICIOS | RCD 2024";
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");

    // Dibujar la fila del título
    const titleHeight = 10; // Altura de la fila del título
    doc.setDrawColor(0, 100, 0); // Color del borde verde
    doc.rect(tableX, startY, totalWidth, titleHeight, 'S'); // Dibujar el borde

    // Texto centrado dentro de la celda del título
    const anchoTexto = doc.getTextWidth(titulo);
    const posicionTextoTitulo = tableX + (totalWidth - anchoTexto) / 2; // Centrar el texto
    doc.text(titulo, posicionTextoTitulo, startY + 7); // Texto centrado en la celda

    // Incrementar la posición Y para comenzar la tabla
    startY += titleHeight;

    // Estilo de las cabeceras sin relleno (solo borde verde)
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");

    // Dibujar las cabeceras
    let currentX = tableX;
    for (let i = 0; i < columns.length; i++) {
        doc.rect(currentX, startY, columnWidths[i], 10, 'S'); // Solo borde verde, sin relleno
        let textoCabecera = columns[i];
        let anchoTextoCabecera = doc.getTextWidth(textoCabecera);
        let posicionTextoCabecera = currentX + (columnWidths[i] - anchoTextoCabecera) / 2; // Centrar texto
        doc.text(textoCabecera, posicionTextoCabecera, startY + 7); // Texto centrado en la celda
        currentX += columnWidths[i]; // Mover a la siguiente columna
    }

    // Añadir los datos de la tabla
    startY += 10; // Espacio después de la cabecera
    doc.setFontSize(10); // Tamaño de fuente para los datos de la tabla
    doc.setFont(undefined, "normal");

    let itemNumber = 1; // Contador para la columna "Ítem"
    const table = document.getElementById('table_detalles_valorizacion');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        currentX = tableX; // Reiniciar posición X para cada fila

        // Agregar número de ítem en la primera columna
        doc.rect(currentX, startY, columnWidths[0], 10, 'S'); // Borde verde, sin fondo
        let posicionTextoItem = currentX + (columnWidths[0] - doc.getTextWidth(itemNumber.toString())) / 2;
        doc.text(itemNumber.toString(), posicionTextoItem, startY + 7); // Centrar el número de ítem
        currentX += columnWidths[0];

        // Incrementar el número de ítem
        itemNumber++;

        // Agregar los datos de las otras columnas
        for (let i = 0; i < cells.length; i++) {
            if (i === 0) continue; // Omitimos la primera celda que sería "Ítem"
            const cellText = cells[i].innerText;
            doc.rect(currentX, startY, columnWidths[i], 10, 'S'); // Borde verde, sin fondo

            let anchoTextoCelda = doc.getTextWidth(cellText);
            let posicionTextoCelda = currentX + (columnWidths[i] - anchoTextoCelda) / 2; // Centrar texto
            doc.text(cellText, posicionTextoCelda, startY + 7); // Texto centrado en la celda
            currentX += columnWidths[i]; // Mover a la siguiente columna
        }

        startY += 10; // Mover a la siguiente fila
    }

    // Texto justificado al final
    const splittedText = doc.splitTextToSize("Este es un texto final de ejemplo que será justificado en el documento generado.", contentWidth);
    doc.text(splittedText, margin, startY + 20, { align: 'justify', maxWidth: contentWidth, lineHeightFactor: lineHeightFactor });

    // Descargar el archivo PDF
    doc.save("documento.pdf");
}



// Asignar el evento al botón de exportar PDF
document.getElementById('btnExportarPDF').addEventListener('click', exportarPDF);



function getListValorizacionTransportista(transportista_id) {
    endpoint = getDomain() + "/Valorizacion/listarValorizacionTransportista";

    console.log("Enviando datos:", { transportista_id });

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ transportista_id: transportista_id }),
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("Cargando...");
            },
            success: function (data) {
                var valorizacion = data.item3;
                var datosRow = "";
                console.log(valorizacion);

                for (var i = 0; i < valorizacion.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-valorizacion_id='" + formatDateString(valorizacion[i].valorizacion_id) + "'>" +
                        "<td>" + valorizacion[i].valorizacion_id + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_codigo + "</td>" +
                        "<td>" + valorizacion[i].transportista_nombre + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_monto + "</td>" +
                        "<td id='acciones'>" +
                        `<a href='#' onclick='modalConfirmacionEliminarValorizacion(${valorizacion[i].valorizacion_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>` +
                        `<i class='bx bx-detail detalle-valorizacion icon-circle' id='detalle_valorizacion" + i + "' onclick='modalDetalleValorizacion(${valorizacion[i].valorizacion_id})'></i>` +
                        "</td>" +
                        "</tr>";
                }

                if ($.fn.DataTable.isDataTable("#table_empresa")) {
                    // Destruir la instancia existente de DataTable
                    $("#table_empresa").DataTable().destroy();
                }

                tableFactura = $("#table_empresa").DataTable({
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
                    },
                    dom: 'frtip',
                    buttons: [
                        {
                            extend: 'excel',
                            className: 'btn_export_Excel',
                            exportOptions: {
                                columns: ':visible:not(:last-child, :nth-last-child(2))' // Oculta la penúltima y la última columna en la exportación a Excel
                            }
                        },
                        {
                            extend: 'pdf',
                            className: 'btn_export_Pdf',
                            exportOptions: {
                                columns: ':visible:not(:last-child, :nth-last-child(2))' // Oculta la penúltima y la última columna en la exportación a Excel
                            }
                        }
                    ],
                    colResize: {
                        tableWidthFixed: 'false'
                    },
                    colReorder: true
                });

                tableFactura.clear();
                tableFactura.rows.add($(datosRow)).draw();
                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error:", textStatus, errorThrown);
                Swal.close();
                alert('Error fatal: ' + textStatus + ' - ' + errorThrown);
                reject(errorThrown);
            }
        });
    });
}
