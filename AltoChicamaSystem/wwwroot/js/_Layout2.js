// Función para calcular el total
function calcularTotal() {
    var inputToneladas = document.getElementById('input_toneladas');
    var inputPrecioTonelada = document.getElementById('input_precioTonelada');

    // Verifica que los elementos de toneladas y precio por tonelada existan
    if (inputToneladas && inputPrecioTonelada) {
        var toneladas = parseFloat(inputToneladas.value) || 0;
        var precio = parseFloat(inputPrecioTonelada.value) || 0;

        var totalSinIGV = toneladas * precio;
        var igv = 0.18; // 18%
        var totalConIGV = totalSinIGV * (1 + igv);

        // Verifica si los campos para mostrar resultados existen
        var inputTotal = document.getElementById('input_total');
        var inputIGV = document.getElementById('input_igv');

        if (inputTotal) {
            inputTotal.value = totalSinIGV.toFixed(2);
        }

        if (inputIGV) {
            inputIGV.value = totalConIGV.toFixed(2);
        }

        calcularTotalConDetraccion(totalConIGV);
    }
}

// Función para calcular el total después de la detracción
function calcularTotalConDetraccion(totalConIGV) {
    var inputDetraccion = document.getElementById('input_detraccion');

    if (inputDetraccion) {
        var detraccion = parseFloat(inputDetraccion.value) || 0;
        var totalConDetraccion = totalConIGV - detraccion;

        var inputTotalIGV = document.getElementById('input_totalIGV');
        if (inputTotalIGV) {
            inputTotalIGV.value = totalConDetraccion.toFixed(2);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var inputToneladas = document.getElementById('input_toneladas');
    var inputPrecioTonelada = document.getElementById('input_precioTonelada');
    var inputDetraccion = document.getElementById('input_detraccion');

    // Asocia los eventos solo si los elementos existen
    if (inputToneladas) {
        inputToneladas.addEventListener('input', calcularTotal);
    }

    if (inputPrecioTonelada) {
        inputPrecioTonelada.addEventListener('input', calcularTotal);
    }

    if (inputDetraccion) {
        inputDetraccion.addEventListener('input', calcularTotal);
    }
});

const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"), modeText = body.querySelector(".mode-text");
const form = document.getElementById("file-upload-form");
const fileInput = document.getElementById("file-upload");
const pdfPreview = document.getElementById("pdf-preview");
const pdfFileName = document.getElementById("pdf-file-name");
const notPdf = document.getElementById("notpdf");
const response = document.getElementById("response");
const messages = document.getElementById("messages");
const fileProgress = document.getElementById("file-progress");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        pdfPreview.classList.remove("hidden");
        pdfFileName.textContent = file.name;
        notPdf.classList.add("hidden");
    } else {
        pdfPreview.classList.add("hidden");
        notPdf.classList.remove("hidden");
    }
});



form.addEventListener("submit", function (event) {
    event.preventDefault();
    cargarDataPDF();
});

// Función para llenar el select de empresas
function EmpresaSelect() {
    var endpoint = getDomain() + "/Empresa/EmpresaSelect";

    $.ajax({
        type: "GET",
        async: true,
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando empresas...");
        },
        success: function (data) {
            var EmpresaSelect = data.item3;

            // Limpiar el select y agregar opción por defecto
            $('#input_empresa').empty();
            $('#input_empresa').append(new Option("Seleccione una empresa...", "", true, true));

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (EmpresaSelect && EmpresaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < EmpresaSelect.length; i++) {
                    var item = EmpresaSelect[i];
                    $('#input_empresa').append(new Option(item.empresa_name, item.empresa_id));
                }
            } else {
                console.log("No se encontraron empresas.");
                $('#input_empresa').append(new Option("No hay empresas disponibles", ""));
            }

            // Inicializar o actualizar Select2 usando directamente el ID del select
            $('#input_empresa').select2({
                placeholder: "Seleccione una empresa...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
            });

            // Habilitar el select
            $('#input_empresa').prop("disabled", false);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al cargar empresas: ' + textStatus);
            console.error("Error al cargar empresas:", textStatus, errorThrown);
        }
    });
}

function obtenerIdEmpresaSeleccionada(id_grupo) {
    // Obtener el valor de la opción seleccionada en el select
    var valorSeleccionado = $(id_grupo).val();

    return valorSeleccionado;  // Retorna el valor (empresa_id) seleccionado
}

// Llamada inicial para llenar el select de empresas
EmpresaSelect("#input_empresa");

$(document).on('click', '.btnGuardar', function () {
    EmpresaSelect("#input_empresa");
    var empresa_id = $("#input_empresa_id").val();
    guardarDocumento(empresa_id);
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
            console.log("Cargando transportistas...");
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

            // Inicializar o actualizar Select2 usando directamente el ID del select
            $(id_transportista).select2({
                placeholder: "Seleccione un transportista...",
                allowClear: true,
                language: "es",
                dropdownCssClass: 'limit-dropdown' // Añadir la clase para limitar altura
            });

            // Habilitar el select
            $(id_transportista).prop("disabled", false);
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
    var empresa_id = $("#input_transportista_id").val();
    guardarDocumento(transportista_id);
});

// Guardar documento
function cargarDataPDF() {
    var inputFile = document.getElementById('file-upload');
    var file = inputFile.files[0];

    if (!file) {
        Swal.fire({
            title: 'Error',
            text: 'Debe seleccionar un archivo PDF.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    guardarDocumento(file);
}


function vaciarFormulario() {
    // Limpia los campos de fecha
    $('#input_fechaServicio').val('');
    $('#input_fechaPago').val('');

    // Limpia el campo de toneladas
    $('#input_toneladas').val('');

    // Limpia el campo de precio por tonelada
    $('#input_precioTonelada').val('');

    // Limpia el campo de precio sin IGV
    $('#input_total').val('');

    // Limpia el campo de precio con IGV
    $('#input_igv').val('');

    // Limpia el campo de detracción
    $('#input_detraccion').val('');

    // Limpia el campo de total con IGV
    $('#input_totalIGV').val('');

    // Resetea el área de respuesta y la barra de progreso si es necesario

    // Oculta el área de respuesta y reinicia la barra de progreso
    $('#response').addClass('hidden');
    $('#file-progress').val(0);
    $('#file-progress').find('span').text('0');

    // Limpia el texto del nombre del archivo PDF
    $('#pdf-file-name').text('');

    // Limpia las selecciones de empresa y transportista
    $('#input_empresa').val('');
    $('#input_transportista').val('');

}

async function guardarDocumento(file) {
    var empresa_id = obtenerIdEmpresaSeleccionada("#input_empresa");
    var transportista_id = obtenerIdTransportistaSeleccionada("#input_transportista");

    if (!empresa_id) {
        Swal.fire({
            title: 'Error',
            text: 'Debe seleccionar una empresa.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // El return está dentro de la función
    }

    if (!transportista_id) {
        Swal.fire({
            title: 'Error',
            text: 'Debe seleccionar un transportista.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // El return está dentro de la función
    }

    // Capturar las fechas y el total
    var fechaServicio = document.getElementById('input_fechaServicio').value;
    var fechaPago = document.getElementById('input_fechaPago').value;
    var totalIGV = document.getElementById('input_totalIGV').value;

    var formData = new FormData();
    formData.append('documento_titulo', file.name);
    formData.append('documento_pdf', file);
    formData.append('empresa_id', empresa_id);
    formData.append('transportista_id', transportista_id);

    // Agregar las fechas y el total
    formData.append('fecha_servicio', fechaServicio);  // @fecha_servicio
    formData.append('fecha_pago', fechaPago);          // @fecha_pago
    formData.append('documento_deuda', totalIGV);

    // Mostrar los datos que se están enviando
    console.log("Datos enviados a Upload/RegDocumento:");
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    var endpoint = getDomain() + "/Upload/RegDocumento";

    // Mostrar la barra de progreso
    var progressBar = document.getElementById('file-progress');
    var responseContainer = document.getElementById('response');
    responseContainer.classList.remove('hidden');

    $.ajax({
        type: "POST",
        url: endpoint,
        processData: false,
        contentType: false,
        data: formData,
        xhr: function () {
            var xhr = new window.XMLHttpRequest();

            // Progreso de carga
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total * 100;
                    progressBar.value = percentComplete;
                    progressBar.getElementsByTagName('span')[0].innerHTML = Math.round(percentComplete);
                }
            }, false);

            return xhr;
        },
        beforeSend: function () {
            console.log("Guardando...");
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta === "0") {
                Swal.fire({
                    title: 'Documento guardado con éxito',
                    text: msg,
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    vaciarFormulario(); // Vaciar el formulario después del éxito
                });
            } else {
                Swal.fire({
                    title: 'Ocurrió un error',
                    text: msg,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msg = jqXHR.responseJSON ? jqXHR.responseJSON.message : errorThrown;
            Swal.fire({
                title: 'Ya se ha registrado un documento con ese nombre',
                text: msg,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            responseContainer.classList.add('hidden');
            progressBar.value = 0;
        },
        complete: function () {
            // Ocultar la barra de progreso después de la carga
            responseContainer.classList.add('hidden');
            progressBar.value = 0;
        }
    });
}


function mostrarPDFEnModal(documentoId) {
    // URL de la API que devuelve el PDF según el ID
    const apiUrl = `/api/Documento/ObtenerDocumento/${documentoId}`;

    // Realiza una solicitud AJAX para obtener el documento PDF
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el documento');
            }
            return response.blob(); // Convierte la respuesta en un Blob
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);

            // Configurar el modal con el iframe para mostrar el PDF
            const modalContent = `
                <div class="modal fade" id="pdfModal" tabindex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="pdfModalLabel">Documento PDF</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <iframe src="${url}" width="100%" height="600px"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Añadir el modal al body y mostrarlo
            document.body.insertAdjacentHTML('beforeend', modalContent);
            const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
            modal.show();

            // Eliminar el modal cuando se cierre
            document.getElementById('pdfModal').addEventListener('hidden.bs.modal', () => {
                document.getElementById('pdfModal').remove();
                URL.revokeObjectURL(url);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al obtener el documento PDF');
        });
}


function generarEnlacePermanente(documentoId) {
    // URL de la API que devuelve el PDF directamente
    const enlace = `/api/Documento/Ver/${documentoId}`;
    return enlace;
}

function abrirEnlaceEnVentana(documentoId) {
    const enlace = `/api/Documento/Ver/${documentoId}`;
    const viewerUrl = `/views/pdf-viewer.html?file=${encodeURIComponent(window.location.origin + enlace)}`;
    //window.open(viewerUrl, '_blank');
    return viewerUrl;
}
