$(document).ready(function () {
    getListFactura();
    agregarBotonesExportacion("#table_empresa");

    $(document).on('change', '.status3', function () {
        var rowData = $(this).closest('tr').data();
        alterFacturaStatus(rowData.id_factura);
    });
    $('#btnConsultar').click(function () {
        // Obtener los valores seleccionados
        var transportistaId = $('#input_transportista').val();
        var facturaStatus = $('#input_estado').val();

        // Llamar a la función getListFacturaTransportista con los valores obtenidos
        getListFacturaTransportista(transportistaId, facturaStatus);
    });
});
function mostrarGuiasSeleccionadas() {
    var guiasSeleccionadas = $("#input_guias_modal").select2('data');
    var guias = "";
    guiasSeleccionadas.forEach(function (guia) {
        if (guias == "") {
            guias = guia.id;
        }
        else {
            guias = guias + "," + guia.id;
        }
    });
    return (guias);
}

function guardarNewFactura() {
    var factura_status = $("#input_factura_status_a").is(':checked') ? $("#input_factura_status_a").val() : $("#input_factura_status_i").val();
    var guias = mostrarGuiasSeleccionadas();

    var dataPost = {
        factura_monto: $("#input_factura_monto").val(),
        num_factura: $("#input_factura_numfactura").val(),
        factura_status: factura_status, // Asegúrate que este valor esté definido antes de usarlo
        transportista_id: $("#input_transportista_modal").val(),
        guias_ids: guias.toString()
    };

    dataPost = trimJSONFields(dataPost);

    console.log("Datos que se enviarán:", dataPost); // Aquí ves qué datos se están enviando

    var endpoint = getDomain() + "/Factura/regFactura";

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
            $("#btnGuardarFactura").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                getListFactura();
                $("#modal_nueva_factura").modal("hide");
                GuiaSelect("#input_guias_modal");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: msg,
                });
            }
            $("#btnGuardarFactura").prop("disabled", false);
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
}

function TransportistaSelect2(selectId) {
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
            $(selectId).empty();
            $(selectId).append(new Option("Seleccione un transportista...", "", true, true));

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (TransportistaSelect && TransportistaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < TransportistaSelect.length; i++) {
                    var item = TransportistaSelect[i];
                    $(selectId).append(new Option(item.transportista_nombre, item.transportista_id));
                }
            } else {
                console.log("No se encontraron transportistas.");
                $(selectId).append(new Option("No hay transportistas disponibles", ""));
            }

            // Inicializar o actualizar Select2
            $(selectId).select2({
                placeholder: "Seleccione un transportista...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown', // Añadir la clase para limitar altura
                dropdownParent: $(selectId).closest('.modal-body') // Asegura que el dropdown se muestre correctamente en el modal
            });

            // Habilitar el select
            $(selectId).prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar transportistas: ' + textStatus);
            console.error("Error al cargar transportistas:", textStatus, errorThrown);
        }
    });
}



function obtenerIdTransportistaSeleccionada(id_transportista) {
    // Obtener el valor de la opción seleccionada en el select
    var valorSeleccionadoTransportista = $(id_transportista).val();

    // Mostrar el valor (transportista_id) en la consola
    if (valorSeleccionadoTransportista) {
        console.log("El ID del transportista seleccionada es: " + valorSeleccionadoTransportista);
    } else {
        console.log("No hay ninguna transportista seleccionada.");
    }

    return valorSeleccionadoTransportista;  
}

function GuiaSelect(selectId) {
    var endpoint = getDomain() + "/Guia/GuiaSelect";

    $.ajax({
        type: "GET",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando guías...");
        },
        success: function (data) {
            var GuiaSelect = data.item3;

            // Limpiar el select y agregar opción por defecto
            $(selectId).empty();

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (GuiaSelect && GuiaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < GuiaSelect.length; i++) {
                    var item = GuiaSelect[i];
                    $(selectId).append(new Option(item.guia_numero, item.guia_id));
                }
            } else {
                console.log("No se encontraron guías.");
                $(selectId).append(new Option("No hay guías disponibles", ""));
            }

            // Inicializar o actualizar Select2
            $(selectId).select2({
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown', // Añadir la clase para limitar altura
                dropdownParent: $(selectId).closest('.modal-body') // Asegura que el dropdown se muestre correctamente en el modal
            });

            // Habilitar el select
            $(selectId).prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar guías: ' + textStatus);
            console.error("Error al cargar guías:", textStatus, errorThrown);
        }
    });
}

GuiaSelect("#input_guias_modal");

// Llamada inicial para llenar el select de transportistas
TransportistaSelect2("#input_transportista");
TransportistaSelect2("#input_transportista_modal");
TransportistaSelect("#input_transportista_modal_edit");


$(document).on('click', '.btnGuardar', function () {
    TransportistaSelect("#input_transportista");
    var transportista_id = $("#input_transportista_id").val();
    guardarNewFactura(transportista_id);
});

$(document).on('click', '.btnGuardar2', function () {
    guardarEditFactura(transportista_id);
});

function obtenerIdEmpresaSeleccionada(empresaSelecionada) {
    // Obtener el valor de la opción seleccionada en el select
    var valorSeleccionado = $(empresaSelecionada).val();

    return valorSeleccionado;  // Retorna el valor (empresa_id) seleccionado
}

function capturarValoresSeleccionados() {
    // Capturar los valores seleccionados
    var transportista_id = obtenerIdEmpresaSeleccionada("#input_transportista");
    var estado = $("#input_estado").val();

    // Validar que ambos valores estén seleccionados
    if (transportista_id && estado !== null) {
        if (estado == 0) {
            document.getElementById('precio_empresa').style = "display:block;";
        }
        else {
            document.getElementById('precio_empresa').style = "display:none;";
        }
        // Llamar a la función para enviar los datos
        obtenerDeudasEmpresa(transportista_id);
        getListFacturaTransportista(transportista_id, estado);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione una empresa y un estado.",
        });
    }
}

function getListFacturaTransportista(transportista_id, estado) {
    const apiUrl = `/api/Factura/ObtenerDocumento/`;
    endpoint = getDomain() + "/Factura/listarFacturaTransportista";

    console.log("Enviando datos:", { transportista_id, estado }); // Para depuración

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ transportista_id: transportista_id, estado: estado }),
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("Cargando...");
            },
            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";

                if (data.Item1 === "1") {
                    // Si no hay datos, agregar una fila con el mensaje
                    datosRow += "<tr><td colspan='6' style='text-align:center;'>No hay datos para mostrar</td></tr>";
                } else {
                    for (var i = 0; i < dataEmpresa.length; i++) {
                        datosRow +=
                            "<tr class='filaTabla' " +
                            "data-id_factura='" + dataEmpresa[i].id_factura + "' " +
                            "data-factura_monto='" + dataEmpresa[i].factura_monto + "' " +
                            "data-num_factura='" + dataEmpresa[i].num_factura + "'" +
                            "data-factura_status='" + dataEmpresa[i].factura_status + "' " +
                            "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "'>" +
                            "<td>" + dataEmpresa[i].id_factura + "</td>" +
                            "<td>" + dataEmpresa[i].factura_monto + "</td>" +
                            "<td>" + dataEmpresa[i].num_factura + "</td>" +
                            "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                            "<td>" +
                            "<div class='form-check form-switch'>" +
                            `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].factura_status === 'True' ? 'checked' : ''} data-factura_status='${dataEmpresa[i].id_factura}'>` +
                            "</div>" +
                            "</td>" +
                            "<td id='acciones'>" +
                            "<i class='bx bx-edit editar-button icon-circle' id='editar_factura" + i + "'></i>" +
                            "<i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' id='eliminar_factura" + i + "'></i>" +
                            "</td>" +
                            "</tr>";
                    }
                }

                // Inicializar la tabla si aún no está configurada
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

                // Limpiar la tabla y agregar las filas
                tableFactura.clear();
                tableFactura.rows.add($(datosRow)).draw();

                resolve(data); // Resuelve la promesa con la respuesta completa
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error:", textStatus, errorThrown);
                Swal.close();
                alert('Error fatal: ' + textStatus + ' - ' + errorThrown);
                reject(errorThrown); // Rechaza la promesa con el error
            }
        });
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
                        "data-factura_status='" + dataFactura[i].factura_status + "'" +
                        "data-transportista_id='" + dataFactura[i].transportista_id + "'" +
                        "data-transportista_nombre='" + dataFactura[i].transportista_nombre + "'>" +
                        "<td>" + dataFactura[i].id_factura + "</td>" +
                        "<td>" + dataFactura[i].factura_monto + "</td>" +
                        "<td>" + dataFactura[i].num_factura + "</td>" +
                        "<td>" + dataFactura[i].transportista_nombre + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataFactura[i].factura_status === 'True' ? 'checked' : ''} data-factura_status='${dataFactura[i].id_factura}'>` +
                        "</div>" +
                        "</td>" +
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

function alterFacturaStatus(id_factura) {
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
function vaciarFormFactura() {
    $('#modal_nueva_factura input[type="text"]').val('');
    $('#modal_nueva_factura input[type="number"]').val('');
}

function modalNuevaFactura() {
    vaciarFormFactura();
    $("#modal_nueva_factura").modal("show").css('display', 'flex');

    // Cargar los transportistas después de que el modal se haya mostrado
    $("#modal_nueva_factura").on('shown.bs.modal', function () {
        TransportistaSelect2("#input_transportista_modal");
    });

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

async function modalEditarFactura(rowData) {
    $("#modal_editar_factura .modal-title").html("Editando Factura: <span style='color: #198754'><strong>" + rowData.num_factura + "</strong></span>");

    $("#edit_factura_monto").val(rowData.factura_monto);
    $("#edit_factura_numfactura").val(rowData.num_factura);

    var estado = rowData.factura_status;
    $('#edit_factura_status_a').prop('checked', estado === 'True');
    $('#edit_factura_status_i').prop('checked', estado === 'False');

    // Cargar los transportistas después de que el modal se haya mostrado
    $("#modal_editar_factura").on('shown.bs.modal', function () {
        TransportistaSelect2("#input_transportista_modal_edit");
        // Establecer el valor del transportista después de cargar las opciones
        $("#input_transportista_modal_edit").val(rowData.transportista_id).trigger('change');
    });

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarEditFactura(rowData.id_factura);
    });

    $("#modal_editar_factura").modal("show");

    console.log(rowData);
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

    var factura_status;
    if ($('#edit_factura_status_a').is(':checked')) {
        factura_status = $("#edit_factura_status_a").val();
    } else {
        factura_status = $("#edit_factura_status_i").val();
    }

    var dataPost = {
        id_factura: id_factura,
        factura_monto: $("#edit_factura_monto").val(),
        num_factura: $("#edit_factura_numfactura").val(),
        factura_status: factura_status,
        transportista_id: $("#input_transportista_modal_edit").val(),
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Factura/modFactura";

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
            $("#btnGuardarEditFactura").attr("disabled", true);
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
            $("#btnGuardarEditFactura").prop("disabled", false);
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


$(document).ready(function () {
    $('.js-example-basic-multiple').select2({
        placeholder: 'Selecciona las guias.',
        allowClear: true
    });
});