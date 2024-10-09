$(document).ready(function () {
    getListDocumentoCliente(transportistaID);
});

function copiarTexto(texto) {
    const tempInput = document.createElement('input');
    tempInput.value = texto;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    Swal.fire({
        title: 'Enlace copiado con éxito',
        icon: 'success',
        confirmButtonText: 'OK',
    });
}

function formatDateString(dateString) {
    if (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
}

function getListDocumentoCliente(transportista_id) {

    return new Promise((resolve, reject) => {
        const apiUrl = `/api/Documento/ObtenerDocumento/`;
        const x = getDomain() + apiUrl;
        const endpoint = getDomain() + "/RepositorioTransportista/transportistaVista";

        $.ajax({
            type: "POST",
            async: true,
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(transportista_id), // Serializa los datos a JSON
            dataType: "json",
            beforeSend: function (xhr) {
                console.log("cargando");
            },
            success: function (data) {
                var guia = data.item3; // Obt�n los datos de la respuesta
                var datosRow = "";
                console.log(guia);
            

                resolve(guia);

                for (var i = 0; i < guia.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-guia_id='" + formatDateString(guia[i].guia_id) + "'>" + // Corregido aquí
                        "<td>" + guia[i].guia_fecha_servicio + "</td>" +
                        "<td>" + guia[i].guia_numero + "</td>" +
                        "<td>" + guia[i].guia_descarga + "</td>" +
                        "<td>" + guia[i].empresa_name + "</td>" +
                        "<td>" + guia[i].empresa_ruc + "</td>" +
                        "<td>" + guia[i].guia_direccion + "</td>" +
                        "<td>" + guia[i].guia_cantidad + "</td>" +
                        "<td>" + guia[i].guia_unidad + "</td>" +
                        
                        `<td><a href='#' onclick='mostrarPDFEnModal(${guia[i].documento_id})'><span class='icon-circle'><i class="bx bxs-file-pdf"></i></span></a></td>` +
                        "<td id='acciones'>" +
                        `<a href='/api/Documento/ObtenerDocumento/${guia[i].documento_id}'><span class='icon-circle green'><i class="bx bxs-download"></i></span></a>` +
                        `<a href='#' onclick="copiarTexto('${getDomain()}${abrirEnlaceEnVentana(guia[i].documento_id)}')"><span class='icon-circle black'><i class="bx bxs-share-alt"></i></span></a>` +
                        "</td>" +
                        "</tr>";
                }

                if (!$("#tableEmpresa").hasClass("dataTable")) {
                    tableEmpresa = $("#tableEmpresa").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
                        },
                        dom: 'frtip',   
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

                tableEmpresa.clear();
                tableEmpresa.rows.add($(datosRow)).draw();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.close();
                alert('Error fatal: ' + textStatus + ' - ' + errorThrown);
                console.log("failure: " + textStatus + " - " + errorThrown);
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
                getListDocumento();
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
function eliminarDocumento(documento_id) {
    var endpoint = getDomain() + "/Repositorio/EliminarDocumento";

    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: endpoint,
                data: JSON.stringify({ documento_id: documento_id }),  // Aseg�rate de que el nombre del par�metro sea correcto
                contentType: "application/json",
                success: function (response) {
                    if (response.item1 === "0") {
                        Swal.fire(
                            'Eliminado!',
                            response.item2,
                            'success'
                        );
                        getListDocumento(); // Recarga la lista de documentos
                    } else {
                        Swal.fire('Error!', response.item2, 'error');
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire('Error!', 'Hubo un problema al eliminar el documento.', 'error');
                }
            });
        }
    });
}