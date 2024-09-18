$(document).ready(function () {
    getListTransportista();
});

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
                        "data-transportista_id='" + dataEmpresa[i].transportista_id + "' " +
                        "data-transportista_ruc='" + dataEmpresa[i].transportista_ruc + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "'>" +
                        "<td>" + dataEmpresa[i].transportista_id + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_ruc + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td id='acciones'>" +
                        "<i class='bx bx-edit editar-button icon-circle' id='editar_transportista" + i + "'></i>" +
                        "<i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' id='eliminar_transportista" + i + "'></i>" +
                        "</td>" +
                        "</tr>";
                }

                $(document).on('click', '.editar-button', function () {
                    var rowData = $(this).closest('tr').data();
                    modalEditarTransportista(rowData);
                });

                $(document).on('click', '.eliminar-button', function () {
                    // Obtener los datos de la fila que se va a eliminar
                    var rowData = $(this).closest('tr').data();
                    modalConfirmacionEliminarTransportista(rowData.transportista_id);
                });


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

function vaciarFormEmpresa() {
    $('#modal_nuevo_transportista input[type="text"]').val('');
    $('#modal_nuevo_transportista input[type="checkbox"]').prop('checked', false);
    $('#modal_nuevo_transportista textarea').val('');
    $('#modal_nuevo_transportista select').val('');
    $('#modal_nuevo_transportista input[type="email"]').val(''); // Limpia el campo de correo electrónico
}

function modalNuevoTransportista() {
    vaciarFormEmpresa();
    $("#modal_nuevo_transportista").modal("show").css('display', 'flex');

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarNewTransportista();
    });
}

function guardarNewTransportista() {

    var dataPost = {
        transportista_nombre: $("#input_transportista_nombre").val(),
        transportista_ruc: $("#input_transportista_ruc").val()
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
            console.log("Guardando...");
            $("#btnGuardarNewEmpresa").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                // Actualizar la tabla sin recargar la página
                getListTransportista();
                $("#modal_nuevo_transportista").modal("hide");
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa o el usuario ya fueron registrados',
                });
            }
            $("#btnGuardarEditTransportista").prop("disabled", false);
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

function modalEditarTransportista(rowData) {

    // Obtenemos el código de la empresa seleccionada desde los datos de la fila
    var transportista_id = rowData.transportista_id;
    var transportista_nombre = rowData.transportista_nombre;

    // Seteamos el título del modal con el código de la empresa
    $("#modal_editar_transportista .modal-title").html("Editando Transportista: <span style='color: #198754'><strong>" + transportista_nombre + "</strong></span>");

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault(); // Evita (recargar la página)
        guardarEditTransportista(transportista_id);
    });

    // Seteamos los valores de los inputs con la información de la fila seleccionada
    $("#edit_transportista_nombre").val(rowData.transportista_nombre);
    $("#edit_transportista_ruc").val(rowData.transportista_ruc);

    // Mostramos el modal
    $("#modal_editar_transportista").modal("show");
}
function guardarEditTransportista(transportista_id) {

    var dataPost = {
        transportista_id: transportista_id.toString(),
        transportista_nombre: $("#edit_transportista_nombre").val(),
        transportista_ruc: $("#edit_transportista_ruc").val()
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Transportista/modTransportista";

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
            $("#btnGuardarEditTransportista").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                getListTransportista();
                $("#modal_editar_transportista").modal("hide");
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa o el usuario ya fueron registrados',
                });
            }
            $("#btnGuardarEditTransportista").prop("disabled", false);
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
function modalConfirmacionEliminarTransportista(data) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Estas segur@? ',
        text: "Recuerda que no podrás revertir los cambios!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, elimina!',
        cancelButtonText: 'No, cancela!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarTransportista(data),
                swalWithBootstrapButtons.fire(
                    'Eliminado!',
                    'El transportista fue eliminado.',
                    'success'
                )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'El transportista y sus documentos siguen almacenados',
                'error'
            )
        }
    })
}
function eliminarTransportista(data) {
    var transportista_id = data.toString();

    var dataPost = {
        transportista_id: transportista_id,
    };

    var endpoint = getDomain() + "/Transportista/DelTransportista";
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
                getListTransportista();
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
function eliminarTransportista2(transportista_id) {
    var endpoint = getDomain() + "/Transportista/DelTransportista";

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
                data: JSON.stringify({ transportista_id: transportista_id }),  // Asegúrate de que el nombre del parámetro sea correcto
                contentType: "application/json",
                success: function (response) {
                    if (response.item1 === "0") {
                        Swal.fire(
                            'Eliminado!',
                            response.item2,
                            'success'
                        );
                        getListTransportista(); // Recarga la lista de documentos
                    } else {
                        Swal.fire('Error!', response.item2, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire('Error!', 'Hubo un problema al eliminar el transportista.', 'error');
                }
            });
        }
    });
}