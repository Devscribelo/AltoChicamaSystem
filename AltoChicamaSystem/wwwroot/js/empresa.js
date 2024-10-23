$(document).ready(function () {
    getListEmpresa();
    agregarBotonesExportacion("#table_empresa");

    // Asignar el event listener fuera de la función getListEmpresa()
    $(document).on('change', '.status3', function () {
        var rowData = $(this).closest('tr').data();
        alterEmpresaStatus(rowData.empresa_id);
    });
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
                    title: 'Ocurrió un error!',
                    text: 'La empresa ya fue registrada',
                });
            }
            $("#btnGuardarEditEmpresa").prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa ya fue registrada',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa ya fue registrada',
                });
            }
        }
    });
}

function getListEmpresa() {
    var endpoint = getDomain() + "/Empresa/ListaEmpresa";

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
                var dataEmpresa = data.item3;
                var datosRow = "";

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
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].empresa_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].empresa_id}'>` +
                        "</div>" +
                        "</td>" +
                        "<td id='acciones'>" +
                        "<i class='bx bx-edit editar-button icon-circle' id='editar_empresa" + i + "'></i>" +
                        "<i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' id='eliminar_empresa" + i + "'></i>" +
                        "</td>" +
                        "</tr>";
                }


                $(document).on('click', '.editar-button', function () {
                    var rowData = $(this).closest('tr').data();
                    modalEditarEmpresa(rowData);
                });

                $(document).on('click', '.eliminar-button', function () {
                    // Obtener los datos de la fila que se va a eliminar
                    var rowData = $(this).closest('tr').data();
                    modalConfirmacionEliminar(rowData.empresa_id);
                });

                // Actualizar la tabla
                if (!$("#table_empresa").hasClass("dataTable")) {
                    // Inicializar DataTable solo si no está ya inicializada
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
                                    columns: ':visible:not(:last-child, :nth-last-child(2))' // Oculta la penúltima y la última columna en la exportación a Excel
                                }
                            },
                            {
                                extend: 'pdf',
                                className: 'btn_export_Pdf',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(2))' // Oculta la penúltima y la última columna en la exportación a PDF
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
                console.log("failure");
            }
        });
    });
}



function vaciarFormEmpresa() {
    $('#modal_nueva_empresa input[type="text"]').val('');
    $('#modal_nueva_empresa input[type="checkbox"]').prop('checked', false);
    $('#modal_nueva_empresa textarea').val('');
    $('#modal_nueva_empresa select').val('');
    $('#modal_nueva_empresa input[type="email"]').val(''); // Limpia el campo de correo electrónico
}

function modalNuevaEmpresa() {
    vaciarFormEmpresa();
    $("#modal_nueva_empresa").modal("show").css('display', 'flex');

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarNewEmpresa();
    });
}

function modalConfirmacionEliminar(data) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Estas segur@? ',
        text: "Recuerda que no podrás revertir los cambios! Ya que al eliminar, eliminaras la empresa y todos sus documentos asociados, te recomendamos desactivar la empresa en Status para mantener sus documentos en el repositorio",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, elimina!',
        cancelButtonText: 'No, cancela!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarEmpresa(data),
                swalWithBootstrapButtons.fire(
                    'Eliminado!',
                    'la empresa fue eliminado.',
                    'success'
                )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: 'Cancelado',
                text: 'La empresa y sus documentos siguen almacenados',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    // Vuelve a mostrar el primer modal si hace clic en "Volver a confirmar"
                    modalConfirmacionEliminar(data);
                }
            });
        }
    });
}
function eliminarEmpresa(data) {
    var empresa_id = data.toString();

    var dataPost = {
        empresa_id: empresa_id,
    };

    var endpoint = getDomain() + "/Empresa/DelEmpresa";
    $.ajax({
        type: "POST", // Cambia el método HTTP según tu configuración
        url: endpoint, // Cambia la URL a la que enviar la solicitud
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),
        dataType: "json",
        success: function (data) {
            // Llama al actuador para eliminar la fila si la eliminación fue exitosa
            var rpta = data.item1; // Cambio aquí
            var msg = data.item2; // Cambio aquí
            if (rpta == "0") {
                getListEmpresa();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: msg,
                })
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

function modalEditarEmpresa(rowData) {

    // Obtenemos el código de la empresa seleccionada desde los datos de la fila
    var empresa_id = rowData.empresa_id;
    var empresa_name = rowData.empresa_name;

    // Seteamos el título del modal con el código de la empresa
    $("#modal_editar_empresa .modal-title").html("Editando Empresa: <span style='color: #198754'><strong>" + empresa_name + "</strong></span>");

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault(); // Evita (recargar la página)
        guardarEditEmpresa(empresa_id);
    });

    // Seteamos los valores de los inputs con la información de la fila seleccionada
    $("#edit_empresa_name").val(rowData.empresa_name);
    $("#edit_empresa_ruc").val(rowData.empresa_ruc);
    $("#edit_empresa_correo").val(rowData.empresa_correo);

    var estado = rowData.empresa_status;

    $('#edit_empresa_status_a').prop('checked', estado === 'True');
    $('#edit_empresa_status_i').prop('checked', estado === 'False');

    // Mostramos el modal
    $("#modal_editar_empresa").modal("show");
}

function alterEmpresaStatus(empresa_id) {
    var dataPost = {
        empresa_id: empresa_id
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

function guardarEditEmpresa(empresa_id) {

    var empresa_status;
    if ($('#edit_empresa_status_a').is(':checked')) {
        empresa_status = $("#edit_empresa_status_a").val();
    } else {
        empresa_status = $("#edit_empresa_status_i").val();
    }

    var dataPost = {
        empresa_id: empresa_id.toString(),
        empresa_name: $("#edit_empresa_name").val(),
        empresa_ruc: $("#edit_empresa_ruc").val(),
        empresa_correo: $("#edit_empresa_correo").val(),
        empresa_status: empresa_status
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Empresa/modEmpresa";

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
            $("#btnGuardarEditEmpresa").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                getListEmpresa();
                $("#modal_editar_empresa").modal("hide");
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa o el usuario ya fueron registrados',
                });
            }
            $("#btnGuardarEditZona").prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa o el usuario ya fueron registrados',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa o el usuario ya fueron registrados',
                });
            }
        }
    });
}


function guardarNewTransportista() {
    var dataPost = {
        transportista_ruc:"21239421",
        transportista_nombre: "RamosExpress",
        empresa_id: '1023' // Asegúrate de tener un select para la empresa
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Transportista/RegTransportista";

    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Guardando transportista...");
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                // Si es exitoso, recarga la lista o actualiza la interfaz
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
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

function getListTransportista() {
    var endpoint = getDomain() + "/Transportista/ListaTransportista";

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
                var dataEmpresa = data.item3;
                var datosRow = "";
                console.log(dataEmpresa);
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure");
            }
        });
    });
}