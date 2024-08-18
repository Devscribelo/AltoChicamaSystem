function getDomain() {
    return "https://" + window.location.host;
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
