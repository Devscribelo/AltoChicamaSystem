function getDomain() {
    return "https://" + window.location.host;
}
$(document).ready(function () {
    regEmpresa();

});
function regEmpresa() {
    var dataPost = {
        empresa_name = val("Canicas"),
        empresa_ruc = val("1231"),
        empresa_correo = val("sdasda@faf.com"),
    };
    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Empresa/RegEmpresa";
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
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                // Actualizar la tabla sin recargar la página
                console.log("Guardado Correctamente");
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
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