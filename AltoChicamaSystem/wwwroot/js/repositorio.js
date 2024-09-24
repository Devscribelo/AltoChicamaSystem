﻿var consult = false;
$(document).ready(function () {
    consult = false;
    EmpresaSelect("#input_empresa");
    getListDocumento();
    // Asignar el event listener fuera de la función getListEmpresa()
    $(document).on('change', '.status3', function () {
        var rowData = $(this).closest('tr').data();
        console.log(rowData);
        alterDocumentoStatus(rowData.documento_id);
    });

    // Manejar el evento de clic en el botón "Consultar"
    $("#btnConsultar").click(function () {
        capturarValoresSeleccionados();
    });
});



function EmpresaSelect(empresaSelecionada) {
    var endpoint = getDomain() + "/Empresa/EmpresaSelect";

    $.ajax({
        type: "GET",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("cargando");
        },
        success: function (data) {
            var EmpresaSelect = data.item3;

            // Limpiar el select y agregar opción por defecto
            if (empresaSelecionada === "#input_empresa") {
                $(empresaSelecionada).empty();
                $(empresaSelecionada).append('<option value="" disabled selected>Seleccione una empresa...</option>');
            }

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (EmpresaSelect && EmpresaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < EmpresaSelect.length; i++) {
                    var item = EmpresaSelect[i];
                    $(empresaSelecionada).append(
                        '<option value="' + item.empresa_id + '">' + item.empresa_name + '</option>'
                    );
                }
            }

        },
        error: function (data) {
            alert('Error fatal ' + data);
            console.log("failure");
        }
    });
}

function obtenerIdEmpresaSeleccionada(empresaSelecionada) {
    // Obtener el valor de la opción seleccionada en el select
    var valorSeleccionado = $(empresaSelecionada).val();

    return valorSeleccionado;  // Retorna el valor (empresa_id) seleccionado
}


function copiarTexto(texto) {
    // Crear un elemento de texto temporal
    const tempInput = document.createElement('input');
    // Establecer el valor del elemento de texto al texto a copiar
    tempInput.value = texto;
    // Agregar el elemento al DOM
    document.body.appendChild(tempInput);
    // Seleccionar el texto del elemento
    tempInput.select();
    // Copiar el texto seleccionado al portapapeles
    document.execCommand('copy');
    // Eliminar el elemento del DOM
    document.body.removeChild(tempInput);
    Swal.fire({
        title: 'Enlace copiado con éxito',
        icon: 'success',
        confirmButtonText: 'OK',
    });
}

function formatDateString(dateString) {
    if (dateString) {
        // Asume que el formato de entrada es 'YYYY-MM-DDTHH:MM:SS'
        var dateParts = dateString.split('T')[0].split('-');
        var day = dateParts[2];
        var month = dateParts[1];
        var year = dateParts[0];
        return `${day}-${month}-${year}`;
    }
    return '';
}



function getListDocumento() {

    const apiUrl = `/api/Documento/ObtenerDocumento/`;
    //const x = getDomain() + apiUrl;
    endpoint = getDomain() + "/Repositorio/ListaDocumento"

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
                console.log("cargando");
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";

                resolve(dataEmpresa);
                console.log(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    var fechaServicio = formatDateString(dataEmpresa[i].fecha_servicio);
                    var fechaPago = formatDateString(dataEmpresa[i].fecha_pago);

                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].documento_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-fecha_servicio='" + dataEmpresa[i].fecha_servicio + "'" +
                        "data-fecha_pago='" + dataEmpresa[i].fecha_pago + "'" +
                        "data-documento_deuda='" + dataEmpresa[i].documento_deuda + "'" +
                        "data-documento_id='" + dataEmpresa[i].documento_id + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + fechaServicio + "</td>" +
                        "<td>" + fechaPago + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].documento_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].documento_id}'>` +
                        "</div>" +
                        "</td>" +
                        "<td>" +
                        "<a href='#' onclick='mostrarPDFEnModal(" + dataEmpresa[i].documento_id + ")'>" +
                        "<span class='icon-circle pdf-icon'><i class=\"bx bxs-file-pdf\"></i></span>" +
                        "</a>" +
                        "</td>" +
                        "<td>" +
                        "<div>" +
                        "<a href='#' onclick='eliminarDocumento(" + dataEmpresa[i].documento_id + ")'>" +
                        "<span class='icon-circle red'><i class=\"bx bxs-trash\"></i></span>" +
                        "</a>" +
                        "<a href='" + apiUrl + dataEmpresa[i].documento_id + "'>" +
                        "<span class='icon-circle green'><i class=\"bx bxs-download\"></i></span>" +
                        "</a>" +
                        "<a href='#' onclick=\"copiarTexto('" + getDomain() + abrirEnlaceEnVentana(dataEmpresa[i].documento_id) + "')\">" +
                        "<span class='icon-circle black'><i class=\"bx bxs-share-alt\"></i></span>" +
                        "</a>" +
                        "</div>" +
                        "</td>" +
                        "</tr>";
                }

                if (!$("#table_empresa").hasClass("dataTable")) {
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
                            tableWidthFixed: 'false'
                        },
                        colReorder: true
                    });
                }

                tableEmpresa.clear();
                tableEmpresa.rows.add($(datosRow)).draw();
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure")
            }
        });
    });
}



function capturarValoresSeleccionados() {
    // Capturar los valores seleccionados
    var empresa_id = obtenerIdEmpresaSeleccionada("#input_empresa");
    var estado = $("#input_estado").val();

    // Validar que ambos valores estén seleccionados
    if (empresa_id && estado !== null) {
        // Llamar a la función para enviar los datos
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

    const apiUrl = `/api/Documento/ObtenerDocumento/`;
    //const x = getDomain() + apiUrl;
    endpoint = getDomain() + "/Repositorio/listarDocumentoEmpresa";

    return new Promise((resolve, reject) => {

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ empresa_id: empresa_id, estado: estado }), // Serializa ambos parámetros como un objeto
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
                //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";
                consult = true;

                resolve(dataEmpresa);
                console.log(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    var fechaServicio1 = formatDateString(dataEmpresa[i].fecha_servicio);
                    var fechaPago1 = formatDateString(dataEmpresa[i].fecha_pago);

                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].documento_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-fecha_servicio='" + dataEmpresa[i].fecha_servicio + "'" +
                        "data-fecha_pago='" + dataEmpresa[i].fecha_pago + "'" +
                        "data-documento_deuda='" + dataEmpresa[i].documento_deuda + "'" +
                        "data-documento_id='" + dataEmpresa[i].documento_id + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + fechaServicio1 + "</td>" +
                        "<td>" + fechaPago1 + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].documento_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].documento_id}'>` +
                        "</div>" +
                        "</td>" +
                        "<td>" +
                        "<a href='#' onclick='mostrarPDFEnModal(" + dataEmpresa[i].documento_id + ")'>" +
                        "<span class='icon-circle pdf-icon'><i class=\"bx bxs-file-pdf\"></i></span>" +
                        "</a>" +
                        "</td>" +
                        "<td>" +
                        "<div>" +
                        "<a href='#' onclick='eliminarDocumento(" + dataEmpresa[i].documento_id + ")'>" +
                        "<span class='icon-circle red'><i class=\"bx bxs-trash\"></i></span>" +
                        "</a>" +
                        "<a href='" + apiUrl + dataEmpresa[i].documento_id + "'>" +
                        "<span class='icon-circle green'><i class=\"bx bxs-download\"></i></span>" +
                        "</a>" +
                        "<a href='#' onclick=\"copiarTexto('" + getDomain() + abrirEnlaceEnVentana(dataEmpresa[i].documento_id) + "')\">" +
                        "<span class='icon-circle black'><i class=\"bx bxs-share-alt\"></i></span>" +
                        "</a>" +
                        "</div>" +
                        "</td>" +
                        "</tr>";
                }




                if (!$("#table_empresa").hasClass("dataTable")) {
                    // Inicializar DataTable en la tabla
                    tableEmpresa = $("#table_empresa").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' // URL de la biblioteca de idioma
                        },
                        dom: 'frtip',
                        buttons: [
                            {
                                extend: 'excel',
                                className: 'btn_export_Excel',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(1))' // Oculta la penúltima y la última columna en la exportación a Excel
                                }
                            },
                            {
                                extend: 'pdf',
                                className: 'btn_export_Pdf',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(1))' // Oculta la penúltima y la última columna en la exportación a PDF
                                }
                            }
                        ],
                        colResize: {
                            tableWidthFixed: 'false'
                        },
                        colReorder: true // Activa la funcionalidad de reordenamiento de columnas
                    });
                }

                tableEmpresa.clear();
                tableEmpresa.rows.add($(datosRow)).draw();
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure")
            }
        });


    });

}

function alterDocumentoStatus(documento_id) {
    var dataPost = {
        documento_id: documento_id
    };

    var endpoint = getDomain() + "/Repositorio/alterDocumentoStatus";

    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),
        dataType: "json",
        beforeSend: function () {
            console.log("Actualizando estado...");
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                if (consult != true) {
                    getListDocumento();
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: msg,
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                alert("Ocurrió un fallo: " + jqXHR.responseJSON.message);
            } else {
                alert("Ocurrió un fallo: " + errorThrown);
            }
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
                data: JSON.stringify({ documento_id: documento_id }),  // Asegúrate de que el nombre del parámetro sea correcto
                contentType: "application/json",
                success: function (response) {
                    if (response.item1 === "0") {
                        Swal.fire(
                            'Eliminado!',
                            response.item2,
                            'success'
                        );
                        getListDocumento(); // Recarga la lista de documentos
                    } else {
                        Swal.fire('Error!', response.item2, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire('Error!', 'Hubo un problema al eliminar el documento.', 'error');
                }
            });
        }
    });
}