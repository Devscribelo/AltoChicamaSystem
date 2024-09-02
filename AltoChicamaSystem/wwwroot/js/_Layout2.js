const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),    modeText = body.querySelector(".mode-text");
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
function EmpresaSelect(id_grupo) {
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
            console.log("cargando");
        },
        success: function (data) {
            var EmpresaSelect = data.item3;

            // Limpiar el select y agregar opción por defecto
            if (id_grupo === "#input_empresa") {
                $(id_grupo).empty();
                $(id_grupo).append('<option value="" disabled selected>Seleccione una empresa...</option>');
            }

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (EmpresaSelect && EmpresaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < EmpresaSelect.length; i++) {
                    var item = EmpresaSelect[i];
                    $(id_grupo).append(
                        '<option value="' + item.empresa_id + '">' + item.empresa_name + '</option>'
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
        return;
    }

    if (!transportista_id) {
        Swal.fire({
            title: 'Error',
            text: 'Debe seleccionar un transportista.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    var formData = new FormData();
    formData.append('documento_titulo', file.name);
    formData.append('documento_pdf', file);
    formData.append('empresa_id', empresa_id);
    formData.append('transportista_id', transportista_id);

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
