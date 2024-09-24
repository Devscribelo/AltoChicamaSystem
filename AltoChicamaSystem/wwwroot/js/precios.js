$(document).ready(function () {
    consult = false;
    EmpresaSelect("#input_empresa");
    getListDocumento();

    // Llamar a obtenerDeudasEmpresas al cargar la página
    obtenerDeudasEmpresas();
    obtenerGananciasEmpresas();

    // Existing event listeners
    $(document).on('change', '.status3', function () {
        var rowData = $(this).closest('tr').data();
        console.log(rowData);
        alterDocumentoStatus(rowData.documento_id);
    });

    $("#btnConsultar").click(function () {
        capturarValoresSeleccionados();
    });
});



function TransportistaSelect() {
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

    return valorSeleccionadoTransportista;  // Retorna el valor (empresa_id) seleccionado
}

// Llamada inicial para llenar el select de empresas
TransportistaSelect("#input_transportista");

$(document).on('click', '.btnGuardar', function () {
    TransportistaSelect("#input_transportista");
    var transportista_id = $("#input_transportista_id").val();
    guardarDocumento(transportista_id);
});

function obtenerIdEmpresaSeleccionada(empresaSelecionada) {
    // Obtener el valor de la opción seleccionada en el select
    var valorSeleccionado = $(empresaSelecionada).val();

    return valorSeleccionado;  // Retorna el valor (empresa_id) seleccionado
}

function obtenerDeudasEmpresas() {
    var endpoint = "/Repositorio/ObtenerDeudaTotalTransportistas";

    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({}),
        dataType: "json",
        success: function (data) {
            console.log("Respuesta del servidor:", data);

            if (data && data.item3 !== undefined) {
                // Usar toFixed(2) para asegurar dos decimales
                var deudaTotal = parseFloat(data.item3).toFixed(2);
                $("#input_deuda3").val(deudaTotal);
                console.log("Valor asignado a input_deuda3:", deudaTotal);
            } else {
                console.error("La respuesta del servidor no contiene item3:", data);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener deudas empresas:', error);
        }
    });
}

function obtenerGananciasEmpresas() {
    var endpoint = "/Repositorio/ObtenerGananciaTotalTransportistas";

    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({}),
        dataType: "json",
        success: function (data) {
            console.log("Respuesta del servidor:", data);

            if (data && data.item3 !== undefined) {
                // Usar toFixed(2) para asegurar dos decimales
                var deudaTotal = parseFloat(data.item3).toFixed(2);
                $("#input_deuda2").val(deudaTotal);
                console.log("Valor asignado a input_deuda3:", deudaTotal);
            } else {
                console.error("La respuesta del servidor no contiene item3:", data);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener deudas empresas:', error);
        }
    });
}


function obtenerDeudasEmpresa(transportista_id) {
    var dataPost = {
        transportista_id: transportista_id
    };
    var endpoint = "/Repositorio/ObtenerDeudaTransportista"; // Ruta relativa del endpoint

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(dataPost),
            dataType: "json",
            success: function (data) {
                console.log("Respuesta del servidor:", data); // Inspecciona la respuesta completa

                if (data && data.item3 !== undefined && data.item4 !== undefined) {
                    // Asigna la deuda
                    document.getElementById('input_deuda').value = data.item3;

                    // Asigna el nombre del transportista en el label
                    document.getElementById('nombre_transportista').innerText = data.item4;

                    // Muestra el div si aún está oculto
                    document.getElementById('precio_empresa').style.display = 'block';
                } else {
                    console.error('Datos no válidos:', data);
                    alert('Error: datos no válidos recibidos.');
                }
            },

            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Error fatal: ' + error);
                reject(error); // Rechaza la promesa en caso de error
            }
        });
    });
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
        getListDocumentoTransportista(transportista_id, estado);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione una empresa y un estado.",
        });
    }
}


function getListDocumento() {
    const apiUrl = `/api/Documento / ObtenerDocumento /`;
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
                //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";

                resolve(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    let checked = dataEmpresa[i].documento_status === 'True' ? 'checked' : '';
                    let documentoId = dataEmpresa[i].documento_id;

                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + documentoId + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-documento_id='" + documentoId + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        "<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault" + i + "' " + checked + " data-empresa_status='" + documentoId + "'>" +
                        "</div>" +
                        "</td>"
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

                // Agregar evento al checkbox
                $(".status3").on('change', function () {
                    let documentoId = $(this).attr('data-empresa_status');
                    let isChecked = $(this).is(':checked');

                    if (isChecked) {
                        Swal.fire({
                            title: '¿Cancelar la deuda?',
                            text: "¿Está seguro de que quiere cancelar la deuda?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, cancelar',
                            cancelButtonText: 'No, volver',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Lógica para cancelar la deuda
                                console.log("Deuda cancelada para el documento con ID: " + documentoId);
                            } else {
                                // Revertir el checkbox si el usuario cancela la acción
                                $(this).prop('checked', false);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: '¿Agregar deuda?',
                            text: "¿Está seguro de que quiere agregar la deuda?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, agregar',
                            cancelButtonText: 'No, volver',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Lógica para agregar la deuda
                                console.log("Deuda agregada para el documento con ID: " + documentoId);
                            } else {
                                // Revertir el checkbox si el usuario cancela la acción
                                $(this).prop('checked', true);
                            }
                        });
                    }
                });
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure")
            }
        });
    });
}

function getListDocumentoEmpresa(empresa_id, estado) {

    const apiUrl = `/api/Documento / ObtenerDocumento /`;
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
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";
                consult = true;

                resolve(dataEmpresa);
                console.log(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    let checked = dataEmpresa[i].documento_status === 'True' ? 'checked' : '';
                    let documentoId = dataEmpresa[i].documento_id;

                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + documentoId + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-documento_id='" + documentoId + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        "<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault" + i + "' " + checked + " data-empresa_status='" + documentoId + "'>" +
                        "</div>" +
                        "</td>";
                        "</tr>";
                }

                if (!$("#table_empresa").hasClass("dataTable")) {
                    // Inicializar DataTable en la tabla
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

                // Agregar evento al checkbox
                $(".status3").on('change', function () {
                    let documentoId = $(this).attr('data-empresa_status');
                    let isChecked = $(this).is(':checked');

                    if (isChecked) {
                        Swal.fire({
                            title: '¿Cancelar la deuda?',
                            text: "¿Está seguro de que quiere cancelar la deuda?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, cancelar',
                            cancelButtonText: 'No, volver',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Lógica para cancelar la deuda
                                console.log("Deuda cancelada para el documento con ID: " + documentoId);
                            } else {
                                // Revertir el checkbox si el usuario cancela la acción
                                $(this).prop('checked', false);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: '¿Agregar deuda?',
                            text: "¿Está seguro de que quiere agregar la deuda?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, agregar',
                            cancelButtonText: 'No, volver',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Lógica para agregar la deuda
                                console.log("Deuda agregada para el documento con ID: " + documentoId);
                            } else {
                                // Revertir el checkbox si el usuario cancela la acción
                                $(this).prop('checked', true);
                            }
                        });
                    }
                });
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure");
            }
        });
    });
}
function getListDocumentoTransportista(transportista_id, estado) {

    const apiUrl = `/api/Documento/ObtenerDocumento/`;
    endpoint = getDomain() + "/Repositorio/listarDocumentoTransportista";

    return new Promise((resolve, reject) => {

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ transportista_id: transportista_id, estado: estado }), // Serializa ambos parámetros como un objeto
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";
                consult = true;

                resolve(dataEmpresa);
                console.log(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    let checked = dataEmpresa[i].documento_status === 'True' ? 'checked' : '';
                    let documentoId = dataEmpresa[i].documento_id;

                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + documentoId + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-documento_id='" + documentoId + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        "<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault" + i + "' " + checked + " data-empresa_status='" + documentoId + "'>" +
                        "</div>" +
                        "</td>" +
                        "</tr>";
                }

                if (!$("#table_empresa").hasClass("dataTable")) {
                    // Inicializar DataTable en la tabla
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

                // Agregar evento al checkbox
                $(".status3").on('change', function () {
                    let documentoId = $(this).attr('data-empresa_status');
                    let isChecked = $(this).is(':checked');

                    if (isChecked) {
                        Swal.fire({
                            title: '¿Cancelar la deuda?',
                            text: "¿Está seguro de que quiere cancelar la deuda?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, cancelar',
                            cancelButtonText: 'No, volver',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log("Deuda cancelada para el documento con ID: " + documentoId);
                            } else {
                                $(this).prop('checked', false);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: '¿Agregar deuda?',
                            text: "¿Está seguro de que quiere agregar la deuda?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, agregar',
                            cancelButtonText: 'No, volver',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log("Deuda agregada para el documento con ID: " + documentoId);
                            } else {
                                $(this).prop('checked', true);
                            }
                        });
                    }
                });
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure");
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
                    obtenerDeudasEmpresas();
                    obtenerGananciasEmpresas();
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