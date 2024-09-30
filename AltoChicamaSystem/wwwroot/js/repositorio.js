var consult = false;
var tableEmpresa;

$(document).ready(function () {
    consult = false;
    EmpresaSelect("#input_empresa");
    getListDocumento();

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

function getListDocumento() {
    var endpoint = getDomain() + "/Repositorio/ListaDocumento";

    $.ajax({
        type: "GET",
        url: endpoint,
        dataType: "json",
        success: function (data) {
            if (data.item1 === "0") {
                actualizarTablaDocumentos(data.item3);
            } else {
                Swal.fire('Error', data.item2, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en getListDocumento:', error);
            Swal.fire('Error', 'No se pudo cargar la lista de documentos', 'error');
        }
    });
}

function actualizarTablaDocumentos(dataEmpresa) {
    var datosRow = dataEmpresa.map(function (doc) {
        return crearFilaDocumento(doc);
    }).join('');

    if (!$.fn.DataTable.isDataTable("#table_empresa")) {
        inicializarTablaDocumentos();
    }

    tableEmpresa.clear().rows.add($(datosRow)).draw();
}

function crearFilaDocumento(doc) {
    var fechaServicio = formatDateString(doc.fecha_servicio);
    var fechaPago = formatDateString(doc.fecha_pago);

    return `<tr class='filaTabla' data-documento_id='${doc.documento_id}'>
        <td>${doc.documento_numero}</td>
        <td>${doc.documento_titulo}</td>
        <td>${doc.empresa_name}</td>
        <td>${doc.transportista_nombre}</td>
        <td>${fechaServicio}</td>
        <td>${fechaPago}</td>
        <td>${doc.documento_deuda}</td>
        <td>
            <div class='form-check form-switch'>
                <input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' 
                       ${doc.documento_status === 'True' ? 'checked' : ''} data-empresa_status='${doc.documento_id}'>
            </div>
        </td>
        <td>
            <a href='#' onclick='mostrarPDFEnModal(${doc.documento_id})'>
                <span class='icon-circle pdf-icon'><i class="bx bxs-file-pdf"></i></span>
            </a>
        </td>
        <td>
            <div>
                <a href='#' onclick='eliminarDocumento(${doc.documento_id})'>
                    <span class='icon-circle red'><i class="bx bxs-trash"></i></span>
                </a>
                <a href='/api/Documento/ObtenerDocumento/${doc.documento_id}'>
                    <span class='icon-circle green'><i class="bx bxs-download"></i></span>
                </a>
                <a href='#' onclick="copiarTexto('${getDomain()}${abrirEnlaceEnVentana(doc.documento_id)}')">
                    <span class='icon-circle black'><i class="bx bxs-share-alt"></i></span>
                </a>
            </div>
        </td>
    </tr>`;
}

function inicializarTablaDocumentos() {
    tableEmpresa = $("#table_empresa").DataTable({
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
    var empresa_id = obtenerIdEmpresaSeleccionada("#input_empresa");
    var estado = $("#input_estado").val();

    if (empresa_id && estado !== null) {
        getListDocumentoEmpresa(empresa_id, estado);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione una empresa y un estado.",
        });
    }
}

function getListDocumentoEmpresa(empresa_id, estado) {
    var endpoint = getDomain() + "/Repositorio/listarDocumentoEmpresa";

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify({ empresa_id: empresa_id, documento_status: estado }),
        dataType: "json",
        success: function (data) {
            if (data.item1 === "0") {
                consult = true;
                actualizarTablaDocumentos(data.item3);
            } else {
                Swal.fire('Error', data.item2, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en getListDocumentoEmpresa:', error);
            Swal.fire('Error', 'No se pudo obtener la lista de documentos filtrada', 'error');
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