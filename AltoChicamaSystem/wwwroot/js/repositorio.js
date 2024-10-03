﻿var consult = false;
var tableEmpresa;

$(document).ready(function () {
    consult = false;
    TransportistaSelect("#input_transportista");
    getListGuia();

    $(document).on('change', '.status3', function () {
        var documentoId = $(this).data('empresa_status');
        alterDocumentoStatus(documentoId);
    });

    $("#btnConsultar").click(function () {
        capturarValoresSeleccionados();
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

            // Limpiar el select y agregar opción por defecto
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
                console.log("No se encontraron transportistas.");
                $(id_transportista).append(new Option("No hay transportistas disponibles", ""));
            }

            // Inicializar o actualizar Select2
            $(id_transportista).select2({
                placeholder: "Seleccione un transportista...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
            });

            // Habilitar el select
            $(id_transportista).prop("disabled", false);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al cargar transportistas:", textStatus, errorThrown);
            alert('Error al cargar transportistas: ' + textStatus);
        }
    });
}

TransportistaSelect("#input_transportista");

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
        url: endpoint,
        dataType: "json",
        success: function (data) {
            if (data.item1 === "0") {
                actualizarTablaGuias(data.item3);
            } else {
                Swal.fire('Error', data.item2, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en getListGuia:', error);
            Swal.fire('Error', 'No se pudo cargar la lista de guías', 'error');
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
        <td>
            <a href='#' onclick='mostrarPDFEnModal(${guia.guia_id})'>
                <span class='icon-circle'><i class="bx bxs-file-pdf"></i></span>
            </a>
        </td>
        <td>
            <a href='#' onclick='eliminarGuia(${guia.guia_id})'>
                <span class='icon-circle red'><i class="bx bxs-trash"></i></span>
            </a>
            <a href='/api/Guia/ObtenerGuia/${guia.guia_id}'>
                <span class='icon-circle green'><i class="bx bxs-download"></i></span>
            </a>
        </td>
    </tr>`;
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
            },
            {
                extend: 'pdf',
                className: 'btn_export_Pdf',
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

    if (transportista_id && estado !== null) {
        getListGuiaTransportista(transportista_id, estado);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione un transportista y un estado.",
        });
    }
}


function getListGuiaTransportista(transportista_id, estado) {
    var endpoint = getDomain() + "/Guia/listarGuiaTransportista";
    console.log("Enviando solicitud a:", endpoint);
    console.log("Datos enviados:", { transportista_id, estado });

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify({ transportista_id: transportista_id, guia_status: estado }),
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
                    actualizarTablaGuias(data.item3);
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