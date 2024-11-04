$(document).ready(function () {
    getListFactura();
    initTransportistaSelect();
    agregarBotonesExportacion("#table_empresa");
    obtenerGananciasTransportista();
    obtenerDeudasTransportista();

    // Cuando se cambia el valor del elemento con clase .status3
    $(document).on('change', '.status3', function (e) {
        // Prevent the default checkbox behavior
        e.preventDefault();

        // Store checkbox element
        const checkbox = $(this);

        // Revert checkbox to previous state until confirmation
        checkbox.prop('checked', !checkbox.prop('checked'));

        var rowData = $(this).closest('tr').data();
        modalConfirmacionAlterStatus(rowData.id_factura, checkbox);
    });

    // Cuando se hace clic en el botón de consulta
    $('#btnConsultar').click(function () {
        capturarValoresSeleccionados();
    });

    // Evento para detectar el cambio de valor en #input_transportista_modal
    
    $('#input_transportista_modal').change(function () {
        if ($("#input_transportista_modal").val()) {
            // Llamar a la función GuiaSelect pasando el selector #input_guias_modal
            ValorizacionSelect($("#input_transportista_modal").val(), "#input_valorizacion_modal");
            $('#input_valorizacion_modal').change(function () {
                if ($("#input_valorizacion_modal").val()) {
                    ValorizacionReturn($("#input_valorizacion_modal").val());
                }
            })
            document.getElementById('input_guias_modal').value = '';
            document.getElementById('input_factura_monto').value = '';
        }
        else {
            document.getElementById('input_guias_modal').value = '';
            document.getElementById('input_factura_monto').value = '';
            $("#input_valorizacion_modal").empty();
        }
    });
});


function obtenerGananciasTransportista() {
    var endpoint = getDomain() + "/Factura/listarGananciasTransportistas";

    $.ajax({
        type: "GET",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function () {
            console.log("Cargando ganancias...");
        },
        success: function (data) {
            // Accedemos a Item3 directamente
            var dataGanancias = data.item3; // Asegúrate de que sea Item3

            // Verificamos si la respuesta indica que hay ganancias disponibles
            if (data.Item1 === "0") { // Cambiamos la verificación para usar solo Item1
                $("#input_deuda2").val("S/. 0.00"); // No hay ganancias disponibles
            } else {
                // Si hay datos, convertimos el valor de totalGanancias
                $("#input_deuda2").val("S/. " + parseFloat(dataGanancias).toFixed(2)); // Ganancia Total
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Manejo de errores de la petición
            alert('Error al cargar ganancias: ' + textStatus + ' - ' + errorThrown);
            console.error("Error al cargar ganancias:", textStatus, errorThrown);
        }
    });
}

function modalConfirmacionAlterStatus(data, checkbox) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Estás segur@?',
        text: "Deseas cambiar el estado de esta factura? Este cambio afectará su visibilidad en el sistema.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Toggle checkbox state
            checkbox.prop('checked', !checkbox.prop('checked'));
            // Call status change function
            alterFacturaStatus(data);

            swalWithBootstrapButtons.fire(
                'Estado Actualizado!',
                'El estado fue actualizado correctamente.',
                'success'
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: 'Cancelado',
                text: 'El estado de la factura no ha sido actualizado!',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                reverseButtons: true
            });
        }
    });
}


function obtenerDeudasTransportista() {
    var endpoint = getDomain() + "/Factura/listarDeudasTransportistas";

    $.ajax({
        type: "GET",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function () {
            console.log("Cargando deudas...");
        },
        success: function (data) {
            // Accedemos a Item3 directamente
            var dataDeudas = data.item3; // Asegúrate de que sea Item3

            // Verificamos si la respuesta indica que hay ganancias disponibles
            if (data.Item1 === "0") { // Cambiamos la verificación para usar solo Item1
                $("#input_deuda3").val("S/. 0.00"); // No hay ganancias disponibles
            } else {
                // Si hay datos, convertimos el valor de totalGanancias
                $("#input_deuda3").val("S/. " + parseFloat(dataDeudas).toFixed(2)); // Ganancia Total
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Manejo de errores de la petición
            alert('Error al cargar deudas: ' + textStatus + ' - ' + errorThrown);
            console.error("Error al cargar deudas:", textStatus, errorThrown);
        }
    });
}



function initializeDataTable() {
    if (!$.fn.DataTable.isDataTable("#table_empresa")) {
        $("#table_empresa").DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
            },
            dom: 'frtip',
            buttons: [
                {
                    extend: 'excel',
                    className: 'btn_export_Excel',
                    exportOptions: {
                        columns: ':visible:not(:last-child, :nth-last-child(2))'
                    }
                },
                {
                    extend: 'pdf',
                    className: 'btn_export_Pdf',
                    exportOptions: {
                        columns: ':visible:not(:last-child, :nth-last-child(2))'
                    }
                }
            ],
            colResize: {
                tableWidthFixed: 'false'
            },
            colReorder: true
        });
    }
}


function modalDetalleFactura(id_factura) {
    $("#modal_detalles_guia").modal("show").css('display', 'flex');
    getListFacturaDetail(id_factura);
}

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

function vaciarFormFactura() {
    // Vaciar inputs de tipo texto y número
    $('#modal_nueva_factura input[type="text"]').val('');
    $('#modal_nueva_factura input[type="number"]').val('');

    // Vaciar inputs de tipo fecha
    $('#modal_nueva_factura input[type="date"]').val('');

    // Restablecer el select con clase 'form-select'
    $('.form-select').val(null).trigger('change');  
}

function modalNuevaFactura() {
    vaciarFormFactura();
    initTransportistaSelect2();
    $("#modal_nueva_factura").modal("show").css('display', 'flex');

    // Cargar los transportistas después de que el modal se haya mostrado
    $("#modal_nueva_factura").on('shown.bs.modal', function () {
        TransportistaSelect2("#input_transportista_modal");
    });

    $("form").off("submit").on("submit", function (event) {
        event.preventDefault();
        guardarNewFactura();
    });
}

function initTransportistaSelect2() {
    // Llamada inicial para llenar los select de transportistas
    TransportistaSelect2("#input_transportista");
    TransportistaSelect2("#input_transportista_modal");
    TransportistaSelect2("#input_transportista_modal_edit");

}

function guardarNewFactura() {
    // Obtén el formulario para validarlo
    var form = document.querySelector("#modal_nueva_factura form");

    // Verifica si el formulario es válido
    if (!form.checkValidity()) {
        // Encuentra el primer campo inválido
        var invalidField = form.querySelector(':invalid');

        // Enfoca el primer campo inválido y muestra su mensaje de error
        if (invalidField) {
            invalidField.focus(); // Enfoca el campo inválido
            invalidField.reportValidity(); // Muestra el mensaje de error nativo
        }

        return; // Detiene el envío si no es válido
    }
    var guias = document.getElementById('input_guias_modal');
    console.log(guias.getAttribute('data-id-guia'));

    var dataPost = {
        factura_monto: $("#input_factura_monto").val(),
        num_factura: $("#input_factura_numfactura").val(),
        factura_detraccion: $("#input_factura_detraccion").val(),
        factura_status: '0',
        transportista_id: $("#input_transportista_modal").val(),
        guias_ids: guias.getAttribute('data-id-guia'),
        factura_fecha_pago: $("#fecha").val()
    };

    dataPost = trimJSONFields(dataPost);

    console.log("Datos que se enviarán:", dataPost);

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
                //GuiaSelect("#input_guias_modal");
                obtenerGananciasTransportista();
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

function initTransportistaSelect() {
    // Llamada inicial para llenar los select de transportistas
    TransportistaSelect("#input_transportista");
}

function TransportistaSelect(id_transportista) {
    var endpoint = getDomain() + "/Transportista/TransportistaSelect";

    // Solo destruye Select2 si está inicializado
    if ($.fn.select2 && $(id_transportista).data('select2')) {
        $(id_transportista).select2('destroy');
    }

    // Inicializar Select2 después de destruir la instancia previa
    $(id_transportista).select2({
        placeholder: "Seleccione un transportista...",
        allowClear: true,
        language: "es",
        dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
    });

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

            // Habilitar el select
            $(id_transportista).prop("disabled", false);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar transportistas: ' + textStatus);
            console.error("Error al cargar transportistas:", textStatus, errorThrown);
        }
    });
}

function TransportistaSelect2(selectId) {
    var endpoint = getDomain() + "/Transportista/TransportistaSelect";

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
                console.log("Cargando transportistas...");
            },
            success: function (data) {
                console.log("Datos de transportistas recibidos:", data);

                var TransportistaSelect = data.item3;

                // Destruir Select2 si está inicializado
                if ($.fn.select2 && $(selectId).data('select2')) {
                    $(selectId).select2('destroy');
                }

                // Inicializar Select2
                $(selectId).select2({
                    placeholder: "Seleccione un transportista...",
                    allowClear: true,
                    language: "es",
                    dropdownCssClass: 'limit-dropdown',
                    dropdownParent: $(selectId).closest('.modal-body') // Asegúrate de que este selector sea correcto
                });

                // Limpiar el select y agregar opción por defecto
                $(selectId).empty().append(new Option("Seleccione un transportista...", "", true, true));

                if (TransportistaSelect && TransportistaSelect.length > 0) {
                    TransportistaSelect.forEach(item => {
                        $(selectId).append(new Option(item.transportista_nombre, item.transportista_id));
                    });
                    console.log("Opciones de transportistas cargadas:", TransportistaSelect.length);
                } else {
                    console.log("No se encontraron transportistas.");
                    $(selectId).append(new Option("No hay transportistas disponibles", ""));
                }

                // Habilitar el select
                $(selectId).prop("disabled", false);

                console.log("Select2 inicializado para:", selectId);
                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al cargar transportistas:", textStatus, errorThrown);
                alert('Error al cargar transportistas: ' + textStatus);
                reject(errorThrown);
            }
        });
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

function ValorizacionReturn(valorizacion_id) {
    var endpoint = getDomain() + "/Valorizacion/ValorizacionReturn";

    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ valorizacion_id: valorizacion_id }),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando guías...");
        },
        success: function (data) {
            var valorizacionDatos = data.item3;
            console.log(valorizacionDatos);
            for (var i = 0; i < valorizacionDatos.length; i++) {
                console.log(valorizacionDatos[i].valorizacion_guias);
                console.log(valorizacionDatos[i].valorizacion_numeros);
                console.log(valorizacionDatos[i].valorizacion_monto);
                document.getElementById('input_factura_monto').value = valorizacionDatos[i].valorizacion_monto;
                document.getElementById('input_guias_modal').value = valorizacionDatos[i].valorizacion_numeros
                    .split(',')
                    .map(guia => `GUIA N°${guia.trim()}`) // Agregar "GUIA N°" a cada número
                    .join(', '); // Unir las guías con una coma y un espacio

                document.getElementById('input_guias_modal').setAttribute('data-numero-guia', valorizacionDatos[i].valorizacion_numeros);
                document.getElementById('input_guias_modal').setAttribute('data-id-guia', valorizacionDatos[i].valorizacion_guias);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar valorizaciones: ' + textStatus);
            console.error("Error al cargar valorizaciones:", textStatus, errorThrown);
        }
    });
}

function ValorizacionSelect(transportista_id, selectId) {
    var endpoint = getDomain() + "/Valorizacion/ValorizacionSelect";

    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ transportista_id: transportista_id }),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando guías...");
        },
        success: function (data) {
            var ValorizacionSelect = data.item3;

            // Inicializar o actualizar Select2
            $(selectId).select2({
                placeholder: "Seleccione una valorización...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown', // Añadir la clase para limitar altura
                dropdownParent: $(selectId).closest('.modal-body') // Asegura que el dropdown se muestre correctamente en el modal
            });

            // Limpiar el select y agregar opción por defecto
            $(selectId).empty();
            $(selectId).append('<option value="" disabled selected>Seleccione una valorización...</option>');
            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (ValorizacionSelect && ValorizacionSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < ValorizacionSelect.length; i++) {
                    var item = ValorizacionSelect[i]; 
                    $(selectId).append(new Option(item.valorizacion_codigo, item.valorizacion_id));
                }
            } else {
                console.log("No se encontraron valorizaciones.");
                $(selectId).append(new Option("No hay valorizaciones disponibles", ""));
            }

            // Habilitar el select
            $(selectId).prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar valorizaciones: ' + textStatus);
            console.error("Error al cargar valorizaciones:", textStatus, errorThrown);
        }
    });
}



$(document).on('click', '.btnGuardar', function () {
    TransportistaSelect("#input_transportista");
    var transportista_id = $("#input_transportista_id").val();
    guardarNewFactura(transportista_id);
});

$(document).on('click', '.btnGuardar2', function () {
    guardarEditFactura(transportista_id);
});


function capturarValoresSeleccionados() {
    // Capturar los valores seleccionados
    var transportista_id = $("#input_transportista").val();
    var estado = $("#input_estado").val();
    var transportista_nombre = $("#input_transportista option:selected").text();

    // Validar que ambos valores estén seleccionados
    if (transportista_id && estado !== null) {
        // Llamar a la función para enviar los datos
        getListFacturaTransportista(transportista_id, estado, transportista_nombre);
        obtenerGananciasTransportistaIndividual(transportista_id);
        obtenerDeudasTransportistaIndividual(transportista_id);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione una empresa y un estado.",
        });
    }
}


function getListFacturaTransportista(transportista_id, estado, transportista_nombre) {
    const apiUrl = `/api/Factura/ObtenerDocumento/`;
    endpoint = getDomain() + "/Factura/listarFacturaTransportista";

    console.log("Enviando datos:", { transportista_id, estado });

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
                var dataFactura = data.item3;
                var datosRow = "";

                // Cerrar modal
                $("#resumenCuentasOculto").hide();
                // Mostrar el resumen de cuentas
                $("#resumenCuentas").show(); // Muestra el contenedor

                // Actualiza el encabezado con el nombre del transportista
                $("#nombreTransportista").html(`<span style="font-size: 20px;">Resumen de Cuentas - ${transportista_nombre}</span>`);


                if (data.Item1 === "1") {
                    datosRow += "<tr><td colspan='6' style='text-align:center;'>No hay datos para mostrar</td></tr>";
                } else {
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
                            "<td>" + dataFactura[i].num_factura + "</td>" +
                            "<td>" + dataFactura[i].factura_fecha_pago + "</td>" +
                            "<td>" + dataFactura[i].transportista_nombre + "</td>" +
                            "<td>" + dataFactura[i].factura_monto + "</td>" +
                            "<td>" +
                            "<div class='form-check form-switch'>" +
                            `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataFactura[i].factura_status === 'True' ? 'checked' : ''} data-factura_status='${dataFactura[i].id_factura}'>` +
                            "</div>" +
                            "</td>" +
                            "<td id='acciones'>" +
                            `<i class='bx bx-detail detalle-factura icon-circle' id='detalle_factura" + i + "' onclick='modalDetalleFactura(${dataFactura[i].id_factura})'></i>` +
                            "<i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' id='eliminar_factura" + i + "'></i>" +
                            "</td>" +
                            "</tr>";
                    }
                }

                if ($.fn.DataTable.isDataTable("#table_empresa")) {
                    $("#table_empresa").DataTable().clear().rows.add($(datosRow)).draw();
                } else {
                    $("#table_empresa").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
                        },
                        dom: 'frtip',
                        data: $(datosRow),
                        columns: [
                            { data: 'id_factura' },
                            { data: 'factura_monto' },
                            { data: 'num_factura' },
                            { data: 'transportista_nombre' },
                            { data: 'factura_status' },
                            { data: 'acciones' }
                        ],
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

                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error:", textStatus, errorThrown);
                Swal.close();
                alert('Error fatal: ' + textStatus + ' - ' + errorThrown);
                reject(errorThrown);
            }
        });
    });
}

function obtenerGananciasTransportistaIndividual(transportista_id) {
    var endpoint = getDomain() + "/Factura/listarGananciasTransportistasIndividual"; // Asegúrate de que la ruta sea correcta

    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        data: JSON.stringify({
            transportista_id: transportista_id // Enviar transportista_id al backend
        }),
        beforeSend: function () {
            console.log("Cargando ganancias individuales...");
        },
        success: function (data) {
            // Accedemos a Item3 directamente para las ganancias individuales
            var totalGanancias = data.item3; // Suponiendo que es Item3 el total de ganancias

            // Verificamos si la respuesta indica que hay ganancias disponibles
            if (data.Item1 === "0") { // Cambiamos la verificación para usar solo Item1
                $("#input_ganancia_transportista").val("S/. " + parseFloat(totalGanancias).toFixed(2)); // No hay ganancias disponibles
            } else {
                // Si hay datos, convertimos el valor de totalGanancias
                $("#input_ganancia_transportista").val("S/. " + parseFloat(totalGanancias).toFixed(2)); // Mostrar la ganancia total
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Manejo de errores en la petición
            alert('Error al cargar ganancias: ' + textStatus + ' - ' + errorThrown);
            console.error("Error al cargar ganancias:", textStatus, errorThrown);
        }
    });
}

function obtenerDeudasTransportistaIndividual(transportista_id) {
    var endpoint = getDomain() + "/Factura/listarDeudasTransportistasIndividual"; // Asegúrate de que la ruta sea correcta

    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        data: JSON.stringify({
            transportista_id: transportista_id // Enviar transportista_id al backend
        }),
        beforeSend: function () {
            console.log("Cargando ganancias individuales...");
        },
        success: function (data) {
            // Accedemos a Item3 directamente para las ganancias individuales
            var totalDeudas = data.item3; // Suponiendo que es Item3 el total de ganancias

            // Verificamos si la respuesta indica que hay ganancias disponibles
            if (data.Item1 === "0") { // Cambiamos la verificación para usar solo Item1
                $("#input_deuda_transportista").val("S/. 0.00"); // No hay ganancias disponibles
            } else {
                // Si hay datos, convertimos el valor de totalDeudas
                $("#input_deuda_transportista").val("S/. " + parseFloat(totalDeudas).toFixed(2)); // Mostrar la ganancia total
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Manejo de errores en la petición
            alert('Error al cargar ganancias: ' + textStatus + ' - ' + errorThrown);
            console.error("Error al cargar ganancias:", textStatus, errorThrown);
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
                        "data-factura_status='" + dataFactura[i].factura_status + "'" +
                        "data-transportista_id='" + dataFactura[i].transportista_id + "'" +
                        "data-factura_detraccion='" + dataFactura[i].factura_detraccion + "' " +
                        "data-factura_monto_final='" + dataFactura[i].factura_monto_final + "' " +
                        "data-transportista_nombre='" + dataFactura[i].transportista_nombre + "'>" +
                        "<td>" + dataFactura[i].id_factura + "</td>" +
                        "<td>" + dataFactura[i].num_factura + "</td>" +
                        "<td>" + dataFactura[i].factura_fecha_pago + "</td>" +
                        "<td>" + dataFactura[i].transportista_nombre + "</td>" +
                        "<td>" + dataFactura[i].factura_monto + "</td>" +
                        "<td>" + dataFactura[i].factura_detraccion + "</td>" +
                        "<td>" + dataFactura[i].factura_monto_final + "</td>" +
                        "<td>" +
                        "<div class='form-check form-switch'>" +
                        `<input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' id='flexSwitchCheckDefault${i}' ${dataFactura[i].factura_status === 'True' ? 'checked' : ''} data-factura_status='${dataFactura[i].id_factura}'>` +
                        "</div>" +
                        "</td>" +
                        "<td id='acciones'>" +
                        `<i class='bx bx-detail detalle-factura icon-circle' id='detalle_factura" + i + "' onclick='modalDetalleFactura(${dataFactura[i].id_factura})'></i>` +
                        "<i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' id='eliminar_factura" + i + "'></i>" +
                        "</td>" +
                        "</tr>";
                    }

                    if ($.fn.DataTable.isDataTable("#table_empresa")) {
                        $("#table_empresa").DataTable().clear().rows.add($(datosRow)).draw();
                    } else {
                        initializeDataTable();
                        $("#table_empresa").DataTable().rows.add($(datosRow)).draw();
                    }
    
                    $(document).on('click', '.editar-button', function () {
                        var rowData = $(this).closest('tr').data();
                        modalEditarFactura(rowData);
                    });
    
                    $(document).on('click', '.eliminar-button', function () {
                        var rowData = $(this).closest('tr').data();
                        modalConfirmacionEliminar(rowData.id_factura);
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
function formatearFecha(fechaString) {
    if (!fechaString) return '';

    // Dividir la fecha y hora
    const [fecha, hora] = fechaString.split(' ');

    // Dividir la fecha en día, mes y año
    const [dia, mes, anio] = fecha.split('/');

    // Verificar si tenemos todas las partes necesarias
    if (dia && mes && anio) {
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${anio}`;
    }

    console.error('Formato de fecha inesperado:', fechaString);
    return 'Fecha inválida';
}

function agregarBotonesExportacion1(tablaId) {
    var contenedorBotones = document.getElementById("contenedorBotones1");

    // Comprobar si los botones ya existen antes de agregarlos
    if (contenedorBotones.querySelector("#btnExportExcel1")) {
        return; // Si los botones ya están presentes, no los agregues de nuevo
    }

    // Función para crear un botón de exportación
    function crearBoton(id, clase, svgPath, altText) {
        var boton = document.createElement("button");
        boton.id = id;
        boton.type = "button";
        boton.className = "button " + clase;

        boton.innerHTML = `
            <span class="button__text">${altText}</span>
            <span class="button__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" class="svg">
                    <path d="${svgPath}"></path>
                </svg>
            </span>
        `;

        boton.addEventListener("click", function () {
            // Exportar a Excel o PDF según la clase del botón
            if ($.fn.DataTable.isDataTable(tablaId)) {
                $(tablaId).DataTable().button('.' + clase).trigger();
            }
        });

        return boton;
    }

    // Crear botón de exportación Excel
    contenedorBotones.appendChild(crearBoton(
        "btnExportExcel1",
        "btn_export_Excel",
        "M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z",
        "Exportar Excel"
    ));
}


function getListFacturaDetail(id_factura) {
    agregarBotonesExportacion1("#table_detalles_factura");
    return new Promise((resolve, reject) => {

        const endpoint = getDomain() + "/Guia/ListarGuiaFiltro";

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ id_factura: id_factura }), // Serializa los datos a JSON
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
            },
            success: function (data) {
                console.log(data);
                var dataFactura = data.item3;
                var datosRow = "";

                if (data.Item1 === "1") {
                    datosRow += "<tr><td colspan='6' style='text-align:center;'>No hay datos para mostrar</td></tr>";
                } else {
                    for (var i = 0; i < dataFactura.length; i++) {
                        datosRow +=
                            "<tr class='filaTabla' " +
                            "data-id_guia='" + dataFactura[i].guia_id + "' " +
                            "data-guia_numero='" + dataFactura[i].guia_numero + "' " +
                            "data-guia_descarga='" + dataFactura[i].guia_descarga + "'" +
                            "data-guia_cantidad='" + dataFactura[i].guia_cantidad + "'" +
                            "data-guia_unidad='" + dataFactura[i].guia_unidad + "' " +
                            "data-guia_costo='" + dataFactura[i].guia_costo + "' " +
                            "data-guia_fecha_servicio='" + formatearFecha(dataFactura[i].guia_fecha_servicio) + "' " +
                            "data-transportista_nombre='" + dataFactura[i].transportista_nombre + "'>" +
                            "<td>" + dataFactura[i].guia_id + "</td>" +
                            "<td>" + dataFactura[i].guia_numero + "</td>" +
                            "<td>" + dataFactura[i].guia_descarga + "</td>" +
                            "<td>" + dataFactura[i].guia_cantidad + "</td>" +
                            "<td>" + dataFactura[i].guia_unidad + "</td>" +
                            "<td>" + dataFactura[i].guia_costo + "</td>" +
                            "<td>" + formatearFecha(dataFactura[i].guia_fecha_servicio) + "</td>" +
                            "<td>" + dataFactura[i].transportista_nombre + "</td>"
                    }

                }

                if (!$.fn.DataTable.isDataTable("#table_detalles_factura")) {
                    tableFactura = $("#table_detalles_factura").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
                        },
                        dom: 'frtip',
                        buttons: [
                            {
                                extend: 'excel',
                                className: 'btn_export_Excel',
                            }
                        ],
                        colResize: {
                            tableWidthFixed: 'false'
                        },
                        colReorder: true,
                        searching: false
                    });
                }


                // Limpiar la tabla y agregar las filas
                tableFactura.clear();
                tableFactura.rows.add($(datosRow)).draw();

                resolve(data); // Resuelve la promesa con la respuesta complet
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.close();
                console.log("failure: " + textStatus + " - " + errorThrown);
            }
        });
    });
}

function alterFacturaStatus(id_factura) {
    var transportista_id = $("#input_transportista").val();
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
                if (transportista_id) {
                    obtenerGananciasTransportistaIndividual(transportista_id);
                    obtenerDeudasTransportistaIndividual(transportista_id);
                }

                obtenerGananciasTransportista();
                obtenerDeudasTransportista();
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
                obtenerGananciasTransportista();
                obtenerDeudasTransportista();
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
    console.log("Datos de la fila:", rowData);

    $("#modal_editar_factura .modal-title").html("Editando Factura: <span style='color: #198754'><strong>" + rowData.num_factura + "</strong></span>");

    $("#edit_factura_monto").val(rowData.factura_monto);
    $("#edit_factura_numfactura").val(rowData.num_factura);

    var estado = rowData.factura_status;
    $('#edit_factura_status_a').prop('checked', estado === 'True');
    $('#edit_factura_status_i').prop('checked', estado === 'False');

    try {
        await TransportistaSelect2("#input_transportista_modal_edit");

        $("#modal_editar_factura").modal("show");

        // Usar setTimeout para asegurarse de que el modal esté completamente cargado
        setTimeout(() => {
            console.log("Intentando establecer el valor del transportista:", rowData.transportista_id);
            $("#input_transportista_modal_edit").val(rowData.transportista_id).trigger('change');

            // Verificar si se estableció correctamente
            console.log("Valor actual del select:", $("#input_transportista_modal_edit").val());
        }, 100);
    } catch (error) {
        console.error("Error al cargar los transportistas:", error);
        alert("Error al cargar los transportistas. Por favor, intente de nuevo.");
    }

    $("form").off("submit").one("submit", function (event) {
        event.preventDefault();
        guardarEditFactura(rowData.id_factura);
    });
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
                $("#modal_editar_factura").modal("hide");
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Factura actualizada correctamente',
                }).then(() => {
                    actualizarTablaFacturas();
                    obtenerGananciasTransportista();
                    obtenerDeudasTransportista();
                });
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

function actualizarTablaFacturas() {
    var endpoint = getDomain() + "/Factura/ListaFactura";

    $.ajax({
        type: "GET",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        success: function (data) {
            var dataFactura = data.item3;
            var datosRow = [];

            for (var i = 0; i < dataFactura.length; i++) {
                datosRow.push([
                    dataFactura[i].id_factura,
                    dataFactura[i].num_factura,
                    dataFactura[i].factura_fecha_pago,
                    dataFactura[i].factura_monto,
                    dataFactura[i].transportista_nombre,
                    `<div class='form-check form-switch'>
                        <input style='width: 46px; margin-top: 4px;' class='form-check-input status3' type='checkbox' 
                        id='flexSwitchCheckDefault${dataFactura[i].id_factura}' 
                        ${dataFactura[i].factura_status === 'True' ? 'checked' : ''} 
                        data-factura_status='${dataFactura[i].id_factura}'>
                    </div>`,
                    `<i class='bx bx-detail detalle-factura icon-circle' data-id='${dataFactura[i].id_factura}'></i>
                    <i class='bx bx-edit editar-button icon-circle' data-factura='${JSON.stringify(dataFactura[i])}'></i>
                    <i style='margin-left: 9px;' class='bx bx-trash eliminar-button icon-circle red' data-id='${dataFactura[i].id_factura}'></i>`
                ]);
            }

            var table = $("#table_empresa").DataTable();
            table.clear().rows.add(datosRow).draw();

            // Volver a agregar los event listeners
            agregarEventListeners();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al actualizar la tabla:", textStatus, errorThrown);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la tabla de facturas',
            });
        }
    });
}

function agregarEventListeners() {
    // Event listener para el botón de editar
    $('#table_empresa').off('click', '.editar-button').on('click', '.editar-button', function () {
        var facturaData = JSON.parse($(this).attr('data-factura'));
        modalEditarFactura(facturaData);
    });

    // Event listener para el botón de eliminar
    $('#table_empresa').off('click', '.eliminar-button').on('click', '.eliminar-button', function () {
        var id_factura = $(this).attr('data-id');
        modalConfirmacionEliminar(id_factura);
    });

    // Event listener para el botón de detalle
    $('#table_empresa').off('click', '.detalle-factura').on('click', '.detalle-factura', function () {
        var id_factura = $(this).attr('data-id');
        modalDetalleFactura(id_factura);
    });
}


$(document).ready(function () {
    $('.js-example-basic-multiple').select2({
        placeholder: 'Seleccione un guia...',
        allowClear: true
    });
});


function toggleDetraccionField() {
    const select = document.getElementById("detraccion_select");
    const input = document.getElementById("input_factura_detraccion");

    if (select.value === "si") {
        input.disabled = false; // Habilita el campo de entrada
        input.value = ""; // Limpia el campo si se habilita
    } else if (select.value === "no") {
        input.disabled = true; // Desactiva el campo de entrada
        input.value = "0"; // Asigna 0 si se selecciona "No"
    } else {
        input.disabled = true; // Desactiva el campo de entrada
        input.value = ""; // Limpia el campo si no hay opción seleccionada
    }
}