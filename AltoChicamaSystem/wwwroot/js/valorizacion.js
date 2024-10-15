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
