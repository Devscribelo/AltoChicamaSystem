$(document).ready(function () {
    getListFactura();
    agregarBotonesExportacion("#table_empresa");
});

function guardarNewFactura() {
    var dataPost = {
        factura_monto: $("#input_factura_monto").val(),
        num_factura: $("#input_factura_numfactura").val(),
        factura_status: factura_status,
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Factura/RegistrarFactura";

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
            $("#btnGuardarEmpresa").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                getListFactura();
                $("#modal_nueva_factura").modal("hide");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: msg,
                });
            }
            $("#btnGuardarEmpresa").prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error!',
                text: 'Error al registrar la factura',
            });
        }
    });
}

function getListFactura() {
    var endpoint = getDomain() + "/Factura/ListaFactura";

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
                var dataFactura = data.item3;
                var datosRow = "";

                for (var i = 0; i < dataFactura.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-id_factura='" + dataFactura[i].id_factura + "' " +
                        "data-factura_monto='" + dataFactura[i].factura_monto + "' " +
                        "data-num_factura='" + dataFactura[i].num_factura + "'" +
                        "data-factura_status='" + dataFactura[i].factura_status + "'>" +
                        "<td>" + dataFactura[i].id_factura + "</td>" +
                        "<td>" + dataFactura[i].factura_monto + "</td>" +
                        "<td>" + dataFactura[i].num_factura + "</td>" +
                        "<td id='acciones'>" +
                        "<i class='bx bx-edit editar-button icon-circle' id='editar_factura" + i + "'></i>" +
                        "<i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' id='eliminar_factura" + i + "'></i>" +
                        "</td>" +
                        "</tr>";
                }

                $(document).on('click', '.editar-button', function () {
                    var rowData = $(this).closest('tr').data();
                    modalEditarFactura(rowData);
                });

                $(document).on('click', '.eliminar-button', function () {
                    var rowData = $(this).closest('tr').data();
                    modalConfirmacionEliminar(rowData.id_factura);
                });

                if (!$("#table_empresa").hasClass("dataTable")) {
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
                                    columns: ':visible:not(:last-child)'
                                }
                            },
                            {
                                extend: 'pdf',
                                className: 'btn_export_Pdf',
                                exportOptions: {
                                    columns: ':visible:not(:last-child)'
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

function vaciarFormFactura() {
    $('#modal_nueva_factura input[type="text"]').val('');
    $('#modal_nueva_factura input[type="number"]').val('');
}

function modalNuevaFactura() {
    vaciarFormFactura();
    $("#modal_nueva_factura").modal("show").css('display', 'flex');

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarNewFactura();
    });
}

function modalConfirmacionEliminar(id_factura) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarFactura(id_factura);
        }
    })
}

function eliminarFactura(id_factura) {
    var dataPost = {
        id_factura: id_factura,
    };

    var endpoint = getDomain() + "/Factura/EliminarFactura";
    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),
        dataType: "json",
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                getListFactura();
                Swal.fire(
                    'Eliminado!',
                    'La factura ha sido eliminada.',
                    'success'
                )
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: msg,
                })
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al eliminar la factura',
            })
        }
    });
}

function modalEditarFactura(rowData) {
    var id_factura = rowData.id_factura;
    var num_factura = rowData.num_factura;

    $("#modal_editar_factura .modal-title").html("Editando Factura: <span style='color: #198754'><strong>" + num_factura + "</strong></span>");

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarEditFactura(id_factura);
    });

    $("#edit_factura_monto").val(rowData.factura_monto);
    $("#edit_factura_numfactura").val(rowData.num_factura);

    $("#modal_editar_factura").modal("show");
}

function alterEmpresaFactura(id_factura) {
    var dataPost = {
        id_factura: id_factura
    };

    var endpoint = getDomain() + "/Factura/AlterFacturaStatus";

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


function guardarEditFactura(id_factura) {
    var dataPost = {
        id_factura: id_factura,
        factura_monto: $("#edit_factura_monto").val(),
        num_factura: $("#edit_factura_numfactura").val(),
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Factura/ModificarFactura";

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
                getListFactura();
                $("#modal_editar_factura").modal("hide");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: msg,
                });
            }
            $("#btnGuardarEditEmpresa").prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error!',
                text: 'Error al modificar la factura',
            });
        }
    });
}