$(document).ready(function () {
    // Inicializa el select de transportistas
    TransportistaSelect("#input_transportista");

    // Agrega un listener para cambiar el transportista
    $('#input_transportista').change(function () {
        const transportista_id = $(this).val();
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
    var endpoint = getDomain() + "/Guia/GuiaSelect";

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

function agregarFilaValorizacion() {
    const transportistaSeleccionado = $('#input_transportista').val(); // Obtener el valor del select de transportista
    if (!transportistaSeleccionado) {
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error!',
            text: 'Debes seleccionar un transportista antes de agregar una fila.',
        });
        return; // Salir de la función si no hay un transportista seleccionado
    }
    const tabla = document.querySelector('#input_tabla_valorizacion tbody');
    const nuevaFila = document.createElement('tr');

    // Obtener el número de la fila para crear IDs únicos
    const numeroItem = tabla.rows.length + 1;

    // Generar la nueva fila con un select simple
    nuevaFila.innerHTML = `
        <td class="tabla_valorizacion_th_td">${numeroItem}</td>
        <td class="tabla_valorizacion_th_td">
            <div class="input-group input-group-sm mb-3 flex-column">
                <select class="form-select" id="input_guias_modal_${numeroItem}" required style="width:98% !important;">
                    <!-- Opciones de guías se cargarán dinámicamente -->
                </select>
            </div>
        </td>
        <td class="tabla_valorizacion_th_td"><input type="date" class="form-control" required></td>
        <td class="tabla_valorizacion_th_td"><input type="text" placeholder="Tipo" class="form-control" required></td>
        <td class="tabla_valorizacion_th_td"><input type="number" placeholder="Cantidad (TN)" class="form-control cantidad" required oninput="calcularCostoTotal(this)"></td>
        <td class="tabla_valorizacion_th_td"><input type="number" placeholder="Costo/TN" class="form-control costo" required oninput="calcularCostoTotal(this)"></td>
        <td class="tabla_valorizacion_th_td"><input type="number" placeholder="Costo Total" class="form-control costo-total" readonly></td>
        <td class="estilo-especial">
            <i class="bx bx-trash icon-circle red eliminar_fila" onclick="eliminarFila(this)"></i>
        </td>`;

    // Agregar la nueva fila a la tabla
    tabla.appendChild(nuevaFila);

    // Llamar a la función GuiaSelect pasándole el transportista_id y el ID único del select creado
    GuiaSelect(transportistaSeleccionado, `#input_guias_modal_${numeroItem}`);

    // Actualizar la numeración de las filas
    actualizarNumeracion();
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
}
// Función para eliminar una fila de la tabla
function eliminarFila(icono) {
    const fila = icono.closest('tr'); // Encuentra la fila más cercana al icono
    fila.remove(); // Elimina la fila
    actualizarNumeracion(); // Actualiza la numeración después de eliminar la fila
}

// Función para actualizar la numeración de los ítems
function actualizarNumeracion() {
    const filas = document.querySelectorAll('#input_tabla_valorizacion tbody tr'); // Selecciona todas las filas en el tbody

    filas.forEach((fila, index) => {
        // Asigna el número del ítem según el índice
        fila.querySelector('td:first-child').textContent = index + 1; // +1 para empezar desde 1
    });
}

// Función para capturar los datos de los inputs
function capturarDatos() {
    const filas = document.querySelectorAll('#input_tabla_valorizacion tbody tr'); // Selecciona todas las filas en el tbody
    const datos = []; // Array para almacenar los datos

    filas.forEach(fila => {
        const guia = fila.querySelector('input[placeholder="N Guia"]').value; // Captura el valor de N Guia
        const fecha = fila.querySelector('input[type="date"]').value; // Captura la fecha
        const tipo = fila.querySelector('input[placeholder="Tipo"]').value; // Captura el tipo
        const cantidad = fila.querySelector('input[placeholder="Cantidad"]').value; // Captura la cantidad
        const costo = fila.querySelector('input[placeholder="Costo"]').value; // Captura el costo

        // Solo agrega los datos si todos los campos son válidos
        if (guia && fecha && tipo && cantidad && costo) {
            datos.push({
                guia: guia,
                fecha: fecha,
                tipo: tipo,
                cantidad: cantidad,
                costo: costo
            });
        }
    });

    console.log(datos); // Para ver los datos capturados en la consola
}
