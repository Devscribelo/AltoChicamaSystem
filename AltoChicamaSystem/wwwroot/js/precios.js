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
            console.log("cargando");
        },
        success: function (data) {
            var TransportistaSelect = data.item3;

            // Limpiar el select y agregar opción por defecto
            if (id_transportista === "#input_transportista") {
                $(id_transportista).empty();
                $(id_transportista).append('<option value="" disabled selected>Seleccione un transportista...</option>');
            }

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (TransportistaSelect && TransportistaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < TransportistaSelect.length; i++) {
                    var item = TransportistaSelect[i];
                    $(id_transportista).append(
                        '<option value="' + item.transportista_id + '">' + item.transportista_nombre + '</option>'
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
                console.log(data.item3);
                document.getElementById('input_deuda').value = data.item3;

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
                //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";

                resolve(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].documento_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-documento_id='" + dataEmpresa[i].documento_id + "'>" +
                        "data-documento_precio='" + dataEmpresa[i].documento_deuda + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].documento_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].documento_id}'>` +
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
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].documento_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-documento_id='" + dataEmpresa[i].documento_id + "'>" +
                        "data-documento_precio='" + dataEmpresa[i].documento_deuda + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].documento_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].documento_id}'>` +
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

function getListDocumentoTransportista(transportista_id, estado) {

    const apiUrl = `/api/Documento/ObtenerDocumento/`;
    //const x = getDomain() + apiUrl;
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
                //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";
                consult = true;

                resolve(dataEmpresa);
                console.log(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].documento_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-transportista_nombre='" + dataEmpresa[i].transportista_nombre + "' " +
                        "data-documento_status='" + dataEmpresa[i].documento_status + "'" +
                        "data-documento_id='" + dataEmpresa[i].documento_id + "'>" +
                        "data-documento_precio='" + dataEmpresa[i].documento_deuda + "'>" +
                        "<td>" + dataEmpresa[i].documento_numero + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td>" + dataEmpresa[i].transportista_nombre + "</td>" +
                        "<td>" + dataEmpresa[i].documento_deuda + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataEmpresa[i].documento_status === 'True' ? 'checked' : ''} data-empresa_status='${dataEmpresa[i].documento_id}'>` +
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