﻿var consult = false;
var tableEmpresa;

$(document).ready(function () {
    consult = false;
    TransportistaSelect("#input_transportista");
    agregarBotonesExportacionExcel("#table_guia");
    getListGuia();
    initTransportistaSelect();
    $(document).on('change', '.status3', function () {
        var documentoId = $(this).data('empresa_status');
        alterDocumentoStatus(documentoId);
    });

    $("#btnConsultar").click(function () {
        capturarValoresSeleccionados("#tb_guia");
    });
});

function EmpresaSelect(empresaSelecionada) {
    var endpoint = getDomain() + "/Empresa/EmpresaSelect";

    $.ajax({
        type: "GET",
        url: endpoint,
        dataType: "json",
        success: function (data) {
            var EmpresaSelect = data.item3;

            $(empresaSelecionada).empty().append('<option value="" disabled selected>Seleccione una empresa...</option>');

            if (EmpresaSelect && EmpresaSelect.length > 0) {
                EmpresaSelect.forEach(function (item) {
                    $(empresaSelecionada).append(
                        $('<option>', {
                            value: item.empresa_id,
                            text: item.empresa_name
                        })
                    );
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en EmpresaSelect:', error);
            Swal.fire('Error', 'No se pudo cargar la lista de empresas', 'error');
        }
    });
}

function TransportistaSelect(id_transportista) {
    var endpoint = getDomain() + "/Transportista/TransportistaSelect";

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

            // Solo destruye Select2 si está inicializado
            if ($.fn.select2 && $(id_transportista).data('select2')) {
                $(id_transportista).select2('destroy');
            }

            // Inicializar Select2
            $(id_transportista).select2({
                placeholder: "Seleccione un transportista...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
            });

            // Limpiar el select antes de añadir nuevas opciones
            $(id_transportista).empty();
            $(id_transportista).append('<option value="" disabled selected>Seleccione un transportista...</option>');

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (TransportistaSelect && TransportistaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < TransportistaSelect.length; i++) {
                    var item = TransportistaSelect[i];
                    $(id_transportista).append(
                        '<option value="' + item.transportista_id + '">' + item.transportista_nombre + '</option>'
                    );
                }
            } else {
                $(id_transportista).append(new Option("No hay transportistas disponibles", ""));
            }

            // Habilitar el select
            $(id_transportista).prop("disabled", false);
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al cargar transportistas:", textStatus, errorThrown);
            alert('Error al cargar transportistas: ' + textStatus);
        }
    });
}


function initTransportistaSelect() {
    TransportistaSelect("#input_transportista");
}


function obtenerIdEmpresaSeleccionada(empresaSelecionada) {
    return $(empresaSelecionada).val();
}

function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(function () {
        Swal.fire({
            title: 'Enlace copiado con éxito',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    }).catch(function (err) {
        console.error('Error al copiar texto: ', err);
        Swal.fire('Error', 'No se pudo copiar el enlace', 'error');
    });
}

function formatDateString(dateString) {
    if (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
}

function getListGuia() {
    var endpoint = getDomain() + "/Guia/ListaGuia";

    $.ajax({
        type: "GET",
        //async: true,
        url: endpoint,
        dataType: "json",
        success: function (data) {
            console.log(data)
            var guia = data.item3;
            var datosRow = "";
            console.log(datosRow);

            for (var i = 0; i < guia.length; i++) {
                datosRow +=
                    "<tr class='filaTabla' " +
                    "data-guia_id='" + formatDateString(guia[i].guia_id) + "'>" + // Corregido aquí
                    "<td>" + guia[i].guia_fecha_servicio + "</td>" +
                    "<td>" + guia[i].guia_numero + "</td>" +
                    "<td>" + guia[i].guia_descarga + "</td>" +
                    "<td>" + guia[i].empresa_name + "</td>" +
                    "<td>" + guia[i].transportista_nombre + "</td>" +
                    "<td>" + guia[i].empresa_ruc + "</td>" +
                    "<td>" + guia[i].guia_direccion + "</td>" +
                    "<td>" + guia[i].guia_cantidad + "</td>" +
                    "<td>" + guia[i].guia_unidad + "</td>" +
                    "<td>" + guia[i].guia_status + "</td>" +
                    `<td><a href='#' onclick='mostrarPDFEnModal(${guia[i].documento_id})'><span class='icon-circle'><i class="bx bxs-file-pdf"></i></span></a></td>` +
                    "<td id='acciones'>" +
                    `<a href='#' onclick='modalConfirmacionEliminarGuia(${guia[i].guia_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>` +
                    `<a href='/api/Documento/ObtenerDocumento/${guia[i].documento_id}'><span class='icon-circle green'><i class="bx bxs-download"></i></span></a>` +
                    `<a href='#' onclick="copiarTexto('${getDomain()}${abrirEnlaceEnVentana(guia[i].documento_id)}')"><span class='icon-circle black'><i class="bx bxs-share-alt"></i></span></a>` +
                    "</td>" +
                    "</tr>";
            }


            if (!$("#tb_guia").hasClass("dataTable")) {
                if ($.fn.DataTable.isDataTable("#table_guia")) {
                    $("#table_guia").DataTable().destroy(); // Destruye la instancia anterior
                }

                tableFactura = $("#table_guia").DataTable({
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
}

function actualizarTablaGuias(dataGuia) {
    var datosRow = dataGuia.map(function (guia) {
        return crearFilaGuia(guia);
    }).join('');

    if (!$.fn.DataTable.isDataTable("#table_guia")) {
        inicializarTablaGuias();
    }

    tableGuia.clear().rows.add($(datosRow)).draw();
}

function crearFilaGuia(guia) {
    var fechaDescarga = formatDateString(guia.guia_fecha_servicio);
    var guiaNumero = guia.guia_numero;
    var descarga = guia.guia_descarga;
    var cliente = guia.empresa_name;
    var transportista = guia.transportista_nombre;
    var ruc = guia.empresa_ruc;
    var direccion = guia.guia_direccion;
    var cantidad = guia.guia_cantidad;
    var unidadMedida = guia.guia_unidad;
    var guiaStatus = guia.guia_status;

    return `<tr class='filaTabla' data-guia_id='${guia.guia_id}'>
        <td>${fechaDescarga}</td>
        <td>${guiaNumero}</td>
        <td>${descarga}</td>
        <td>${transportista}</td>
        <td>${cliente}</td>
        <td>${ruc}</td>
        <td>${direccion}</td>
        <td>${cantidad}</td>
        <td>${unidadMedida}</td>
        <td>
            ${guiaStatus === '1' ? 'PAGADO' : 'POR PAGAR'}
        </td>
        <td><a href='#' onclick='mostrarPDFEnModal(${documentoId})'><span class='icon-circle'><i class="bx bxs-file-pdf"></i></span></a></td>
        <td>
            <a href='#' onclick='modalConfirmacionEliminarGuia(${guia.guia_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>
            <a href='/api/Documento/ObtenerDocumento/${documentoId}'><span class='icon-circle green'><i class="bx bxs-download"></i></span></a>
        </td>
    </tr>`;
}

function modalConfirmacionEliminarGuia(guiaId) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Estás segur@?',
        text: "Recuerda que no podrás revertir los cambios. Al eliminar, se borrará la guía permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarGuia(guiaId);
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

// Actualiza la función eliminarGuia para usar el nuevo modal
function eliminarGuia(guiaId) {
    var endpoint = getDomain() + "/Guia/EliminarGuia";

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify({ guia_id: guiaId }),
        success: function (response) {
            if (response.item1 === "0") {
                Swal.fire('Eliminada', response.item2, 'success');
                getListGuia(); // Actualiza la lista de guías
            } else {
                Swal.fire('Error', 'Error al eliminar la guía: ' + response.item2, 'error');
                console.error('Error al eliminar guía:', response.item2);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en eliminarGuia:', xhr.responseText);
            var errorMessage = 'Hubo un problema al eliminar la guía';
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


function inicializarTablaGuias() {
    tableGuia = $("#table_guia").DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
        },
        dom: 'frtip',
        buttons: [
            {
                extend: 'excel',
                className: 'btn_export_Excel',
                exportOptions: {
                    columns: ':visible:not(:last-child, :nth-last-child(1))'
                }
            }
        ],
        colResize: {
            tableWidthFixed: false
        },
        colReorder: true
    });
}


function capturarValoresSeleccionados() {
    var transportista_id = $("#input_transportista").val();
    var estado = $("#input_estado").val();

    console.log("Valores seleccionados:", { transportista_id, estado });

    if (transportista_id) {  // Validamos solo si transportista_id está presente
        // Si el estado tiene valor, llamamos a la función con ambos parámetros
        // Si el estado no está presente, llamamos solo con el transportista_id
        getListGuiaTransportista(transportista_id, estado !== null && estado !== "" ? estado : undefined);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione un transportista.",
        });
    }
}

function getListGuiaTransportista(transportista_id, estado) {
    var endpoint = getDomain() + "/Guia/listarGuiaTransportista";
    console.log("Enviando solicitud a:", endpoint);

    // Crear el objeto de datos
    var data = { transportista_id: transportista_id };

    // Solo agregar 'estado' si está definido y no es nulo o vacío
    if (estado !== undefined && estado !== null && estado !== "") {
        data.guia_status = estado; // Se agrega el estado solo si tiene un valor
    }

    console.log("Datos enviados:", data);

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify(data),  // Enviar solo los datos necesarios
        dataType: "json",
        success: function (data) {
            console.log("Respuesta recibida:", data);
            if (data && data.item1 === "0") {
                consult = true;
                if (data.item3.length === 0) {
                    // No hay guías, mostrar mensaje al usuario
                    Swal.fire('Información', data.item2, 'info');
                    // Limpiar la tabla o mostrar un mensaje en ella
                    $("#table_guia").DataTable().clear().draw();
                } else {
                    var guia = data.item3;
                    var datosRow = "";
                    console.log(datosRow);

                    for (var i = 0; i < guia.length; i++) {
                        datosRow +=
                            "<tr class='filaTabla' " +
                            "data-guia_id='" + formatDateString(guia[i].guia_id) + "'>" + // Corregido aquí
                            "<td>" + guia[i].guia_fecha_servicio + "</td>" +
                            "<td>" + guia[i].guia_numero + "</td>" +
                            "<td>" + guia[i].guia_descarga + "</td>" +
                            "<td>" + guia[i].empresa_name + "</td>" +
                            "<td>" + guia[i].transportista_nombre + "</td>" +
                            "<td>" + guia[i].empresa_ruc + "</td>" +
                            "<td>" + guia[i].guia_direccion + "</td>" +
                            "<td>" + guia[i].guia_cantidad + "</td>" +
                            "<td>" + guia[i].guia_unidad + "</td>" +
                            "<td>" + guia[i].guia_status + "</td>" +
                            `<td><a href='#' onclick='mostrarPDFEnModal(${guia[i].documento_id})'><span class='icon-circle'><i class="bx bxs-file-pdf"></i></span></a></td>` +
                            "<td id='acciones'>" +
                            `<a href='#' onclick='modalConfirmacionEliminarGuia(${guia[i].guia_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>` +
                            `<a href='/api/Documento/ObtenerDocumento/${guia[i].documento_id}'><span class='icon-circle green'><i class="bx bxs-download"></i></span></a>` +
                            `<a href='#' onclick="copiarTexto('${getDomain()}${abrirEnlaceEnVentana(guia[i].documento_id)}')"><span class='icon-circle black'><i class="bx bxs-share-alt"></i></span></a>` +
                            "</td>" +
                            "</tr>";
                    }

                    if (!$("#tb_guia").hasClass("dataTable")) {
                        if ($.fn.DataTable.isDataTable("#table_guia")) {
                            $("#table_guia").DataTable().destroy(); // Destruye la instancia anterior
                        }

                        tableFactura = $("#table_guia").DataTable({
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
                }
            } else {
                var errorMessage = data && data.item2 ? data.item2 : "Error desconocido al obtener las guías";
                console.error("Error en la respuesta:", errorMessage);
                Swal.fire('Error', errorMessage, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en getListGuiaTransportista:', { status, error, responseText: xhr.responseText });
            var errorMessage = "No se pudo obtener la lista de guías filtrada";
            try {
                var responseJson = JSON.parse(xhr.responseText);
                if (responseJson && responseJson.item2) {
                    errorMessage = responseJson.item2;
                }
            } catch (e) {
                console.error("Error al parsear la respuesta:", e);
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}


function alterDocumentoStatus(documento_id) {
    var endpoint = getDomain() + "/Repositorio/alterDocumentoStatus";

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify({ documento_id: documento_id }),
        dataType: "json",
        success: function (data) {
            if (data.item1 === "0") {
                if (!consult) {
                    getListDocumento();
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.item2,
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en alterDocumentoStatus:', error);
            Swal.fire('Error', 'No se pudo actualizar el estado del documento', 'error');
        }
    });
}

function eliminarDocumento(documento_id) {
    var endpoint = getDomain() + "/Repositorio/EliminarDocumento";

    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: endpoint,
                contentType: "application/json",
                data: JSON.stringify({ documento_id: documento_id }),
                success: function (response) {
                    if (response.item1 === "0") {
                        Swal.fire('Eliminado!', response.item2, 'success');
                        getListDocumento();
                    } else {
                        Swal.fire('Error!', response.item2, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error en eliminarDocumento:', error);
                    Swal.fire('Error!', 'Hubo un problema al eliminar el documento.', 'error');
                }
            });
        }
    });
}

// Nueva función para agregar solo el botón de exportación a Excel
function agregarBotonesExportacionExcel(tablaId) {
    var contenedorBotones = document.getElementById("contenedorBotones");

    // Crear botón de exportación Excel
    var botonExcel = crearBoton(
        "btnExportExcel",
        "btn_export_Excel",
        "M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z",
        "Exportar Excel"
    );

    contenedorBotones.appendChild(botonExcel);

    // Agregar evento al botón de exportación Excel
    botonExcel.addEventListener("click", function () {
        if ($.fn.DataTable.isDataTable(tablaId)) {
            $(tablaId).DataTable().button('.btn_export_Excel').trigger();
        }
    });
}

// Función para crear un botón de exportación (puedes copiarla de config.js)
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

    return boton;
}