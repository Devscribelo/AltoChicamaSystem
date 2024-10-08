$(document).ready(function () {
    getListFactura();
    agregarBotonesExportacion("#table_empresa");

});

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

                var dataFactura = [
                    {
                        id_factura: 1,
                        num_factura: "F001",
                        factura_monto: 1000,
                        factura_monto1: 500, // Monto 1 simulado
                        factura_monto2: 500, // Monto 2 simulado
                        factura_status: 'True',
                        transportista_id: 101,
                        transportista_nombre: "Transportista A"
                    },
                    {
                        id_factura: 2,
                        num_factura: "F002",
                        factura_monto: 2000,
                        factura_monto1: 1000, // Monto 1 simulado
                        factura_monto2: 1000, // Monto 2 simulado
                        factura_status: 'False',
                        transportista_id: 102,
                        transportista_nombre: "Transportista B"
                    },
                    {
                        id_factura: 2,
                        num_factura: "F002",
                        factura_monto: 2000,
                        factura_monto1: 1000, // Monto 1 simulado
                        factura_monto2: 1000, // Monto 2 simulado
                        factura_status: 'False',
                        transportista_id: 102,
                        transportista_nombre: "Transportista B"
                    },

                    // Más datos simulados
                ];

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
                        "<td>" + dataFactura[i].num_factura + "</td>" +
                        "<td>" + dataFactura[i].factura_monto + "</td>" +
                        "<td>" + dataFactura[i].factura_monto1 + "</td>" + // Añadido factura_monto1
                        "<td>" + dataFactura[i].factura_monto2 + "</td>" + // Añadido factura_monto2
                        "<td>" + dataFactura[i].transportista_nombre + "</td>" +
                        "<td>" + dataFactura[i].factura_monto2 + "</td>" +
                        "<td id='acciones'>" +
                        `<i class='bx bx-detail detalle-factura icon-circle' id='detalle_factura" + i + "' onclick='modalDetalleFactura(${dataFactura[i].id_factura})'></i>` +
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

                if (!$("#tb_empresa").hasClass("dataTable")) {
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

TransportistaSelect("#input_transportista");
function TransportistaSelect(id_transportista) {
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
                var TransportistaSelect = data.item3;

                
                // Inicializar o actualizar Select2 usando directamente el ID del select
                $('#input_transportista').select2({
                    placeholder: "Seleccione un transportista...",
                    allowClear: true,
                    language: "es",
                    dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
                });

                // Limpiar el select y agregar opción por defecto
                $('#input_transportista').empty();
                $('#input_transportista').append(new Option("Seleccione un transportista...", "", true, true));

                // Verificar si la data es null, vacía, o contiene solo espacios en blanco
                if (TransportistaSelect && TransportistaSelect.length > 0) {
                    // Agregar opciones al select
                    for (var i = 0; i < TransportistaSelect.length; i++) {
                        var item = TransportistaSelect[i];
                        $(id_transportista).append(
                            $('#input_transportista').append(new Option(item.transportista_nombre, item.transportista_id))
                        );
                    }
                } else {
                    console.log("No se encontraron transportistas.");
                    $('#input_transportista').append(new Option("No hay transportistas disponibles", ""));
                    return
                }

                // Habilitar el select
                $('#input_transportista').prop("disabled", false);

                resolve()

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error al cargar transportistas: ' + textStatus);
                console.error("Error al cargar transportistas:", textStatus, errorThrown);
            }
        });
    })
}