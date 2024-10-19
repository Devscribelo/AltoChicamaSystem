var consult = false;
var tableEmpresa;

$(document).ready(function () {
    TransportistaSelect("#input_transportista");
    getListValorizacion();
    initTransportistaSelect();
    $('#btnConsultar').click(function () {
        capturarValoresSeleccionados();
    });
});

function capturarValoresSeleccionados() {
    // Capturar los valores seleccionados
    var transportista_id = $("#input_transportista").val();
    var transportista_nombre = $("#input_transportista option:selected").text();

    // Validar que el transportista_id sea válido (no sea vacío, null o undefined)
    if (transportista_id && transportista_id.trim() !== "") {
        // Llamar a la función para enviar los datos
        getListValorizacionTransportista(transportista_id);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Por favor, seleccione un transportista.",
        });
    }
}


function modalDetalleValorizacion(valorizacion_id) {
    $("#modal_detalles_valorizacion").modal("show").css('display', 'flex');
    getListValorizacionDetail2(valorizacion_id);
    getListValorizacionDetail(valorizacion_id);
}

function formatDateString(dateString) {
    if (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
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

    if (contenedorBotones.querySelector("#btnExportExcel1") && contenedorBotones.querySelector("#btnExportPdf1")) {
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
}

function getListValorizacion() {
    var endpoint = getDomain() + "/Valorizacion/ListaValorizacion";

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
                console.log(data)
                var valorizacion = data.item3;
                console.log(valorizacion);
                var datosRow = "";

                for (var i = 0; i < valorizacion.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-valorizacion_id='" + formatDateString(valorizacion[i].valorizacion_id) + "'>" + // Corregido aquí
                        "<td>" + valorizacion[i].valorizacion_id + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_codigo + "</td>" +
                        "<td>" + valorizacion[i].transportista_nombre + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_monto + "</td>" +
                        "<td id='acciones'>" +
                        `<a href='#' onclick='modalConfirmacionEliminarValorizacion(${valorizacion[i].valorizacion_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>` +
                        `<i class='bx bx-detail detalle-valorizacion icon-circle' id='detalle_valorizacion_" + i + "' onclick='modalDetalleValorizacion(${valorizacion[i].valorizacion_id})'></i>`
                    "</td>" +
                        "</tr>";
                }
                if ($.fn.DataTable.isDataTable("#table_empresa")) {
                    // Destruir la instancia existente de DataTable
                    $("#table_empresa").DataTable().destroy();
                }

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

                // Solo destruye Select2 si está inicializado
                if ($.fn.select2 && $(id_transportista).data('select2')) {
                    $(id_transportista).select2('destroy');
                }

                // Inicializar Select2
                $(id_transportista).select2({
                    placeholder: "Seleccione un transportista...",
                    allowClear: true,
                    language: "es",
                    dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
                });

                // Limpiar el select antes de añadir nuevas opciones
                $(id_transportista).empty();
                $(id_transportista).append('<option value="" disabled selected>Seleccione un transportista...</option>');

                // Verificar si la data es null, vacía, o contiene solo espacios en blanco
                if (TransportistaSelect && TransportistaSelect.length > 0) {
                    // Agregar opciones al select
                    for (var i = 0; i < TransportistaSelect.length; i++) {
                        var item = TransportistaSelect[i];
                        $('#input_transportista').append(new Option(item.transportista_nombre, item.transportista_id));

                    }
                } else {
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
    })
}

function initTransportistaSelect() {
    TransportistaSelect("#input_transportista");
}

function modalConfirmacionEliminarValorizacion(valorizacionId) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Estás segur@?',
        text: "Recuerda que no podrás revertir los cambios. Al eliminar, se borrará la valorizacion permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarValorizacion(valorizacionId);
            swalWithBootstrapButtons.fire(
                'Eliminada',
                'La guía ha sido eliminada.',
                'success'
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'La guía no ha sido eliminada',
                'error'
            );
        }
    });
}

function eliminarValorizacion(valorizacionId) {
    var endpoint = getDomain() + "/Valorizacion/EliminarValorizacion";

    $.ajax({
        type: "POST",
        url: endpoint,
        contentType: "application/json",
        data: JSON.stringify({ valorizacion_id: valorizacionId }),
        success: function (response) {
            if (response.item1 === "0") {
                Swal.fire('Eliminada', response.item2, 'success');
                getListValorizacion(); // Actualiza la lista de guías
            } else {
                Swal.fire('Error', 'Error al eliminar la valorizacion: ' + response.item2, 'error');
                console.error('Error al eliminar valorizacion:', response.item2);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en eliminarValorizacion:', xhr.responseText);
            var errorMessage = 'Hubo un problema al eliminar la valorizacion';
            try {
                var response = JSON.parse(xhr.responseText);
                if (response && response.item2) {
                    errorMessage = response.item2;
                }
            } catch (e) {
                console.error('Error al parsear la respuesta:', e);
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}


function getListValorizacionDetail(valorizacion_id) {
    agregarBotonesExportacion1("#table_detail");
    return new Promise((resolve, reject) => {
        const endpoint = getDomain() + "/Valorizacion/ListarValorizacionDetalle";

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ valorizacion_id: valorizacion_id }), // Serializa los datos a JSON
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
            },
            success: function (data) {
                console.log(data);
                var dataValorizacion = data.item3;
                var datosRow = "";

                // Inicializar variables para las sumas
                let totalCantidad = 0;
                let totalCosto = 0;

                if (data.Item1 === "1") {
                    datosRow += "<tr><td colspan='7' style='text-align:center;'>No hay datos para mostrar</td></tr>";
                } else {
                    // Generar filas dinámicamente
                    for (var i = 0; i < dataValorizacion.length; i++) {
                        // Sumar valores a las totales
                        totalCantidad += parseFloat(dataValorizacion[i].guia_cantidad) || 0; // Asegúrate de convertir a número
                        totalCosto += parseFloat(dataValorizacion[i].valorizacion_total) || 0; // Asegúrate de convertir a número

                        datosRow +=
                            "<tr  style='border-top: 1px solid green;' class='filaTabla' " +
                            "data-valorizacion_id='" + dataValorizacion[i].valorizacion_id + "' " +
                            "data-guia_numero='" + dataValorizacion[i].guia_numero + "' " +
                            "data-guia_fecha_servicio='" + formatearFecha(dataValorizacion[i].guia_fecha_servicio) + "' " +
                            "data-guia_descarga='" + dataValorizacion[i].guia_descarga + "'" +
                            "data-guia_cantidad='" + dataValorizacion[i].guia_cantidad + "'" +
                            "data-valorizacion_costotn='" + dataValorizacion[i].guia_costo + "' >" +
                            "<td style='border-right: 1px solid green;'>" + (i + 1) + "</td>" + // Coloca el número de ítem
                            "<td style='border-right: 1px solid green;'>" + dataValorizacion[i].guia_numero + "</td>" +
                            "<td style='border-right: 1px solid green;'>" + formatearFecha(dataValorizacion[i].guia_fecha_servicio) + "</td>" +
                            "<td style='border-right: 1px solid green;'>" + dataValorizacion[i].guia_descarga + "</td>" +
                            "<td style='border-right: 1px solid green;'>" + dataValorizacion[i].guia_cantidad + "</td>" +
                            "<td style='border-right: 1px solid green;'>" + dataValorizacion[i].guia_costo + "</td>" +
                            "<td style='border-right: 1px solid green;'>" + dataValorizacion[i].valorizacion_total + "</td></tr>";
                    }
                }

                // Limpiar y agregar las filas a la tabla directamente
                $("#tb_detalles_valorizacion").empty().append(datosRow);

                // Actualizar los valores de totalCantidad y totalCosto en las celdas de la tabla
                $("#totalCantidadDisplay").text(totalCantidad.toFixed(2));
                $("#totalCostoTotalDisplay").text(totalCosto.toFixed(2));

                // Actualizar subtotal, IGV y precio total
                $("#subtotal").text(totalCosto.toFixed(2)).css("border-bottom", "1px solid green"); // Establecer subtotal igual a totalCostoTotal y aplicar estilo
                const igv = totalCosto * 0.18; // Calcular IGV (18%)
                $("#valorigv").text(igv.toFixed(2)).css("border-bottom", "1px solid green"); // Establecer IGV y aplicar estilo
                const precioTotal = totalCosto + igv; // Calcular precio total
                $("#preciototal").text(precioTotal.toFixed(2)); // Establecer precio total

                resolve(data); // Resuelve la promesa con la respuesta completa
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.close();
                console.log("failure: " + textStatus + " - " + errorThrown);
            }
        });
    });
}





function getListValorizacionDetail2(valorizacion_id) {
    agregarBotonesExportacion1("#table_detail2");
    return new Promise((resolve, reject) => {

        const endpoint = getDomain() + "/Valorizacion/ListarValorizacionDetalle";

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ valorizacion_id: valorizacion_id }), // Serializa los datos a JSON
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
            },
            success: function (data) {
                console.log(data);
                var dataValorizacion = data.item3;
                var datosRowFormatted = "";

                if (data.Item1 === "1") {
                    datosRowFormatted += "<tr><td colspan='2' style='text-align:center; '>No hay datos para mostrar</td></tr>";
                } else {
                    // Solo tomamos el primer valor para mostrar los detalles generales
                    var firstItem = dataValorizacion[0];

                    // Datos únicos
                    datosRowFormatted +=
                        "<tr style='border-bottom: 1px solid green;'>" +
                        "<td style='width: 20 %; font-weight: bold; border-right: 1px solid green; text-align: center; center; font-weight: 600; color: green;'>Código</td>" +
                        "<td style='width: 80 %;'>" +
                        "<span id='codigo' style='display: flex; justify-content: center;'>" + firstItem.valorizacion_id + "</span></td >" +
                        "</tr>" +
                        "<tr style='border-bottom: 1px solid green;'>" +
                        "<td style='width: 20%; font-weight: bold; border-right: 1px solid green; text-align: center; font-weight: 600; color: green;'>Cliente</td>" +
                        "<td style='width: 80 %;'>" +
                        "<span id='cliente' style='display: flex; justify-content: center;'>" + firstItem.guia_numero + "</span></td >" +
                        "</tr>" +
                        "<tr>" +
                        "<td style='width: 20%; font-weight: bold; border-right: 1px solid green; text-align: center; font-weight: 600; color: green;'>RUC</td>" +
                        "<td style='width: 80 %;'>" +
                        "<span id='ruc' style='display: flex; justify-content: center;'>" + firstItem.valorizacion_total + "</span></td >" +
                        "</tr>";


                }

                // Limpiar y agregar las filas a la tabla directamente
                $("#tb_detalles_valorizacion2").empty().append(datosRowFormatted);

                resolve(data); // Resuelve la promesa con la respuesta completa
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.close();
                console.log("failure: " + textStatus + " - " + errorThrown);
            }
        });
    });
}

document.getElementById('downloadPDF').addEventListener('click', async function () {
    try {
        const modalContent = document.getElementById('modal_contenido_valorizacion');
        if (!modalContent) {
            console.error('Modal content not found');
            return;
        }

        // Crear un contenedor temporal
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px'; // Ancho fijo para mantener proporciones
        tempContainer.style.padding = '100px'; // Mantener el padding original
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.boxSizing = 'border-box';
        tempContainer.innerHTML = modalContent.innerHTML;
        document.body.appendChild(tempContainer);

        // Preservar estilos de las tablas
        const tables = tempContainer.getElementsByTagName('table');
        Array.from(tables).forEach(table => {
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.pageBreakInside = 'auto';

            // Preservar bordes y padding de celdas
            const cells = table.getElementsByTagName('td');
            Array.from(cells).forEach(cell => {
                cell.style.padding = '8px';

            });
        });

        // Ajustar las imágenes para mantener proporción
        const images = tempContainer.getElementsByTagName('img');
        Array.from(images).forEach(img => {
            if (img.getAttribute('style') && img.getAttribute('style').includes('width')) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });

        // Esperar a que las imágenes se carguen
        await areImagesLoaded(tempContainer);

        // Configuración de HTML2Canvas
        const canvas = await html2canvas(tempContainer, {
            scale: 3, // Mayor calidad
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            width: 800, // Ancho fijo que coincide con el contenedor
            windowWidth: 800,
            onclone: function (clonedDoc) {
                console.log('Clone created successfully');
            }
        });

        // Crear el PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        // Obtener dimensiones de la página A4 en mm
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Convertir el canvas a imagen
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Calcular dimensiones manteniendo proporción y márgenes
        const margin = 10; // 10mm de margen
        const availableWidth = pageWidth - (2 * margin);
        const imgWidth = availableWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Función para agregar una página
        const addPage = (pageNum) => {
            if (pageNum > 0) {
                doc.addPage();
            }
            return doc.addImage(
                imgData,
                'JPEG',
                margin, // X con margen
                margin, // Y con margen
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );
        };

        // Calcular número de páginas necesarias
        const virtualHeight = imgHeight + (2 * margin);
        const numPages = Math.ceil(virtualHeight / pageHeight);

        // Agregar páginas
        for (let i = 0; i < numPages; i++) {
            addPage(i);
        }

        // Guardar el PDF
        doc.save('detalles_valorizacion.pdf');

        // Limpiar
        document.body.removeChild(tempContainer);

    } catch (error) {
        console.error('Error durante la generación del PDF:', error);
        alert('Hubo un error al generar el PDF. Por favor, revise la consola para más detalles.');
    }
});

// Función auxiliar para verificar si las imágenes están cargadas
function areImagesLoaded(element) {
    return new Promise((resolve) => {
        const images = element.getElementsByTagName('img');
        let loadedImages = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
            resolve(true);
            return;
        }

        Array.from(images).forEach(img => {
            if (img.complete) {
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve(true);
                }
            } else {
                img.onload = () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        resolve(true);
                    }
                };
                img.onerror = () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        resolve(true);
                    }
                };
            }
        });
    });
}

function getListValorizacionTransportista(transportista_id) {
    endpoint = getDomain() + "/Valorizacion/listarValorizacionTransportista";

    console.log("Enviando datos:", { transportista_id });

    return new Promise((resolve, reject) => {
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
                console.log("Cargando...");
            },
            success: function (data) {
                var valorizacion = data.item3;
                var datosRow = "";
                console.log(valorizacion);

                for (var i = 0; i < valorizacion.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-valorizacion_id='" + formatDateString(valorizacion[i].valorizacion_id) + "'>" +
                        "<td>" + valorizacion[i].valorizacion_id + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_codigo + "</td>" +
                        "<td>" + valorizacion[i].transportista_nombre + "</td>" +
                        "<td>" + valorizacion[i].valorizacion_monto + "</td>" +
                        "<td id='acciones'>" +
                        `<a href='#' onclick='modalConfirmacionEliminarValorizacion(${valorizacion[i].valorizacion_id})'><span class='icon-circle red'><i class="bx bxs-trash"></i></span></a>` +
                        `<i class='bx bx-detail detalle-valorizacion icon-circle' id='detalle_valorizacion" + i + "' onclick='modalDetalleValorizacion(${valorizacion[i].valorizacion_id})'></i>` +
                        "</td>" +
                        "</tr>";
                }

                if ($.fn.DataTable.isDataTable("#table_empresa")) {
                    // Destruir la instancia existente de DataTable
                    $("#table_empresa").DataTable().destroy();
                }

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

                tableFactura.clear();
                tableFactura.rows.add($(datosRow)).draw();
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
