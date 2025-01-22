
$(document).ready(function () {
    initTransportistaSelect();
    initEmpresaSelect();
    obtenerMayorNumDocumento();
    TipoServicioSelect();
});


function showForm(formId) {
    // Obtener todos los contenedores de formularios
    const forms = document.querySelectorAll(".form-container");

    // Ocultar todos los contenedores
    forms.forEach((form) => {
        form.style.display = "none";
    });

    // Mostrar el contenedor del formulario seleccionado
    document.getElementById(formId).style.display = "block";

    // Obtener todos los botones
    const buttons = document.querySelectorAll(".buttons button");

    // Remover la clase activa de todos los botones
    buttons.forEach((button) => {
        button.classList.remove("button-active");
    });

    // Agregar la clase activa al botón seleccionado
    const activeButton = document.getElementById(`btn${formId.replace('pdf', '')}`);
    if (activeButton) {
        activeButton.classList.add("button-active");
    }
}

$(document).ready(function () {
    $('#botonEliminar').click(function () {
        eliminarDireccion($("#residuos").val());
    });
});

// Inicialmente ocultar todos los formularios y aplicar la clase activa al botón por defecto
document.addEventListener("DOMContentLoaded", () => {
    showForm("pdfResiduos"); // Mostrar por defecto el formulario de residuos sólidos
});

$(document).ready(function () {
    // Deshabilitar el select de direcciones al cargar la página
    $("#residuos").prop("disabled", true);
});

function EmpresaSelect(id_grupo) {
    var endpoint = getDomain() + "/Empresa/EmpresaSelect";

    // Solo destruye Select2 si está inicializado
    if ($.fn.select2 && $(id_grupo).data('select2')) {
        $(id_grupo).select2('destroy');
    }

    // Inicializar Select2 para el select
    $(id_grupo).select2({
        placeholder: "Seleccione una empresa...",
        allowClear: true,
        language: "es"
    });

    $.ajax({
        type: "GET",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function () {
            console.log("Cargando empresas...");
        },
        success: function (data) {
            var EmpresaSelect = data.item3;

            // Limpiar el select y agregar opción por defecto
            if (id_grupo === "#nomEmpresa" || id_grupo === "#nomEmpresa1") {
                $(id_grupo).empty();
                $(id_grupo).append('<option value="" disabled selected>Seleccione una empresa...</option>');
            }

            if (EmpresaSelect && EmpresaSelect.length > 0) {
                var empresas = {};

                EmpresaSelect.forEach(function (item) {
                    $(id_grupo).append(
                        '<option value="' + item.empresa_name + '" data-id="' + item.empresa_id + '">' + item.empresa_name + '</option>'
                    );
                    empresas[item.empresa_id] = item.empresa_ruc;
                });

                // Manejar el evento de cambio en el select de empresas
                $(id_grupo).change(function () {
                    var selectedEmpresaName = $(this).val(); // Ahora el valor es el nombre
                    var selectedEmpresaId = $(this).find(':selected').data('id'); // Obtener el ID desde data-id

                    if (empresas[selectedEmpresaId]) {
                        document.getElementById('ruc').value = empresas[selectedEmpresaId];
                        document.getElementById('ruc').disabled = true; // Deshabilitar el RUC
                        document.getElementById('ide').value = selectedEmpresaId;

                        // Habilitar el select de direcciones
                        $("#residuos").prop("disabled", false);

                        // Setear el título del modal y abrirlo
                        $("#modal_nueva_empresa .modal-title").html("Registrar Dirección para: <span style='color: #198754'><strong>" + selectedEmpresaName + "</strong></span>");
                        $("#btnGuardarDireccion").data("empresaId", selectedEmpresaId);

                        // Llamar a la función para cargar direcciones basadas en la empresa seleccionada
                        cargarDirecciones(selectedEmpresaId);

                    } else {
                        document.getElementById('ruc').disabled = true;
                        $("#residuos").prop("disabled", true);
                    }
                });
            }
        },
        error: function (data) {
            alert('Error fatal ' + data);
            console.log("failure");
        }
    });
}

// Función para obtener el conteo por tipo de servicio
function obtenerConteoPorTipoServicio(tipoServicioId) {
    return new Promise((resolve, reject) => {
        var endpoint = getDomain() + "/TipoServicio/ContarPorTipoServicio";

        $.ajax({
            type: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ tiposervicio_id: tipoServicioId }),
            dataType: "json",
            success: function (data) {
                console.log("Respuesta del contador:", data);
                
                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al obtener conteo:", textStatus, errorThrown);
                reject(errorThrown);
            }
        });
    });
}

function TipoServicioSelect() {
    var endpoint = getDomain() + "/TipoServicio/ListaTipoServicio";

    // Solo destruye Select2 si está inicializado
    if ($.fn.select2 && $('#Descarga').data('select2')) {
        $('#Descarga').select2('destroy');
    }

    // Inicializar Select2 después de destruir la instancia previa
    $('#Descarga').select2({
        placeholder: "Seleccione un Tipo de Descarga...",
        allowClear: true,
        language: "es",
        dropdownCssClass: 'limit-dropdown'
    });

    $.ajax({
        type: "GET",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function () {
            console.log("Cargando Descarga...");
        },
        success: function (data) {
            var TipoServicio = data.item3;
            var $select = $('#Descarga');

            // Limpiar el select
            $select.empty();

            // Agregar la opción predeterminada
            $select.append(new Option("Seleccione un Tipo de Descarga...", "", true, true));

            // Agregar las opciones si existen datos
            if (TipoServicio && TipoServicio.length > 0) {
                TipoServicio.forEach(function (item) {
                    $select.append($('<option>', {
                        value: item.tiposervicio_id,
                        text: item.tipo_residuo,
                        'data-titulo': item.tipo_titulo,
                        'data-numero': item.tipo_numero_certificado,
                        'data-residuotittle': item.tipoResiduotittle,
                        'data-residuo': item.tipoResiduo,
                        'data-residuodir': item.residuoDir
                    }));
                });
            } else {
                console.log("No se encontraron tipos de servicio.");
                $select.append(new Option("No hay tipos de servicio disponibles", ""));
            }

            // Habilitar y actualizar Select2
            $select.prop("disabled", false).select2({
                placeholder: "Seleccione un Tipo de Descarga...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown'
            });

            // Forzar la actualización de Select2
            $select.trigger('change');

            // Log para depuración
            console.log("Opciones cargadas:", $select.find('option').map(function () { return $(this).val(); }).get());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar tipos de servicio: ' + textStatus);
            console.error("Error al cargar tipos de servicio:", textStatus, errorThrown);
        }
    });

    // Manejar el evento de cambio de selección
    $('#Descarga').off('change').on('change', async function () {
        var $selected = $(this).find(':selected');
        var tipoServicioId = $selected.val();

        console.log("Valor seleccionado:", tipoServicioId); // Depuración

        if (tipoServicioId) {
            try {
                const conteoData = await obtenerConteoPorTipoServicio(tipoServicioId);
                $(this).data('conteoActual', conteoData.item3);
                console.log("Conteo obtenido:", conteoData.item3); // Depuración
            } catch (error) {
                console.error("Error al obtener el conteo:", error);
            }
        }
    });
}




// Manejar el envío del formulario con el nombre de la empresa
$("#miFormulario").on("submit", function (event) {
    event.preventDefault(); // Evitar el envío por defecto para poder hacer el ajuste

    var empresaNombre = $("#nomEmpresa").val(); // Obtener el valor del select (empresa_name)

    // Crear el objeto de datos con el nombre de la empresa
    var dataPost = {
        empresa_nombre: empresaNombre,  // Nombre de la empresa
        ruc: $("#ruc").val(),
        direccion: $("#residuos").val() // Dirección seleccionada
    };

    // Ahora puedes enviar los datos con el nombre de la empresa en lugar del ID
    $.ajax({
        type: "POST",
        url: "/Empresa/ListarEmpresas", // Asegúrate de reemplazar con tu endpoint
        data: JSON.stringify(dataPost),
        contentType: "application/json",
        success: function (response) {
            // Manejo del éxito
            console.log("Formulario enviado correctamente");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Manejo de errores
            console.error("Error al enviar formulario: " + textStatus, errorThrown);
        }
    });
});

function cargarDirecciones(empresa_id) {
    var endpoint = getDomain() + "/Direccion/DireccionSelect";
    $.ajax({
        type: "POST",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ empresa_id: empresa_id }),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando direcciones...");
        },
        success: function (data) {
            console.log(data);
            var direcciones = data.item3;

            // Limpiar el select
            $("#residuos").empty();

            // Agregar opción vacía para el placeholder
            $("#residuos").append(new Option("", ""));

            if (direcciones && direcciones.length > 0) {
                // Agregar opciones con direcciones
                for (var i = 0; i < direcciones.length; i++) {
                    var item = direcciones[i];
                    $("#residuos").append(new Option(item.direccion, item.direccion_id));
                }

                // Inicializar o actualizar Select2
                $('#residuos').select2({
                    placeholder: "Seleccione una dirección...",
                    allowClear: true,
                    language: "es",
                    dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
                });

                // Habilitar el select
                $("#residuos").prop("disabled", false);
            } else {
                console.log("No se encontraron direcciones para la empresa.");
                $("#residuos").append(new Option("No hay direcciones disponibles", ""));
                $("#residuos").prop("disabled", true);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar direcciones:', textStatus, errorThrown);
            alert('Error al cargar direcciones. Por favor, intente nuevamente.');
        },
        complete: function () {
            console.log("Finalizó la carga de direcciones.");
        }
    });
}



function guardarNewDireccion(empresa_id) {
    var empresa_id = $("#btnGuardarDireccion").data("empresaId"); // Obtener el id de la empresa del botón

    var dataPost = {
        direccion: $("#input_direccion").val(),
        empresa_id: empresa_id,
    };

    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Direccion/RegDireccion";

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
            $("#btnGuardarDireccion").attr("disabled", true);
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Guía registrada correctamente',
                }).then(() => {
                    console.log("Después del éxito");
                    // Llama a cargarDirecciones para actualizar la lista de direcciones
                    cargarDirecciones(empresa_id);

                    $("#modal_nueva_empresa").modal("hide");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'La empresa o el usuario ya fueron registrados',
                });
            }
            $("#btnGuardarDireccion").prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error!',
                text: 'La empresa o el usuario ya fueron registrados',
            });
            $("#btnGuardarDireccion").prop("disabled", false); // Asegúrate de habilitar el botón nuevamente
        }
    });
}



function eliminarDireccion(direccion_id) {
    var endpoint = getDomain() + "/Direccion/DelDireccion"; // Cambia esto al endpoint correcto
    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ direccion_id: direccion_id }),
        dataType: "json",
        success: function (data) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Direccion Eliminada correctamente',
            }).then(() => {
     
                var select = document.getElementById("nomEmpresa");
                var selectedOption = select.options[select.selectedIndex];
                var dataId = selectedOption.getAttribute("data-id");
                cargarDirecciones(dataId);
            });

            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al eliminar dirección:', textStatus, errorThrown);
            alert('Error al eliminar dirección. Por favor, intente nuevamente.');
        }
    });
}



function TransportistaSelect() {
    var endpoint = getDomain() + "/Transportista/TransportistaSelect";

    // Solo destruye Select2 si está inicializado
    if ($.fn.select2 && $('#input_transportista').data('select2')) {
        $('#input_transportista').select2('destroy');
    }

    // Inicializar Select2 después de destruir la instancia previa
    $('#input_transportista').select2({
        placeholder: "Seleccione un transportista...",
        allowClear: true,
        language: "es",
        dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
    });

    $.ajax({
        type: "GET",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function () {
            console.log("Cargando transportistas...");
        },
        success: function (data) {
            var transportistas = data.item3;

            // Limpiar el select y agregar opción por defecto
            var $select = $('#input_transportista');
            $select.empty();
            $select.append(new Option("Seleccione un transportista...", "", true, true));

            // Verificar si se recibieron transportistas
            if (transportistas && transportistas.length > 0) {
                // Almacenar transportistas en un objeto accesible
                var transportistasData = {};

                // Agregar opciones al select
                transportistas.forEach(function (item) {
                    $select.append($('<option>', {
                        value: item.transportista_nombre,
                        text: item.transportista_nombre,
                        'data-id': item.transportista_id
                    }));
                    transportistasData[item.transportista_nombre] = {
                        ruc: item.transportista_ruc,
                        id: item.transportista_id
                    };
                });

                // Manejar evento de cambio en el select
                $select.change(function () {
                    var selectedTransportista = $(this).val();
                    var selectedTransportistaId = $(this).find(':selected').data('id');
                    if (transportistasData[selectedTransportista]) {
                        $('#ruct').val(transportistasData[selectedTransportista].ruc);
                        $('#idt').val(selectedTransportistaId);
                    }
                });
            } else {
                console.log("No se encontraron transportistas.");
                $select.append(new Option("No hay transportistas disponibles", ""));
            }

            // Habilitar el select
            $select.prop("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar transportistas: ' + textStatus);
            console.error("Error al cargar transportistas:", textStatus, errorThrown);
        }
    });
}

function initTransportistaSelect() {
    TransportistaSelect("#empresa");
    TransportistaSelect("#empresa1");
}

function initEmpresaSelect() {
    EmpresaSelect("#nomEmpresa");
    EmpresaSelect("#nomEmpresa1");
}

async function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}
let documentoidvalor;
function obtenerMayorDocumentoID() {
    var endpoint = "/Repositorio/ObtenerMayorDocumentoID"; // Ruta relativa del endpoint

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            success: function (data) {
                console.log("Respuesta del servidor:", data); // Inspecciona la respuesta completa
                console.log(data.item3);
                documentoidvalor = parseInt(data.item3) + 1;
                usarQR();

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Error fatal: ' + error);
                reject(error); // Rechaza la promesa en caso de error
            }
        });
    });
}

function obtenerMayorNumDocumento() {
    var documento_num;
    var endpoint = "/Repositorio/Documento_MaxNumero"; // Ruta relativa del endpoint

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            success: function (data) {
                console.log("Respuesta del servidor:", data); // Inspecciona la respuesta completa
                //console.log(data.item3);
                documento_num = parseInt(data.item3);
                resolve(documento_num);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Error fatal: ' + error);
                reject(error); // Rechaza la promesa en caso de error
            }
        });
    });
}

function abrirEnlaceEnVentana(documentoId) {
    const enlace = `/api/Documento/Ver/${documentoId}`;
    const viewerUrl = `/views/pdf-viewer.html?file=${encodeURIComponent(window.location.origin + enlace)}`;
    //window.open(viewerUrl, '_blank');
    return viewerUrl;
}

let imgQR12; // Variable global para almacenar la imagen QR en base64

function generarQR(documentoId) {
    return new Promise((resolve, reject) => {
        var dominio = getDomain();
        var enlace = dominio + abrirEnlaceEnVentana(documentoId);
        console.log(enlace);
        const contenedorQR = document.getElementById('qrcode');

        if (!contenedorQR) {
            reject("El contenedor QR no se encontró.");
            return;
        }

        // Limpiar cualquier QR previo
        contenedorQR.innerHTML = "";

        // Generar el QR con el enlace proporcionado
        const qrCode = new QRCode(contenedorQR, {
            text: enlace,
            width: 128,  // Ancho del QR
            height: 128  // Alto del QR
        });

        // Esperar a que el QR se genere y convertir a imagen
        setTimeout(() => {
            // Obtener el canvas del QR generado
            const canvas = contenedorQR.querySelector('canvas');

            if (canvas) {
                // Convertir el canvas a una imagen PNG en formato base64
                imgQR12 = canvas.toDataURL('image/png'); // Asigna el resultado a imgQR1
                resolve(imgQR12); // Retorna la imagen en base64
            } else {
                reject("No se pudo generar el QR.");
            }
        }, 1000); // Ajustar el tiempo de espera según sea necesario
    });
}

// Ejemplo de uso
async function usarQR() {
    try {
        var enlace = documentoidvalor;
        const qrData = await generarQR(enlace);
        console.log(qrData); // imgQR1 contiene la imagen QR en base64
        // Aquí puedes hacer algo con imgQR1
    } catch (error) {
        console.error('Error al usar el QR:', error);
    }
}
obtenerMayorDocumentoID();


function consistenciaDatosNew() {
    $('#numeroGuia').on('keypress', function (event) {
        var keyCode = event.keyCode || event.which;
        var keyValue = String.fromCharCode(keyCode);

        // Permitir solo letras, números y hasta 25 caracteres
        if (!/[a-zA-Z0-9]/.test(keyValue) || $(this).val().length >= 25) {
            event.preventDefault();
        }
    });

    $('#tipoRCD').on('keypress', function (event) {
        var keyCode = event.keyCode || event.which;
        var keyValue = String.fromCharCode(keyCode);

        // Permitir solo letras, números y hasta 29 caracteres
        if (!/[a-zA-Z0-9]/.test(keyValue) || $(this).val().length >= 29) {
            event.preventDefault();
        }
    });

    $('#toneladas').on('keypress', function (event) {
        var keyCode = event.keyCode || event.which;
        var keyValue = String.fromCharCode(keyCode);
        var currentValue = $(this).val();

        // Permitir solo números, punto y coma
        if (!/[0-9.,]/.test(keyValue)) {
            event.preventDefault();
            return; // Salir si el carácter no es válido
        }

        // No permitir más de un punto o coma en el campo
        if ((keyValue === '.' && currentValue.includes('.')) || (keyValue === ',' && currentValue.includes(','))) {
            event.preventDefault();
            return; // Salir si ya existe un separador del mismo tipo
        }

        // Limitar la cantidad de caracteres a 7
        if (currentValue.length >= 7) {
            event.preventDefault();
        }
    });

}

// Obtiene el elemento del DOM correspondiente al select y al campo de entrada
const selectTransportista = document.getElementById('input_transportista');
const inputAbreviacion = document.getElementById('abreviacion');

// Bandera para saber si se está modificando manualmente
let editandoManual = false;

// Deshabilita el campo de abreviación inicialmente
inputAbreviacion.disabled = true;

// Función que maneja la selección y genera la abreviación
function actualizarAbreviacion() {
    const seleccion = selectTransportista.value; // Obtiene el valor seleccionado
    if (seleccion) {
        inputAbreviacion.disabled = false; // Habilita el campo cuando se selecciona una empresa
        // Verifica si la longitud es mayor a 21 caracteres
        if (!editandoManual) {
            if (seleccion.length > 21) {
                // Generar abreviación si el nombre es largo
                const abreviacion = abreviar(seleccion);
                inputAbreviacion.value = abreviacion; // Muestra la abreviación
            } else {
                // Muestra el nombre completo si la longitud es 21 o menos
                inputAbreviacion.value = seleccion;
            }
        }
    } else {
        inputAbreviacion.value = ''; // Limpia el campo si no hay selección
        inputAbreviacion.disabled = true; // Deshabilita el campo si no se selecciona nada
    }
}

// Función para abreviar el nombre de la 

function abreviar(nombre) {
    const palabras = nombre.split(' '); // Divide el nombre en palabras
    return palabras.map(p => p.charAt(0).toUpperCase()).join(''); // Retorna las iniciales en mayúscula
}

// Llama a la función al cargar la página para asegurarse de que esté actualizada
actualizarAbreviacion();

// Agrega un evento para detectar cambios en el select
selectTransportista.addEventListener('change', function () {
    editandoManual = false; // Si se selecciona otra empresa, no es edición manual
    actualizarAbreviacion();
});

// Agrega un evento de entrada para permitir la edición y limitar a 21 caracteres
inputAbreviacion.addEventListener('input', function () {
    editandoManual = true; // Indica que el usuario está editando manualmente
    if (inputAbreviacion.value.length > 21) {
        inputAbreviacion.value = inputAbreviacion.value.slice(0, 21); // Limita a 21 caracteres
    }
});

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Ajusta según sea necesario
}


async function guardarNewGuia() {
    var { guia_numero, descarga, cantidad, unidad, transportistaid, fechaformulario, cero, direccionform, pdfData, empresaid, num_doc } = await generarPDF();
    let residuosSelect = document.getElementById("residuos");
    let residuosNombre = residuosSelect.options[residuosSelect.selectedIndex].text;
    var formData = new FormData();
    var fecha = formatDate(fechaformulario);
    formData.append('guia_numero', guia_numero);
    formData.append('guia_descarga', descarga);
    formData.append('guia_unidad', unidad);
    formData.append('guia_cantidad', cantidad);
    formData.append('transportista_id', transportistaid);
    formData.append('guia_fecha_servicio', fechaformulario);
    formData.append('guia_direccion', residuosNombre);
    formData.append('guia_costo', cero);
    formData.append('documento_pdf', pdfData);
    formData.append('empresa_id', empresaid);
    formData.append('documento_numero', num_doc);

    console.log(formData);
    var endpoint = getDomain() + "/Guia/RegistrarGuia";

    $.ajax({
        type: "POST",
        url: endpoint,
        processData: false,
        contentType: false,
        data: formData,
        beforeSend: function (xhr) {
            console.log("Registrando guía...");
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            console.log("Respuesta del servidor:", data);

            if (rpta == "0") {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Guía registrada correctamente',
                }).then(() => {
                    console.log("Después del éxito");
                    obtenerMayorDocumentoID();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: msg || 'No se pudo registrar la guía',
                }).then(() => {
                    console.log("Error");
                    // Verifica si hay alguna acción que esté causando el cierre aquí
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error!',
                text: jqXHR.responseJSON?.item2 || 'No se pudo registrar la guía',
            }).then(() => {
                console.log("Error");
                // Verifica si hay alguna acción que esté causando el cierre aquí
            });
        },
    });
}





async function generarPDF() {
    const selectedOption = $("#Descarga option:selected");
    const tipoServicioId = selectedOption.val();

    if (!tipoServicioId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor seleccione un tipo de descarga'
        });
        return;
    }

    // Obtener el conteo
    let num_doc;
    try {
        var conteoData = 0;
        var rpst = await obtenerConteoPorTipoServicio(tipoServicioId);
        conteoData = rpst.item3;
        console.log("Respuesta del contador:", conteoData); 
        if (parseInt(rpst.item1) === 0) {
            // Si el backend devuelve 0, será 1; si devuelve 1, será 2, etc.
            num_doc = parseInt(rpst.item3) + 1;
            console.log("Número de documento:", num_doc); // Para debug
        } else {
            throw new Error(rpst.item2);
        }
    } catch (error) {
        console.error("Error al obtener conteo:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener el conteo'
        });
        return;
    }

    // Formatear el número
    let num_doc_str = "";
    if (num_doc < 10) {
        num_doc_str = "00" + num_doc.toString();
    }
    else if (num_doc < 100) {
        num_doc_str = "0" + num_doc.toString();
    }

    let formId = "";
    const { jsPDF } = window.jspdf;
    let empresaid = document.getElementById("ide").value;
    let descarga = selectedOption.val();
    let titulo = "";
    let tipoResiduotittle = "";
    let tipoResiduo = "";
    let residuoDir = "";
    let cantidad = document.getElementById("cantidad").value;
    let numeroCert = "";
    let unidad = "";
    let guia_numero = document.getElementById("numeroGuia").value;
    let transportistaid = document.getElementById('idt').value;
    let fechaformulario = document.getElementById("fecha").value;
    let direccionform = document.getElementById("residuos").value;
    let [anio, mes, dia] = fechaformulario.split("-");

    // Obtener los datos del servicio seleccionado
    if (selectedOption.length > 0) {
        titulo = selectedOption.data('titulo');
        tipoResiduotittle = selectedOption.data('residuotittle');
        tipoResiduo = selectedOption.data('residuo');
        residuoDir = selectedOption.data('residuodir');
        numeroCert = selectedOption.data('numero') + "-" + num_doc_str + "-" + anio;

        // Determinar el tipo de formulario basado en el servicio
        const tipoDescarga = rpst.item4;
        if (tipoDescarga.includes("Residuos") || tipoDescarga.includes("Desmedros") ||
            tipoDescarga.includes("Grasas") || tipoDescarga.includes("Lodos") ||
            tipoDescarga.includes("Biosólidos")) {
            formId = "pdfResiduos";
            unidad = "TN";
        } else if (tipoDescarga.includes("Líquidos") || tipoDescarga.includes("Aguas")) {
            formId = "pdfAguas";
            unidad = "M³";
        }
    }

    if (formId === "pdfResiduos") {
        return new Promise(async (resolve, reject) => {
            let residuosSelect = document.getElementById("residuos");
            let residuosNombre = residuosSelect.options[residuosSelect.selectedIndex].text;
            let residuos = document.getElementById("residuos").value;
            let numeroGuia = document.getElementById("numeroGuia").value;
            let empresa = document.getElementById("input_transportista").value;
            let nomEmpresa = document.getElementById("nomEmpresa").value;

            if (descarga === "" || !numeroGuia || !empresa || tipoResiduotittle === "" || !cantidad || !nomEmpresa) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'Por favor llene todos los campos',
                });
                return;
            }

            const readerQR = new FileReader();

            const doc = new jsPDF();

            // Cargar las imágenes de encabezado y pie de página
            const imgArriba = await loadImage("img/arriba.png");
            const imgAbajo = await loadImage("img/abajo.png");
            const imgFirma = await loadImage("img/firma.png");
            // Márgenes de 5 mm
            const margin = 22;
            const pageWidth = 210; // Ancho total de la página en mm
            const pageHeight = 297; // Alto total de la página en mm
            const contentWidth = pageWidth - 2 * margin;

            // Ajustar altura de imágenes
            const alturaArriba = 39; // Altura en mm para la imagen de encabezado
            const alturaAbajo = 39; // Altura en mm para la imagen de pie de página

            // Cálculo del ancho para mantener la proporción
            const anchoArriba =
                (imgArriba.width / imgArriba.height) * alturaArriba;
            const anchoAbajo = (imgAbajo.width / imgAbajo.height) * alturaAbajo;

            // Encabezado y pie de página
            doc.addImage(imgArriba, "PNG", 0, 0, anchoArriba, alturaArriba); // Encabezado
            const offset = 10; // Ajusta este valor según lo lejos que quieras que suba
            doc.addImage(
                imgAbajo,
                "PNG",
                0,
                doc.internal.pageSize.height - alturaAbajo - offset, // Resta el offset aquí
                anchoAbajo,
                alturaAbajo
            );  // Pie de página
            // Título
            doc.setFontSize(14);
            doc.setTextColor(0, 100, 0);
            doc.setFont(undefined, "bold");
            doc.text("CERTIFICADO", pageWidth / 2, 38, null, null, "center");
            doc.setFont(undefined, "normal");

            // Número de certificado
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, "bold");
            doc.text(
                "N°" + numeroCert,
                pageWidth / 2, 44, null, null, "center");
            doc.setFont(undefined, "normal");

            // Cuadro verde sin relleno ajustado a la altura del texto
            doc.setDrawColor(0, 100, 0);
            let textYPosition = 55;
            let textHeight = doc.getTextDimensions(
                `${titulo}`
            ).h;
            let rectYPosition = textYPosition - textHeight / 2 - 3.3;
            let rectHeight = textHeight + 4;
            doc.rect(margin, rectYPosition, contentWidth, rectHeight);

            // Obtener el texto y el tamaño del texto
            const texto = titulo;
            doc.setFontSize(10);
            doc.setFont(undefined, "bold"); // Establecer la fuente en negrita

            // Obtener el ancho del texto usando doc.getTextWidth()
            const anchoTexto = doc.getTextWidth(texto);

            // Calcular la posición centrada
            const anchoPagina = doc.internal.pageSize.getWidth(); // Ancho de la página
            const posicionCentradaX = (anchoPagina - anchoTexto) / 2; // posición centrada

            // Mostrar la opción seleccionada en el cuadro verde (sin añadir margen adicional)
            doc.text(texto, posicionCentradaX, textYPosition);

            // Restablecer la fuente a normal para el texto predeterminado
            doc.setFont(undefined, "normal");

            // Texto predeterminado debajo del cuadro verde
            doc.setFontSize(11);
            let textoPredeterminado =
                "Con Resolución Directoral N° 0367-2020-MINAM/VMGA/DGRS y Actualización de Registro Autoritativo N° 00028-2020-MINAM/VGMA/DGRS, el Ministerio del Ambiente autoriza nuestra Infraestructura de Valorización de Residuos Sólidos Orgánicos, Inorgánicos No Peligrosos y Residuos Reaprovechables provenientes de la Construcción y Demolición";
            let textoYPosition = textYPosition + 12;
            let textLines = doc.splitTextToSize(textoPredeterminado, contentWidth);

            doc.text(textLines, margin, textoYPosition, {
                align: 'justify',
                maxWidth: contentWidth,
                lineHeightFactor: 1.8 // Ajusta este valor según lo necesites
            });


            // Texto predeterminado adicional
            let textoAdicional1 = "ALTO CHICAMA S.R.L.  ";
            let textoAdicional2 =
                " certifica haber recibido residuos sólidos, según el siguiente detalle:";
            let textoYPositionAdicional =
                textoYPosition + textLines.length * 7 + 3;

            doc.setFont(undefined, "bold");
            doc.text(textoAdicional1, margin, textoYPositionAdicional);
            doc.setFont(undefined, "normal");
            doc.text(
                textoAdicional2,
                margin + doc.getTextWidth(textoAdicional1),
                textoYPositionAdicional
            );

            // Función para dividir texto largo en líneas
            function splitTextToLines(text, maxWidth, doc) {
                let words = text.split(" ");
                let lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    let word = words[i];
                    let width = doc.getTextWidth(currentLine + " " + word);
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine); // Agrega la última línea
                return lines;
            }

            // Inicializa `startY` antes de usarlo
            let startY = 105;
            let minCellHeight = 12; // Altura mínima por celda
            let padding = 4; // Espacio adicional dentro de las celdas

            // Definir el ancho total del documento
            let totalWidth = contentWidth; // O el ancho que consideres adecuado

            // Asignar porcentajes fijos para las columnas
            let colWidthsPercentages = [15, 35, 40, 10];

            // Convertir los porcentajes en píxeles
            let colWidths = colWidthsPercentages.map(percentage => (percentage / 100) * totalWidth);

            let abreviacion = document.getElementById("abreviacion").value;
            let guiaText = "N° de Guía " + abreviacion;

            // Si la longitud total es mayor a 22 caracteres, insertar un salto de línea
            if (guiaText.length > 24) {
                guiaText = "N° de Guía\n" + abreviacion; // Añadir salto de línea
            }

            let headers = [
                "Fecha",
                guiaText, // Usar la variable ajustada
                tipoResiduotittle,
                "TN",
            ];

            // Encabezados en negrita
            doc.setFont(undefined, "bold");
            headers.forEach((header, index) => {
                let cellWidth = colWidths[index];

                // Dibujar la celda del encabezado
                doc.rect(margin + colWidths.slice(0, index).reduce((a, b) => a + b, 0), startY, cellWidth, minCellHeight);

                // Coordenadas de los encabezados
                let headerX = margin + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + cellWidth / 2;
                let headerY = startY + minCellHeight / 2 + doc.getTextDimensions(header).h / 4; // Centrado verticalmente

                // Verificar si el texto contiene un salto de línea
                if (header.includes("\n")) {
                    let lines = header.split("\n");
                    lines.forEach((line, lineIndex) => {
                        let lineHeight = doc.getTextDimensions(line).h; // Altura de la línea
                        let lineY = headerY + lineHeight * (lineIndex - (lines.length - 1) / 2); // Ajustar la posición para centrar las líneas
                        doc.text(line, headerX, lineY, null, null, "center");
                    });
                } else {
                    doc.text(header, headerX, headerY, null, null, "center");
                }
            });
            doc.setFont(undefined, "normal");

            startY += minCellHeight;

            // Convertir la fecha de "AAAA-MM-DD" a "DD-MM-AAAA"
            let fechaOriginal = document.getElementById("fecha").value;
            let [year, month, day] = fechaOriginal.split("-");
            let fechaFormateada = `${day}-${month}-${year}`; // Nueva fecha con formato "DD-MM-AAAA"

            let rowData = [
                fechaFormateada, // Usar la fecha formateada
                document.getElementById("numeroGuia").value,
                tipoResiduo,
                cantidad,
            ];

            // Renderizar celdas de los datos
            rowData.forEach((data, index) => {
                let cellWidth = colWidths[index];
                let maxTextWidth = cellWidth - padding; // Margen dentro de la celda
                let lines = splitTextToLines(data, maxTextWidth, doc);

                // Calcula la altura necesaria para las líneas
                let lineHeight = 6; // Altura de cada línea de texto
                let totalTextHeight = lines.length * lineHeight;
                let cellHeight = Math.max(totalTextHeight, minCellHeight); // Elige la mayor entre el mínimo y el calculado

                // Dibuja el rectángulo de la celda
                doc.rect(margin + colWidths.slice(0, index).reduce((a, b) => a + b, 0), startY, cellWidth, cellHeight);

                // Centramos verticalmente el texto
                let textY = startY + (cellHeight - totalTextHeight) / 2 + (totalTextHeight > cellHeight ? 0 : lineHeight / 1.5); // Ajuste para centrar

                lines.forEach((line) => {
                    let textWidth = doc.getTextWidth(line);
                    let textX = margin + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + (cellWidth - textWidth) / 2; // Centramos horizontalmente
                    doc.text(line, textX, textY);
                    textY += lineHeight; // Mueve hacia abajo para la siguiente línea
                });
            });


            // Declarar infoStartY antes de usarla
            let infoStartY;

            if (residuos) {
                doc.setFontSize(11);
                let texto = `${residuoDir} provenientes de la siguiente dirección: ${residuosNombre}, generados por la empresa:`;
                let splittedText = doc.splitTextToSize(texto, contentWidth);

                // Dibuja el texto en la posición correspondiente
                doc.text(splittedText, margin, textoYPositionAdicional + 40, {
                    lineHeightFactor: 1.7
                });

                // Ajustar el valor de infoStartY según la cantidad de líneas de texto
                let textHeight = splittedText.length * doc.getLineHeight(); // Altura del texto en función del número de líneas
                infoStartY = textoYPositionAdicional + (textHeight > doc.getLineHeight() ? 51 : 46); // Ajustar si pasa de una línea
            } else {
                alert("Por favor, complete el campo 'residuos'.");
                return;
            }

            // Cuadro con información de RUC y Nombre de la Empresa
            doc.setFontSize(11);
            let infoCellWidthLeft = contentWidth * 0.7; // 70% del ancho para la primera celda
            let infoCellWidthRight = contentWidth * 0.3; // 30% del ancho para la segunda celda
            let infoCellHeight = 10;

            let rucValue = `RUC: ${document.getElementById("ruc").value}`;

            // Dibuja la primera celda (nombre de la empresa)
            doc.rect(margin, infoStartY, infoCellWidthLeft, infoCellHeight);

            // Ajustar el estilo de fuente a negrita para el nombre de la empresa
            doc.setFont(undefined, "bold");

            // Calcular el ancho del texto y centrarlo
            let textWidthEmpresa = doc.getTextWidth(nomEmpresa);
            let textXEmpresa = margin + (infoCellWidthLeft - textWidthEmpresa) / 2;
            doc.text(nomEmpresa, textXEmpresa, infoStartY + 6.2);

            // Restaurar el estilo de fuente normal para el resto del texto
            doc.setFont(undefined, "normal");

            // Dibuja la segunda celda (RUC) a la derecha de la primera
            doc.rect(margin + infoCellWidthLeft, infoStartY, infoCellWidthRight, infoCellHeight);

            // Calcular el ancho del texto y centrarlo
            let textWidthRuc = doc.getTextWidth(rucValue);
            let textXRuc = margin + infoCellWidthLeft + (infoCellWidthRight - textWidthRuc) / 2;
            doc.text(rucValue, textXRuc, infoStartY + 6.2);


            // Agregar el texto predeterminado con los datos de la empresa y el RUC
            doc.setFontSize(11);
            let nombreEmpresa = document.getElementById("nomEmpresa").value;
            let ruct = document.getElementById("ruct").value;

            let textoPredeterminado3 = `Transportados por la empresa ${nombreEmpresa} con RUC: ${ruct} hacia la Planta de Valorización Alto Chicama, ubicada en la Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad; para su valorización.`;

            let splittedText = doc.splitTextToSize(
                textoPredeterminado3,
                contentWidth
            );

            doc.text(splittedText, margin, infoStartY + 18, {
                align: 'justify',
                maxWidth: contentWidth,
                lineHeightFactor: 1.7
            });

            // Definir el texto completo
            let textoCompleto = "La EO-RS ALTO CHICAMA S.R.L.   es una  empresa  comprometida  con el  cuidado  del  medio                     ambiente y que opera   ambiente  y  que  opera  en  cumplimiento  a  lo dispuesto por el  D.L. N° 1278,  Ley  de  Gestión  Integral de Residuos Sólidos, su modificatoria la Ley N° 1501; su reglamento y modificatoria.";

            // Dividir el texto en partes
            let partes = textoCompleto.split("EO-RS ALTO CHICAMA S.R.L.");

            // Configurar el estilo de texto y tamaño
            doc.setFontSize(11);
            doc.setFont(undefined, "normal");

            let yPosition = infoStartY + 45;
            let xPosition = margin;
            let maxWidth = contentWidth;
            let lineHeight = doc.getTextDimensions("M").h * 1.7; // Altura de línea

            function addStyledText(text, isBold, continueOnSameLine = false) {
                doc.setFont(undefined, isBold ? "bold" : "normal");
                let words = text.split(" ");
                let line = "";
                let lines = [];

                for (let word of words) {
                    let testLine = line + (line ? " " : "") + word;
                    let testWidth = doc.getTextWidth(testLine);

                    if (testWidth > maxWidth && line !== "") {
                        lines.push(line);
                        line = word;
                    } else {
                        line = testLine;
                    }
                }
                if (line) {
                    lines.push(line);
                }

                lines.forEach((line, index) => {
                    if (continueOnSameLine && index === 0) {
                        // Continuar en la misma línea, añadiendo un espacio
                        xPosition += doc.getTextWidth("");
                        doc.text(line, xPosition, yPosition);
                        xPosition += doc.getTextWidth(line);
                    } else {
                        if (xPosition + doc.getTextWidth(line) > pageWidth - margin) {
                            yPosition += lineHeight;
                            xPosition = margin;
                        }
                        doc.text(line, xPosition, yPosition);
                        if (!continueOnSameLine || index < lines.length - 1) {
                            yPosition += lineHeight;
                            xPosition = margin;
                        } else {
                            xPosition += doc.getTextWidth(line);
                        }
                    }
                });
            }

            // Renderizar el texto con estilos mixtos
            addStyledText("La ", false, true);
            addStyledText("EO-RS ALTO CHICAMA S.R.L.  ", true, true);
            addStyledText(partes[1], false, true);

            // Ajustar la posición Y para el siguiente párrafo si es necesario
            if (xPosition > margin) {
                yPosition += lineHeight;
                xPosition = margin;
            }

            // Firma de la empresa
            doc.addImage(imgFirma, "PNG", 75, startY + 102, 51, 26);

            // Leer la imagen del QR

            // Agregar la imagen del QR
            doc.addImage(imgQR12, "PNG", 162, startY + 122, 25, 25); // Ajusta las coordenadas y tamaño según sea necesario
            // Obtener la fecha de la ID 'fecha' y transformarla
            // Obtener la fecha en formato 'YYYY-MM-DD'
            const fechaString = document.getElementById("fecha").value; // Formato 'YYYY-MM-DD'

            // Convertir la fecha de formato 'YYYY-MM-DD' a un objeto Date
            const [anio, mes, dia] = fechaString.split('-').map(Number);

            // Crear un objeto Date usando el valor sin ajuste de zona horaria
            const fecha = new Date(anio, mes - 1, dia);

            // Crear una función que obtenga la fecha en formato local
            function obtenerFechaLocal(fecha) {
                const dia = fecha.getDate();
                const mes = fecha.getMonth(); // Nota: los meses van de 0 a 11
                const anio = fecha.getFullYear();

                return { dia, mes, anio };
            }

            // Obtener la fecha en formato local
            const { dia: diaLocal, mes: mesLocal, anio: anioLocal } = obtenerFechaLocal(fecha);

            // Array de nombres de meses
            const meses = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];

            // Crear la cadena de texto para la fecha
            const textoFecha = `Trujillo, ${diaLocal} de ${meses[mesLocal]} del ${anioLocal}`;

            // Obtener el ancho de la página y calcular la posición para el texto
            const pdfPageWidth = doc.internal.pageSize.width; // Usar un nombre diferente para evitar conflictos
            const textWidth = doc.getTextWidth(textoFecha); // Ancho del texto
            const textX = pdfPageWidth - textWidth - 10; // Posición X (alineado a la derecha)
            const textY = startY + 120; // Posición Y (ajusta según sea necesario)


            doc.setFontSize(10);
            doc.setTextColor(105, 105, 105); // Color gris para el texto

            // Añadir la fecha al PDF
            doc.text(textoFecha, textX, textY);

            // Texto adicional en la parte inferior izquierda
            const textLeft = 22; // Posición en X
            const textBottom = pageHeight - 40; // Posición en Y (desde abajo)

            doc.setFontSize(10);
            doc.setTextColor(105, 105, 105); // Color gris para el texto

            // Primera línea de texto
            doc.text(
                "OFICINA / INFRAESTRUCTURA DE VALORIZACIÓN",
                textLeft,
                textBottom
            );

            // Segunda línea de texto
            doc.text(
                "Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad",
                textLeft,
                textBottom + 5
            );

            // Tercera línea de texto
            doc.text("comercial@", textLeft, textBottom + 10);
            doc.setTextColor(0, 128, 0); // Color verde para el correo
            doc.text(
                "serviciosambientalesaltochicama.com",
                textLeft + doc.getTextWidth("comercial@"),
                textBottom + 10
            );

            // Cuarta línea de texto
            doc.setTextColor(105, 105, 105); // Volver a color gris
            doc.text("914 105 601 | 913 036 413", textLeft, textBottom + 15);
            const pdfData = doc.output('blob');
            const cero = 0;
            resolve({ guia_numero, descarga, cantidad, unidad, transportistaid, fechaformulario,cero,direccionform, pdfData, empresaid,num_doc});
            //reader.readAsDataURL(file); // AQUÍ CREA CANICAS
        });
        

    } else if (formId === "pdfAguas") {
        return new Promise(async (resolve, reject) => {
            let residuosSelect = document.getElementById("residuos");
            let residuosNombre = residuosSelect.options[residuosSelect.selectedIndex].text;
            let residuos = document.getElementById("residuos").value;
            let numeroGuia = document.getElementById("numeroGuia").value;
            let empresa = document.getElementById("input_transportista").value;
            let nomEmpresa = document.getElementById("nomEmpresa").value;

            if (descarga === "" || !numeroGuia || !empresa || tipoResiduotittle === "" || !cantidad || !nomEmpresa) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text: 'Por favor llene todos los campos',
                });
                return;
            }

            const readerQR1 = new FileReader();
            const doc = new jsPDF();

            const imgArriba = await loadImage("img/arriba.png");
            const imgAbajo = await loadImage("img/abajo.png");
            const imgFirma = await loadImage("img/firma.png");
            // Márgenes de 5 mm
            const margin = 22;
            const pageWidth = 210; // Ancho total de la página en mm
            const pageHeight = 297; // Alto total de la página en mm
            const contentWidth = pageWidth - 2 * margin;

            // Ajustar altura de imágenes
            const alturaArriba = 39; // Altura en mm para la imagen de encabezado
            const alturaAbajo = 39; // Altura en mm para la imagen de pie de página

            // Cálculo del ancho para mantener la proporción
            const anchoArriba =
                (imgArriba.width / imgArriba.height) * alturaArriba;
            const anchoAbajo = (imgAbajo.width / imgAbajo.height) * alturaAbajo;

            // Encabezado y pie de página
            doc.addImage(imgArriba, "PNG", 0, 0, anchoArriba, alturaArriba); // Encabezado
            const offset = 10; // Ajusta este valor según lo lejos que quieras que suba
            doc.addImage(
                imgAbajo,
                "PNG",
                0,
                doc.internal.pageSize.height - alturaAbajo - offset, // Resta el offset aquí
                anchoAbajo,
                alturaAbajo
            );  // Pie de página
            // Título
            doc.setFontSize(14);
            doc.setTextColor(0, 100, 0);
            doc.setFont(undefined, "bold");
            doc.text("CERTIFICADO", pageWidth / 2, 38, null, null, "center");
            doc.setFont(undefined, "normal");

            // Número de certificado
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, "bold");
            doc.text(
                "N°" + numeroCert,
                pageWidth / 2, 44, null, null, "center");
            doc.setFont(undefined, "normal");

            // Definir un nuevo ancho para el cuadro
            const nuevoAncho = contentWidth + 1; // Aumenta el ancho original en 20 (ajusta este valor como desees)

            // Cuadro verde sin relleno ajustado a la altura del texto
            doc.setDrawColor(0, 100, 0);
            let textYPosition = 55;
            let textHeight = doc.getTextDimensions(
                `${titulo}`
            ).h;
            let rectYPosition = textYPosition - textHeight / 2 - 3.3;
            let rectHeight = textHeight + 4;
            doc.rect(margin, rectYPosition, nuevoAncho, rectHeight); // Usa nuevoAncho aquí

            // Obtener el texto y el tamaño del texto
            const texto = titulo;
            doc.setFontSize(10);
            doc.setFont(undefined, "bold"); // Establecer la fuente en negrita

            // Obtener el ancho del texto usando doc.getTextWidth()
            const anchoTexto = doc.getTextWidth(texto);

            // Calcular la nueva posición centrada en base al nuevo ancho
            const anchoPagina = doc.internal.pageSize.getWidth(); // Ancho de la página
            const posicionCentradaX = margin + (nuevoAncho - anchoTexto) / 2; // Ajusta según el nuevo ancho

            // Mostrar la opción seleccionada en el cuadro verde (sin añadir margen adicional)
            doc.text(texto, posicionCentradaX, textYPosition);

            // Restablecer la fuente a normal para el texto predeterminado
            doc.setFont(undefined, "normal");


            // Texto predeterminado debajo del cuadro verde
            doc.setFontSize(11);

            // Establecer el texto normal para evitar negrita
            doc.setFont(undefined, "normal");

            let textoPredeterminado =
                "Con RGR N° 1536-2024-GR-LL-GGR-GRS, la Gerencia Regional de Salud – La Libertad, nos otorga la Autorización Sanitaria para el tratamiento de Aguas Residuales – Tipo Domésticas, a través del uso de tanques sépticos y filtros.";


            let textoYPosition = textYPosition + 10; // Ajusta la posición Y
            let textLines = doc.splitTextToSize(textoPredeterminado, contentWidth);

            // Agregar el texto con justificación y factor de interlineado ajustado
            doc.text(textLines, margin, textoYPosition, {
                align: 'justify',
                maxWidth: contentWidth,
                lineHeightFactor: 1.8 // Ajuste del interlineado
            });

            // Texto predeterminado adicional
            let empresaTexto = "ALTO CHICAMA S.R.L. "; // Solo este en bold
            let textoDescripcion1 = "certifica haber recibido aguas residuales para su tratamiento, de acuerdo";
            let textoDescripcion2 = "al siguiente detalle:";

            // Ajustar la posición del texto para que no choque
            let textoYPositionAdicional = textoYPosition + textLines.length * 7 + 3; // Ajuste de posición

            // Cambiar el tamaño de la fuente y agregar el primer bloque de texto
            doc.setFontSize(10.5); // Reducir tamaño de "ALTO CHICAMA S.R.L."
            doc.setFont(undefined, "bold");
            doc.text(empresaTexto, margin, textoYPositionAdicional); // Solo "ALTO CHICAMA S.R.L." en bold

            // Volver al tamaño normal y agregar el texto normal después
            doc.setFont(undefined, "normal");
            doc.setFontSize(11); // Volver al tamaño normal
            doc.text(
                textoDescripcion1,
                margin + doc.getTextWidth(empresaTexto), // El texto normal continúa después del nombre de la empresa
                textoYPositionAdicional
            );

            // Ajustar la posición del siguiente texto
            textoYPositionAdicional += 6.5; // Aumentar espacio entre líneas
            doc.text(textoDescripcion2, margin, textoYPositionAdicional);


            // Función para dividir texto largo en líneas
            function splitTextToLines(text, maxWidth, doc) {
                let words = text.split(" ");
                let lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    let word = words[i];
                    let width = doc.getTextWidth(currentLine + " " + word);
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine); // Agrega la última línea
                return lines;
            }

            // Inicializa `startY` antes de usarlo
            let startY = 101;
            let minCellHeight = 12; // Altura mínima por celda
            let padding = 4; // Espacio adicional dentro de las celdas

            // Definir el ancho total del documento
            let totalWidth = contentWidth; // O el ancho que consideres adecuado

            // Asignar porcentajes fijos para las columnas
            let colWidthsPercentages = [15, 35, 40, 10];

            // Convertir los porcentajes en píxeles
            let colWidths = colWidthsPercentages.map(percentage => (percentage / 100) * totalWidth);

            let abreviacion = document.getElementById("abreviacion").value;
            let guiaText = "N° de Guía " + abreviacion;

            // Si la longitud total es mayor a 22 caracteres, insertar un salto de línea
            if (guiaText.length > 24) {
                guiaText = "N° de Guía\n" + abreviacion; // Añadir salto de línea
            }

            let headers = [
                "Fecha",
                guiaText, // Usar la variable ajustada
                tipoResiduotittle,
                "  M³",
            ];

            // Encabezados en negrita
            doc.setFont(undefined, "bold");
            headers.forEach((header, index) => {
                let cellWidth = colWidths[index];

                // Dibujar la celda del encabezado
                doc.rect(margin + colWidths.slice(0, index).reduce((a, b) => a + b + 0.3, 0), startY, cellWidth + 0.3, minCellHeight);

                // Coordenadas de los encabezados
                let headerX = margin + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + cellWidth / 2;
                let headerY = startY + minCellHeight / 2 + doc.getTextDimensions(header).h / 4; // Centrado verticalmente

                // Verificar si el texto contiene un salto de línea
                if (header.includes("\n")) {
                    let lines = header.split("\n");
                    lines.forEach((line, lineIndex) => {
                        let lineHeight = doc.getTextDimensions(line).h; // Altura de la línea
                        let lineY = headerY + lineHeight * (lineIndex - (lines.length - 1) / 2); // Ajustar la posición para centrar las líneas
                        doc.text(line, headerX, lineY, null, null, "center");
                    });
                } else {
                    doc.text(header, headerX, headerY, null, null, "center");
                }
            });
            doc.setFont(undefined, "normal");

            startY += minCellHeight;

            // Convertir la fecha de "AAAA-MM-DD" a "DD-MM-AAAA"
            let fechaOriginal = document.getElementById("fecha").value;
            let [year, month, day] = fechaOriginal.split("-");
            let fechaFormateada = `${day}-${month}-${year}`; // Nueva fecha con formato "DD-MM-AAAA"

            let rowData = [
                fechaFormateada, // Usar la fecha formateada
                document.getElementById("numeroGuia").value,
                tipoResiduo,
                cantidad,
            ];

            // Renderizar celdas de los datos
            rowData.forEach((data, index) => {
                let cellWidth = colWidths[index];
                let maxTextWidth = cellWidth - padding; // Margen dentro de la celda
                let lines = splitTextToLines(data, maxTextWidth, doc);

                // Calcula la altura necesaria para las líneas
                let lineHeight = 6; // Altura de cada línea de texto
                let totalTextHeight = lines.length * lineHeight;
                let cellHeight = Math.max(totalTextHeight, minCellHeight); // Elige la mayor entre el mínimo y el calculado

                // Dibuja el rectángulo de la celda
                doc.rect(margin + colWidths.slice(0, index).reduce((a, b) => a + b + 0.3, 0), startY, cellWidth + 0.3, cellHeight);

                // Centramos verticalmente el texto
                let textY = startY + (cellHeight - totalTextHeight) / 2 + (totalTextHeight > cellHeight ? 0 : lineHeight / 1.5); // Ajuste para centrar

                lines.forEach((line) => {
                    let textWidth = doc.getTextWidth(line);
                    let textX = margin + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + (cellWidth - textWidth) / 2; // Centramos horizontalmente
                    doc.text(line, textX, textY);
                    textY += lineHeight; // Mueve hacia abajo para la siguiente línea
                });
            });

            if (residuos) {
                doc.setFontSize(11);
                let texto = `${residuoDir} provenientes de la siguiente dirección: ${residuosNombre}, generados por la empresa:`;

                // Divide el texto para ajustarlo al ancho de la página
                let splittedText = doc.splitTextToSize(texto, contentWidth);

                // Dibuja el texto en la posición correspondiente con los mismos estilos
                doc.text(splittedText, margin, textoYPositionAdicional + 38, {
                    lineHeightFactor: 1.7
                });
            }

            // Cuadro con información de RUC y Nombre de la Empresa
            doc.setFontSize(11);
            let infoStartY = textoYPositionAdicional + 50;
            let infoCellWidthLeft = contentWidth * 0.7; // 70% del ancho para la primera celda
            let infoCellWidthRight = contentWidth * 0.3; // 30% del ancho para la segunda celda
            let infoCellHeight = 10;

            //let nomEmpresa = `${document.getElementById("nomEmpresa").value}`;
            let rucValue = `RUC: ${document.getElementById("ruc").value}`;

            // Dibuja la primera celda (nombre de la empresa)
            doc.rect(margin, infoStartY, infoCellWidthLeft, infoCellHeight);

            // Ajustar el estilo de fuente a negrita para el nombre de la empresa
            doc.setFont(undefined, "bold");

            // Calcular el ancho del texto y centrarlo
            let textWidthEmpresa = doc.getTextWidth(nomEmpresa);
            let textXEmpresa =
                margin + (infoCellWidthLeft - textWidthEmpresa) / 2;
            doc.text(nomEmpresa, textXEmpresa, infoStartY + 7);

            // Restaurar el estilo de fuente normal para el resto del texto
            doc.setFont(undefined, "normal");

            // Dibuja la segunda celda (RUC) a la derecha de la primera
            doc.rect(
                margin + infoCellWidthLeft,
                infoStartY,
                infoCellWidthRight + 1,
                infoCellHeight
            );

            // Calcular el ancho del texto y centrarlo
            let textWidthRuc = doc.getTextWidth(rucValue);
            let textXRuc =
                margin +
                infoCellWidthLeft +
                (infoCellWidthRight - textWidthRuc) / 2;
            doc.text(rucValue, textXRuc, infoStartY + 7);

            // Agregar el texto predeterminado con los datos de la empresa y el RUC
            doc.setFontSize(11);
            let nombreEmpresa = document.getElementById("input_transportista").value;
            let ruct = document.getElementById("ruct").value;

            // Texto con los datos de la empresa y el RUC
            let textoPredeterminado3 = `Transportados por la empresa ${nombreEmpresa} con RUC: ${ruct} hacia la Planta de Alto Chicama, ubicada en la Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad; para su tratamiento.`;

            // Dividir el texto en líneas que se ajusten al ancho del contenido
            let splittedText = doc.splitTextToSize(textoPredeterminado3, contentWidth);

            // Agregar el texto con justificación y factor de interlineado ajustado
            doc.text(splittedText, margin, infoStartY + 20, {
                align: 'justify',
                maxWidth: contentWidth,
                lineHeightFactor: 1.7 // Ajuste del interlineado
            });

            // Firma de la empresa
            doc.addImage(imgFirma, "PNG", 75, startY + 78, 51, 26);

            // Leer la imagen del QR

            // Agregar la imagen del QR
            doc.addImage(imgQR12, "PNG", 162, startY + 122, 25, 25); // Ajusta las coordenadas y tamaño según sea necesario
            // Obtener la fecha de la ID 'fecha' y transformarla
            // Obtener la fecha en formato 'YYYY-MM-DD'
            const fechaString = document.getElementById("fecha").value; // Formato 'YYYY-MM-DD'

            // Convertir la fecha de formato 'YYYY-MM-DD' a un objeto Date
            const [anio, mes, dia] = fechaString.split('-').map(Number);

            // Crear un objeto Date usando el valor sin ajuste de zona horaria
            const fecha = new Date(anio, mes - 1, dia);

            // Crear una función que obtenga la fecha en formato local
            function obtenerFechaLocal(fecha) {
                const dia = fecha.getDate();
                const mes = fecha.getMonth(); // Nota: los meses van de 0 a 11
                const anio = fecha.getFullYear();

                return { dia, mes, anio };
            }

            // Obtener la fecha en formato local
            const { dia: diaLocal, mes: mesLocal, anio: anioLocal } = obtenerFechaLocal(fecha);

            // Array de nombres de meses
            const meses = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];

            // Crear la cadena de texto para la fecha
            const textoFecha = `Trujillo, ${diaLocal} de ${meses[mesLocal]} del ${anioLocal}`;

            // Obtener el ancho de la página y calcular la posición para el texto
            const pdfPageWidth = doc.internal.pageSize.width; // Usar un nombre diferente para evitar conflictos
            const textWidth = doc.getTextWidth(textoFecha); // Ancho del texto
            const textX = pdfPageWidth - textWidth - 10; // Posición X (alineado a la derecha)
            const textY = startY + 120; // Posición Y (ajusta según sea necesario)


            doc.setFontSize(10);
            doc.setTextColor(105, 105, 105); // Color gris para el texto

            // Añadir la fecha al PDF
            doc.text(textoFecha, textX, textY);

            // Texto adicional en la parte inferior izquierda
            const textLeft = 22; // Posición en X
            const textBottom = pageHeight - 40; // Posición en Y (desde abajo)

            doc.setFontSize(10);
            doc.setTextColor(105, 105, 105); // Color gris para el texto

            // Primera línea de texto
            doc.text(
                "OFICINA / INFRAESTRUCTURA DE VALORIZACIÓN",
                textLeft,
                textBottom
            );

            // Segunda línea de texto
            doc.text(
                "Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad",
                textLeft,
                textBottom + 5
            );

            // Tercera línea de texto
            doc.text("comercial@", textLeft, textBottom + 10);
            doc.setTextColor(0, 128, 0); // Color verde para el correo
            doc.text(
                "serviciosambientalesaltochicama.com",
                textLeft + doc.getTextWidth("comercial@"),
                textBottom + 10
            );

            // Cuarta línea de texto
            doc.setTextColor(105, 105, 105); // Volver a color gris
            doc.text("914 105 601 | 913 036 413", textLeft, textBottom + 15);
            //DESCARGA
            const pdfData = doc.output('blob');
            const cero = 0;
            resolve({ guia_numero, descarga, cantidad, unidad, transportistaid, fechaformulario, cero, direccionform, pdfData, empresaid, num_doc });
            //window.location.reload();
        });
    } else {
        return Promise.reject(new Error("Tipo de formulario no válido"));
    }
}

async function generarYGuardarPDF() {
    try {
        const pdfBlob = await generarPDF();
        console.log(pdfBlob);
        guardarDocumento(pdfBlob);

        // Convertir el Blob a una cadena base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        throw error;
    }
}