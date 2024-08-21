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

function loginAdmin() {
    var dataPost = {
        admin_user: $("#input_usuario").val(),
        admin_password: $("#input_password").val(),
    };
    dataPost = trimJSONFields(dataPost);

    var endpoint = getDomain() + "/Admin/LoginAdmin";
    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(dataPost),
        dataType: "json",
        beforeSend: function (xhr) {
            console.log("Cargando...");
        },
        success: function (data) {
            var rpta = data.item1;
            var msg = data.item2;
            if (rpta == "0") {
                // Redirigir a una página protegida
                window.location.href = getDomain() + "/Repositorio";
                console.log("Inicio de sesión correcto");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: msg,
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            const errorMessageElement = document.getElementById('errorMessage');
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                errorMessageElement.textContent = "Usuario o contraseña incorrectos";
            } else {
                errorMessageElement.textContent = "Usuario o contraseña incorrectos";
            }
            errorMessageElement.style.display = 'block';
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    // Obtén el botón por su ID
    const loginButton = document.getElementById('loginButton');

    // Añade el manejador de eventos al botón
    loginButton.addEventListener('click', function (event) {
        // Prevenir la acción por defecto del botón
        event.preventDefault();

        // Llama a la función
        loginAdmin();
    });
});

function getListEmpresa() {
    endpoint = getDomain() + "/Empresa/ListaEmpresa";

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
                var dataEmpresa = data.item3;
                console.log(dataEmpresa); // Muestra la data en la consola
                resolve(dataEmpresa);
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", error);
                reject(error);
            }
        });
    });
}