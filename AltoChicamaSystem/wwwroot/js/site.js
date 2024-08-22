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
                // Redirigir a una p�gina protegida
                window.location.href = getDomain() + "/Repositorio";
                console.log("Inicio de sesi�n correcto");
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

var loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', function (event) {
    event.preventDefault();
    loginAdmin();
});