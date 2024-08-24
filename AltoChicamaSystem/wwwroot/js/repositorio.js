﻿$(document).ready(function () {
    getListDocumento();
});

function copiarTexto(texto) {
    // Crear un elemento de texto temporal
    const tempInput = document.createElement('input');
    // Establecer el valor del elemento de texto al texto a copiar
    tempInput.value = texto;
    // Agregar el elemento al DOM
    document.body.appendChild(tempInput);
    // Seleccionar el texto del elemento
    tempInput.select();
    // Copiar el texto seleccionado al portapapeles
    document.execCommand('copy');
    // Eliminar el elemento del DOM
    document.body.removeChild(tempInput);
    Swal.fire({
        title: 'Enlace copiado con éxito',
        icon: 'success',
        confirmButtonText: 'OK',
    });
}

function getListDocumento() {
    const apiUrl = `/api/Documento/ObtenerDocumento/`;
    const x = getDomain() + apiUrl;
    endpoint = getDomain() + "/Repositorio/ListaDocumento"

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
                //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                console.log("cargando");
            },

            success: function (data) {
                var dataEmpresa = data.item3;
                var datosRow = "";

                resolve(dataEmpresa);

                for (var i = 0; i < dataEmpresa.length; i++) {
                    datosRow +=
                        "<tr class='filaTabla' " +
                        "data-empresa_id='" + dataEmpresa[i].documento_id + "' " +
                        "data-empresa_name='" + dataEmpresa[i].documento_titulo + "' " +
                        "data-empresa_ruc='" + dataEmpresa[i].empresa_name + "' " +
                        "data-empresa_rucs='" + dataEmpresa[i].documento_id + "'>" +
                        "<td>" + dataEmpresa[i].documento_id + "</td>" +
                        "<td>" + dataEmpresa[i].documento_titulo + "</td>" +
                        "<td>" + dataEmpresa[i].empresa_name + "</td>" +
                        "<td><a href='#' onclick='mostrarPDFEnModal(" + dataEmpresa[i].documento_id + ")'><i class=\"bx bxs-file-pdf\" style=\"font-size: 24px; color: black;\"></i></a></td>" +
                        "<td>" +
                            "<div>"+
                                "<a href='#' onclick='eliminarDocumento(" + dataEmpresa[i].documento_id + ")'><i class=\"bx bxs-trash\" style=\"font-size: 24px; color: red;\"></i></a>"+
                                "<a href=" + apiUrl + dataEmpresa[i].documento_id + "><i class=\"bx bxs-download\" style=\"font-size: 24px; color: green;\"></i></a>" +
                                "<a href='#' onclick=\"copiarTexto('" + x + dataEmpresa[i].documento_id + "')\"><i class=\"bx bxs-share\" style=\"font-size: 24px; color: black;\"></i></a></div></td>" +

                        "</tr>";
                }


                if (!$("#table_empresa").hasClass("dataTable")) {
                    // Inicializar DataTable en la tabla
                    tableEmpresa = $("#table_empresa").DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' // URL de la biblioteca de idioma
                        },
                        dom: 'frtip',
                        buttons: [
                            {
                                extend: 'excel',
                                className: 'btn_export_Excel',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(1))' // Oculta la penúltima y la última columna en la exportación a Excel
                                }
                            },
                            {
                                extend: 'pdf',
                                className: 'btn_export_Pdf',
                                exportOptions: {
                                    columns: ':visible:not(:last-child, :nth-last-child(1))' // Oculta la penúltima y la última columna en la exportación a PDF
                                }
                            }
                        ],
                        colResize: {
                            tableWidthFixed: 'false'
                        },
                        colReorder: true // Activa la funcionalidad de reordenamiento de columnas
                    });
                }

                tableEmpresa.clear();
                tableEmpresa.rows.add($(datosRow)).draw();
            },
            failure: function (data) {
                Swal.close();
                alert('Error fatal ' + data);
                console.log("failure")
            }
        });


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
                data: JSON.stringify({ documento_id: documento_id }),  // Asegúrate de que el nombre del parámetro sea correcto
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