function getDomain() {
    return "https://" + window.location.host;
}
function trimJSONFields(obj) {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string') {
            return obj.trim();
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(trimJSONFields);
    }

    const trimmedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            trimmedObj[key] = trimJSONFields(value);
        }
    }
    return trimmedObj;
}
$(document).ready(function () {
    getListUsuario();

});
function getListUsuario() {
    endpoint = getDomain() + "/Usuario/ListaUsuario";

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
                console.log("Cargando...");
            },
            success: function (data) {
                var dataUsuario = data.item3;
                console.log(dataUsuario); // Muestra la data en la consola
                resolve(dataUsuario);
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", error);
                reject(error);
            }
        });
    });
}

function regEmpresa() {
    var dataPost = {
        empresa_name: "Canicas",
        empresa_ruc: "1231",
        empresa_correo: "sdasda@faf.com",
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
