
const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"), modeText = body.querySelector(".mode-text");
const pdfPreview = document.getElementById("pdf-preview");
const pdfFileName = document.getElementById("pdf-file-name");
const notPdf = document.getElementById("notpdf");
const response = document.getElementById("response");
const messages = document.getElementById("messages");
const fileProgress = document.getElementById("file-progress");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})



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
