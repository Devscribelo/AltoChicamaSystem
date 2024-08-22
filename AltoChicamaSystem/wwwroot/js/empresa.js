$(document).ready(function () {
    getListEmpresa();
    agregarBotonesExportacion("#table_empresa");
});

function guardarNewEmpresa() {

    var empresa_status = $("#input_empresa_status_a").is(':checked') ? $("#input_empresa_status_a").val() : $("#input_empresa_status_i").val();

    var dataPost = {
        empresa_name: $("#input_empresa_name").val(),
        empresa_ruc: $("#input_empresa_ruc").val(),
        empresa_correo: $("#input_empresa_correo").val(),
        empresa_status: empresa_status,
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Empresa/RegEmpresa";

    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Guardando...");
            $("#btnGuardarNewEmpresa").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                // Actualizar la tabla sin recargar la página
                getListEmpresa();
                $("#modal_nueva_empresa").modal("hide");
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: msg,
                });
            }
            $("#btnGuardarEditZona").prop("disabled", false);
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
function getListEmpresa() {

    endpoint = getDomain() + "/Empresa/ListaEmpresa"

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
                //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                console.log("cargando");
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";

                resolve(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].empresa_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].empresa_name + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_ruc + "' " +
                        "data-empresa_correo='" + dataEmpresa[i].empresa_correo + "' " +
                        "data-empresa_status='" + dataEmpresa[i].empresa_status + "'>" +
                        "<td>" + dataEmpresa[i].empresa_id + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_ruc + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_correo + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px'; 'margin-top: 4px' !import  class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].empresa_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].empresa_id}'>` +
                        "</div>" +
                        "</td>" +
                        "<td id='acciones'>" +
                        "<i style='color: #FAA716' class='bx bx-edit editar-button' id='editar_zona'></i>" +
                        "<i style='margin-left: 9px; color: red' class='bx bx-trash eliminar-button' id='eliminar_zona'></i>" +
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

function vaciarFormZona() {

    $('#modal_nuevo_zona input[type="text"]').val('');
    $('#modal_nuevo_zona textarea').val('');
    $('#modal_nuevo_zona select').val('');
    $('#modal_nuevo_zona input[type="date"]').val('');
}

function modalNuevaEmpresa() {
    vaciarFormZona();
    $("#modal_nueva_empresa").modal("show").css('display', 'flex');

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarNewEmpresa();
    });
}

function alterEmpresaStatus(empresaId) {
    var dataPost = {
        empresa_id: empresaId
    };

    var endpoint = getDomain() + "/Empresa/AlterEmpresaStatus";

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
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'El estado de la empresa ha sido actualizado.',
                });
                // Actualiza la lista de empresas para reflejar los cambios
                getListEmpresa();
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