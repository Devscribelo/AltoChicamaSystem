// Declara la variable transportista_id globalmente
let transportista_id;

$(document).ready(function () {
    // Inicializa el select de transportistas
    TransportistaSelect("#input_transportista");

    // Agrega un listener para el cambio de transportista
    $('#input_transportista').change(function () {
        // Actualiza la variable global transportista_id con el valor seleccionado
        transportista_id = $(this).val(); // No uses 'const' aquí, ya está declarada globalmente

        // Limpia las filas de la tabla y el select de guías
        limpiarTabla();

        // Llama a GuiaSelect para cargar guías según el transportista seleccionado
        GuiaSelect(transportista_id, "#input_guias_modal_1");
    });
});


function abrirModal() {
    var myModal = new bootstrap.Modal(document.getElementById('modal_nueva_empresa'));
    myModal.show();
    TransportistaSelect("#input_transportista"); // Volver a cargar los transportistas si es necesario
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

            // Solo destruye Select2 si está inicializado
            if ($.fn.select2 && $(id_transportista).data('select2')) {
                $(id_transportista).select2('destroy');
            }

            // Inicializar Select2
            $(id_transportista).select2({
                placeholder: "Seleccione un transportista...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown'
            });

            $(id_transportista).empty();
            $(id_transportista).append('<option value="" disabled selected>Seleccione un transportista...</option>');

            if (TransportistaSelect && TransportistaSelect.length > 0) {
                for (var i = 0; i < TransportistaSelect.length; i++) {
                    var item = TransportistaSelect[i];
                    $(id_transportista).append(
                        '<option value="' + item.transportista_id + '">' + item.transportista_nombre + '</option>'
                    );
                }
            } else {
                $(id_transportista).append(new Option("No hay transportistas disponibles", ""));
            }

            $(id_transportista).prop("disabled", false);
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al cargar transportistas:", textStatus, errorThrown);
            alert('Error al cargar transportistas: ' + textStatus);
        }
    });
}


function GuiaSelect(transportista_id, id_select) {
    // Verificar si el transportista_id es válido
    if (!transportista_id) {
        // Limpiar el select y agregar opción por defecto
        $(id_select).empty();
        $(id_select).append('<option value="" disabled selected>Seleccione un transportista primero...</option>');
        // Deshabilitar el select
        $(id_select).prop("disabled", true);
        return; // Salir de la función si no hay transportista_id
    }

    var endpoint = getDomain() + "/Guia/GuiaSelectFiltrado";

    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ transportista_id: transportista_id }), // Enviar el transportista_id en el cuerpo de la solicitud
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando guías...");
        },
        success: function (data) {
            var GuiaSelectData = data.item3; // Asumimos que data.item3 contiene la lista de guías

            // Limpiar el select y agregar opción por defecto
            $(id_select).empty();
            $(id_select).append('<option value="" disabled selected>Seleccione una guía...</option>');

            // Verificar si la data es válida y contiene elementos
            if (GuiaSelectData && GuiaSelectData.length > 0) {
                // Agregar las opciones al select
                GuiaSelectData.forEach(function (item) {
                    $(id_select).append(
                        '<option value="' + item.guia_id + '">' + item.guia_numero + '</option>'
                    );
                });
            } else {
                console.log("No se encontraron guías.");
                $(id_select).append(new Option("No hay guías disponibles", ""));
            }

            // Verificar si Select2 ya está inicializado antes de destruirlo
            if ($.fn.select2 && $(id_select).data('select2')) {
                $(id_select).select2('destroy');
            }

            // Inicializar Select2
            $(id_select).select2({
                placeholder: "Seleccione una guía...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown' // Clase para limitar la altura
            });

            // Habilitar el select
            $(id_select).prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar guías: ' + textStatus);
            console.error("Error al cargar guías:", textStatus, errorThrown);
        }
    });
}


function limpiarTabla() {
    const tabla = document.querySelector('#input_tabla_valorizacion tbody');
    tabla.innerHTML = ''; // Limpia todas las filas de la tabla
}

function cargarGuiasPorTransportistaYGuia(transportista_id, guia_id, numeroItem) {
    var endpoint = getDomain() + "/Guia/GuiaSelectValorizacion";

    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            transportista_id: transportista_id,
            guia_id: guia_id
        }),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando guía por transportista y guía...");
        },
        success: function (data) {
            var GuiaSelectData = data.item3;

            if (GuiaSelectData && GuiaSelectData.length > 0) {
                // Suponemos que GuiaSelectData[0] tiene los detalles de la guía
                var guiaDetails = GuiaSelectData[0];

                // Formatear la fecha
                var fechaParts = guiaDetails.guia_fecha_servicio.split('/');
                var formattedDate = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`; // 'YYYY-MM-DD'

                // Asignar los valores a los inputs en la fila correspondiente
                $(`#input_tabla_valorizacion tbody tr:nth-child(${numeroItem}) input[type="date"]`).val(formattedDate);

                // Lógica para determinar el tipo de residuo basado en guia_descarga
                var descarga = guiaDetails.guia_descarga;
                var tipoResiduo = descarga; // Valor por defecto

                if (descarga === "Desmedros") {
                    tipoResiduo = "Desmedros (Productos Vencidos)";
                } else if (descarga === "Residuos Orgánicos") {
                    tipoResiduo = "Descarte de espárragos";
                } else if (descarga === "Residuos Inorgánicos") {
                    tipoResiduo = "Residuos Inorgánicos Aprovechables";
                } else if (descarga === "Residuos de Construcción y Demolición") {
                    tipoResiduo = "Escombros no peligrosos";
                } else if (descarga === "Grasas Residuales") {
                    tipoResiduo = "Grasa Residual Doméstica";
                } else if (descarga === "Lodos") {
                    tipoResiduo = "Lodos de PTAR";
                } else if (descarga === "Líquidos Residuales") {
                    tipoResiduo = "Líquidos Residuales";
                } else if (descarga === "Aguas Residuales") {
                    tipoResiduo = "Agua Residual – Tipo Doméstica";
                }

                // Asignar el tipo de residuo formateado al input correspondiente
                $(`#input_tabla_valorizacion tbody tr:nth-child(${numeroItem}) input[placeholder="Tipo"]`).val(tipoResiduo);
                $(`#input_tabla_valorizacion tbody tr:nth-child(${numeroItem}) input[placeholder="Cantidad (TN)"]`).val(guiaDetails.guia_cantidad);

                // Calcular el costo total al llenar la cantidad
                calcularCostoTotal($(`#input_tabla_valorizacion tbody tr:nth-child(${numeroItem}) input[placeholder="Cantidad (TN)"]`)[0]);
            } else {
                console.log("No se encontraron guías.");
                // Manejo si no se encontraron guías
            }

            // Habilitar el select
            $(`#input_guias_modal_${numeroItem}`).prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar guías: ' + textStatus);
            console.error("Error al cargar guías:", textStatus, errorThrown);
        }
    });
}


function agregarFilaValorizacion() {
    const transportistaSeleccionado = $('#input_transportista').val();
    if (!transportistaSeleccionado) {
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error!',
            text: 'Debes seleccionar un transportista antes de agregar una fila.',
        });
        return;
    }

    const tabla = document.querySelector('#input_tabla_valorizacion tbody');
    const nuevaFila = document.createElement('tr');

    const numeroItem = tabla.rows.length + 1;

    nuevaFila.innerHTML = `
        <td class="tabla_valorizacion_th_td">${numeroItem}</td>
        <td class="tabla_valorizacion_th_td">
            <div class="input-group input-group-sm mb-3 flex-column">
                <select class="form-select" id="input_guias_modal_${numeroItem}" required style="width:98% !important;" 
                        onchange="cargarGuiasPorTransportistaYGuia('${transportistaSeleccionado}', this.value, ${numeroItem})">
                    <option value="" disabled selected>Seleccione una guía...</option>
                    <!-- Opciones de guías se cargarán dinámicamente -->
                </select>
            </div>
        </td>
        <td class="tabla_valorizacion_th_td"><input type="date" class="form-control" required></td>
        <td class="tabla_valorizacion_th_td"><input type="text" placeholder="Tipo" class="form-control" required></td>
        <td class="tabla_valorizacion_th_td"><input type="number" placeholder="Cantidad (TN)" class="form-control cantidad" required oninput="calcularCostoTotal(this)"></td>
        <td class="tabla_valorizacion_th_td"><input type="number" placeholder="Costo/TN" class="form-control costo" id="valorizacion_costotn" required oninput="sincronizarCosto(this);calcularCostoTotal(this)"></td>
        <td class="tabla_valorizacion_th_td"><input type="number" placeholder="Costo Total" class="form-control costo-total" readonly></td>
        <td class="estilo-especial">
            <i class="bx bx-trash icon-circle red eliminar_fila" onclick="eliminarFila(this)"></i>
        </td>`;

    tabla.appendChild(nuevaFila);

    // Cargar las guías para el transportista seleccionado en el select
    GuiaSelect(transportistaSeleccionado, `#input_guias_modal_${numeroItem}`);

    actualizarNumeracion();
    sincronizarCostoDeFila();
}


function sincronizarCosto(element) {
    const valorCosto = element.value; // Obtener el valor actual del input
    const inputsCosto = document.querySelectorAll('input[id="valorizacion_costotn"]'); // Seleccionar todos los inputs de costo con el mismo ID

    // Asignar el mismo valor a todos los inputs de costo
    inputsCosto.forEach(input => {
        input.value = valorCosto;
    });
}

function sincronizarCostoDeFila() {
    const costos = document.querySelectorAll('input[id="valorizacion_costotn"]'); // Seleccionar todos los inputs de costo

    // Si hay al menos un input, sincroniza el valor de la primera fila
    if (costos.length > 1) {
        const primerCosto = costos[0].value; // Obtener el valor del primer input
        for (let i = 1; i < costos.length; i++) {
            costos[i].value = primerCosto; // Sincroniza el valor a las demás filas
        }
    }
}

// Función para calcular el costo total
function calcularCostoTotal(input) {
    const fila = input.closest('tr'); // Encuentra la fila más cercana al input
    const cantidadInput = fila.querySelector('.cantidad'); // Encuentra el input de cantidad
    const costoInput = fila.querySelector('.costo'); // Encuentra el input de costo
    const costoTotalInput = fila.querySelector('.costo-total'); // Encuentra el input de costo total

    // Obtiene los valores de cantidad y costo, convierte a número
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const costo = parseFloat(costoInput.value) || 0;

    // Calcula el costo total
    const costoTotal = cantidad * costo;

    // Actualiza el campo de costo total
    costoTotalInput.value = costoTotal.toFixed(2); // Formatea a dos decimales

    // Llama a la función para calcular totales
    calcularTotales();
}

// Función para calcular totales de la tabla
function calcularTotales() {
    const filas = document.querySelectorAll('#input_tabla_valorizacion tbody tr'); // Selecciona todas las filas
    let totalCantidad = 0;
    let totalCostoTotal = 0;

    filas.forEach(fila => {
        const cantidadInput = fila.querySelector('.cantidad');
        const costoTotalInput = fila.querySelector('.costo-total');

        const cantidad = parseFloat(cantidadInput.value) || 0;
        const costoTotal = parseFloat(costoTotalInput.value) || 0;

        totalCantidad += cantidad;
        totalCostoTotal += costoTotal;
    });

    // Actualiza los inputs de total
    document.getElementById('totalCantidad').value = totalCantidad.toFixed(2);
    document.getElementById('totalCostoTotal').value = totalCostoTotal.toFixed(2);

    // Calcular subtotal, IGV y precio total
    const subtotalInput = document.getElementById('subtotal');
    const igvInput = document.getElementById('igv');
    const precioTotalInput = document.getElementById('precio_total');

    subtotalInput.value = totalCostoTotal.toFixed(2); // Actualiza el subtotal

    const igv = totalCostoTotal * 0.18; // Calcula el IGV 18%
    igvInput.value = igv.toFixed(2); // Actualiza el IGV

    const precioTotal = totalCostoTotal + igv; // Suma subtotal e IGV
    precioTotalInput.value = precioTotal.toFixed(2); // Actualiza el precio total
}

// Llama a calcularTotales() en el evento 'input' de los campos de costo y cantidad
document.addEventListener("DOMContentLoaded", function () {
    const cantidadInputs = document.querySelectorAll('.cantidad');
    const costoTotalInputs = document.querySelectorAll('.costo-total');

    cantidadInputs.forEach(input => {
        input.addEventListener('input', calcularTotales);
    });

    costoTotalInputs.forEach(input => {
        input.addEventListener('input', calcularTotales);
    });
});


// Función para eliminar una fila de la tabla
function eliminarFila(element) {
    // Eliminar la fila seleccionada
    const fila = element.closest("tr");
    fila.remove();
    // Recalcular totales después de eliminar la fila
    calcularTotales();
    // Actualizar la numeración de las filas
    actualizarNumeracion();
}


// Función para actualizar la numeración de los ítems
function actualizarNumeracion() {
    const filas = document.querySelectorAll('#input_tabla_valorizacion tbody tr'); // Selecciona todas las filas en el tbody

    filas.forEach((fila, index) => {
        // Asigna el número del ítem según el índice
        fila.querySelector('td:first-child').textContent = index + 1; // +1 para empezar desde 1
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const botonGuardarValorizacion = document.getElementById('guardar_valorizacion');
    if (botonGuardarValorizacion) {
        botonGuardarValorizacion.addEventListener('click', function (event) {
            event.preventDefault(); // Evita el comportamiento por defecto
            capturarDatosValorizacion(transportista_id);
        });
    } else {
        console.error('El botón "guardar_valorizacion" no se encuentra en el DOM.');
    }
});

function capturarGuiasSeleccionadas() {
    let guia_ids = [];

    // Recorremos cada fila de la tabla de valorización
    $('#input_tabla_valorizacion tbody tr').each(function () {
        const guia_id = $(this).find('select').val(); // Obtenemos el valor del select de guías
        if (guia_id) {
            guia_ids.push(guia_id); // Solo añadimos si hay una guía seleccionada
        }
    });

    return guia_ids;
}

async function capturarDatosValorizacion(transportista_id) {
    // Capturar guias seleccionadas
    const guia_ids = capturarGuiasSeleccionadas();  // Nueva función para capturar las guías seleccionadas

    if (guia_ids.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error!',
            text: `Debe seleccionar al menos una guía..`,
        });
        return;
    }

    // Convierte el array de guía IDs en una cadena separada por comas
    const guia_ids_str = guia_ids.join(',');

    const valorizacion_costotn = parseFloat($('#valorizacion_costotn').val());
    const valorizacion_subtotal = parseFloat($('#subtotal').val());
    const valorizacion_igv = parseFloat($('#igv').val());
    const valorizacion_codigo = $('#input_codigo').val().trim();

    // Armamos el objeto con los datos
    let dataPost = {
        guia_ids: guia_ids_str,  // Ahora tomará la cadena de IDs seleccionados
        valorizacion_costotn: valorizacion_costotn,
        valorizacion_subtotal: valorizacion_subtotal,
        valorizacion_igv: valorizacion_igv,
        valorizacion_codigo: valorizacion_codigo,
        transportista_id: transportista_id // Asegúrate de que esto no sea null
    };

    // Limpiar campos y recortar espacios vacíos (según sea necesario)
    dataPost = trimJSONFields(dataPost);
    console.log('Data a enviar:', dataPost);
    // Definir la URL del endpoint
    const endpoint = getDomain() + "/ValorizacionRegistrar/RegistrarValorizacion";

    // Hacer la llamada AJAX con los datos en formato JSON
    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),

        dataType: "json",
        success: function (data) {
            const rpta = data.item1;
            const msg = data.item2;

            if (rpta === "0") {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro Exitoso',
                    text: `${msg} fueron registrados.`,
                }).then(() => {
                    // Recargar la página después de que se cierre el mensaje
                    location.reload();
                });

            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: `${msg} no fueron registrados.`,
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            const errorMessage = jqXHR.responseJSON?.message || 'Error desconocido';

            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error!',
                text: errorMessage,
            });
        }
    });
}