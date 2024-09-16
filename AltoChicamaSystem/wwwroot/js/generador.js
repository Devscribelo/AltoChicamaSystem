function showForm(formId) {
    // Obtener todos los contenedores de formularios
    const forms = document.querySelectorAll(".form-container");

    // Ocultar todos los contenedores
    forms.forEach((form) => {
        form.style.display = "none";
    });

    // Mostrar el contenedor del formulario seleccionado
    document.getElementById(formId).style.display = "block";

    // Obtener todos los botones
    const buttons = document.querySelectorAll(".buttons button");

    // Remover la clase activa de todos los botones
    buttons.forEach((button) => {
        button.classList.remove("button-active");
    });

    // Agregar la clase activa al botón seleccionado
    const activeButton = document.getElementById(`btn${formId.replace('pdf', '')}`);
    if (activeButton) {
        activeButton.classList.add("button-active");
    }
}

// Inicialmente ocultar todos los formularios y aplicar la clase activa al botón por defecto
document.addEventListener("DOMContentLoaded", () => {
    showForm("pdfResiduos"); // Mostrar por defecto el formulario de residuos sólidos
});

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
            if (id_grupo === "#nomEmpresa" || id_grupo === "#nomEmpresa1") {
                $(id_grupo).empty();
                $(id_grupo).append('<option value="" disabled selected>Seleccione una empresa...</option>');
            }

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (EmpresaSelect && EmpresaSelect.length > 0) {
                // Guardar datos de las empresas en una variable accesible
                var empresas = {};

                // Agregar opciones al select
                for (var i = 0; i < EmpresaSelect.length; i++) {
                    var item = EmpresaSelect[i];
                    $(id_grupo).append(
                        '<option value="' + item.empresa_name + '">' + item.empresa_name + '</option>'
                    );
                    empresas[item.empresa_name] = item.empresa_ruc;
                }

                // Manejar el evento de cambio en el select
                $(id_grupo).change(function () {
                    var selectedEmpresa = $(this).val();
                    if (empresas[selectedEmpresa]) {
                        document.getElementById('ruc').value = empresas[selectedEmpresa];
                        document.getElementById('ruc1').value = empresas[selectedEmpresa];
                    }
                });
            }
        },
        error: function (data) {
            alert('Error fatal ' + data);
            console.log("failure");
        }
    });
}


EmpresaSelect("#nomEmpresa");
EmpresaSelect("#nomEmpresa1");

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
            if (id_transportista === "#empresa" || id_transportista === "#empresa1" ) {
                $(id_transportista).empty();
                $(id_transportista).append('<option value="" disabled selected>Seleccione un transportista...</option>');
            }

            // Verificar si la data es null, vacía, o contiene solo espacios en blanco
            if (TransportistaSelect && TransportistaSelect.length > 0) {
                // Agregar opciones al select
                for (var i = 0; i < TransportistaSelect.length; i++) {
                    var item = TransportistaSelect[i];
                    $(id_transportista).append(
                        '<option value="' + item.transportista_nombre + '">' + item.transportista_nombre + '</option>'
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
TransportistaSelect("#empresa");
TransportistaSelect("#empresa1");
async function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}
let documentoidvalor;
function obtenerMayorDocumentoID() {
    var endpoint = "/Repositorio/ObtenerMayorDocumentoID"; // Ruta relativa del endpoint

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            success: function (data) {
                console.log("Respuesta del servidor:", data); // Inspecciona la respuesta completa
                console.log(data.item3);
                documentoidvalor = parseInt(data.item3) + 1;
                usarQR();

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Error fatal: ' + error);
                reject(error); // Rechaza la promesa en caso de error
            }
        });
    });
}

function Documento_MaxNumero() {
    var endpoint = "/Repositorio/Documento_MaxNumero"; // Ruta relativa del endpoint

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            success: function (data) {
                console.log("Respuesta del servidor:", data); // Inspecciona la respuesta completa
                console.log(data.item3);

                // Asegúrate de que `data.item3` sea el valor que necesitas y conviértelo a string
                var obtenerdocumentonumero = (parseInt(data.item3) + 1).toString();
                usarQR(); // Llama a la función usarQR

                // Asigna el valor convertido a los campos de código de empresa
                document.getElementById('codigoEmpresa').value = obtenerdocumentonumero;
                document.getElementById('codigoEmpresa1').value = obtenerdocumentonumero;

                // Resuelve la promesa con el valor string
                resolve(obtenerdocumentonumero);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Error fatal: ' + error);
                reject(error); // Rechaza la promesa en caso de error
            }
        });
    });
}

Documento_MaxNumero()


function abrirEnlaceEnVentana(documentoId) {
    const enlace = `/api/Documento/Ver/${documentoId}`;
    const viewerUrl = `/views/pdf-viewer.html?file=${encodeURIComponent(window.location.origin + enlace)}`;
    //window.open(viewerUrl, '_blank');
    return viewerUrl;
}

let imgQR12; // Variable global para almacenar la imagen QR en base64

function generarQR(documentoId) {
    return new Promise((resolve, reject) => {
        var dominio = getDomain();
        var enlace = dominio + abrirEnlaceEnVentana(documentoId);
        console.log(enlace);
        const contenedorQR = document.getElementById('qrcode');

        if (!contenedorQR) {
            reject("El contenedor QR no se encontró.");
            return;
        }

        // Limpiar cualquier QR previo
        contenedorQR.innerHTML = "";

        // Generar el QR con el enlace proporcionado
        const qrCode = new QRCode(contenedorQR, {
            text: enlace,
            width: 128,  // Ancho del QR
            height: 128  // Alto del QR
        });

        // Esperar a que el QR se genere y convertir a imagen
        setTimeout(() => {
            // Obtener el canvas del QR generado
            const canvas = contenedorQR.querySelector('canvas');

            if (canvas) {
                // Convertir el canvas a una imagen PNG en formato base64
                imgQR12 = canvas.toDataURL('image/png'); // Asigna el resultado a imgQR1
                resolve(imgQR12); // Retorna la imagen en base64
            } else {
                reject("No se pudo generar el QR.");
            }
        }, 1000); // Ajustar el tiempo de espera según sea necesario
    });
}

// Ejemplo de uso
async function usarQR() {
    try {
        var enlace = documentoidvalor;
        const qrData = await generarQR(enlace);
        console.log(qrData); // imgQR1 contiene la imagen QR en base64
        // Aquí puedes hacer algo con imgQR1
    } catch (error) {
        console.error('Error al usar el QR:', error);
    }
}
obtenerMayorDocumentoID();
async function generarPDF(formId) {
    const { jsPDF } = window.jspdf;
    
    if (formId === "pdfResiduos") {
        const input = document.getElementById("firma");
        const file = input.files[0];
        let residuos = document.getElementById("residuos").value;
        let fecha = document.getElementById("fecha").value;
        let numeroGuia = document.getElementById("numeroGuia").value;
        let empresa = document.getElementById("empresa").value;
        let tipoResiduoTitulo = document.getElementById("tipoResiduoTitulo").value;
        let toneladas = document.getElementById("toneladas").value;
        let nomEmpresa = document.getElementById("nomEmpresa").value;

        if (!file || !residuos || !fecha || !numeroGuia || !empresa || !tipoResiduoTitulo || !toneladas || nomEmpresa) {
            alert("Por favor llene todos los campos");
            return;
        }

        const reader = new FileReader();
        const readerQR = new FileReader();
        reader.onload = async function (event) {
            const imgData = event.target.result;
            const doc = new jsPDF();

            // Cargar las imágenes de encabezado y pie de página
            const imgArriba = await loadImage("img/arriba.png");
            const imgAbajo = await loadImage("img/abajo.png");

            // Márgenes de 5 mm
            const margin = 5;
            const pageWidth = 210; // Ancho total de la página en mm
            const pageHeight = 297; // Alto total de la página en mm
            const contentWidth = pageWidth - 2 * margin;

            // Ajustar altura de imágenes
            const alturaArriba = 39; // Altura en mm para la imagen de encabezado
            const alturaAbajo = 39; // Altura en mm para la imagen de pie de página

            // Cálculo del ancho para mantener la proporción
            const anchoArriba =
                (imgArriba.width / imgArriba.height) * alturaArriba;
            const anchoAbajo = (imgAbajo.width / imgAbajo.height) * alturaAbajo;

            // Encabezado y pie de página
            doc.addImage(imgArriba, "PNG", 0, 0, anchoArriba, alturaArriba); // Encabezado
            doc.addImage(
                imgAbajo,
                "PNG",
                0,
                doc.internal.pageSize.height - alturaAbajo,
                anchoAbajo,
                alturaAbajo
            ); // Pie de página
            // Título
            doc.setFontSize(18);
            doc.setTextColor(0, 100, 0);
            doc.setFont(undefined, "bold");
            doc.text("CERTIFICADO", pageWidth / 2, 50, null, null, "center");
            doc.setFont(undefined, "normal");

            // Número de certificado
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, "bold");
            doc.text(
                "N°" + document.getElementById("codigoEmpresa").value,
                pageWidth / 2,
                60,
                null,
                null,
                "center"
            );
            doc.setFont(undefined, "normal");

            // Cuadro verde sin relleno ajustado a la altura del texto
            doc.setDrawColor(0, 100, 0);
            let textYPosition = 70;
            let textHeight = doc.getTextDimensions(
                `${document.getElementById("opcion").value}`
            ).h;
            let rectYPosition = textYPosition - textHeight / 2 - 2;
            let rectHeight = textHeight + 2;
            doc.rect(margin, rectYPosition, contentWidth, rectHeight);

            // Obtener el texto y el tamaño del texto
            const texto = document.getElementById("opcion").value;
            doc.setFontSize(11);

            // Obtener el ancho del texto usando doc.getTextWidth()
            const anchoTexto = doc.getTextWidth(texto);

            // Calcular la posición centrada
            const anchoPagina = doc.internal.pageSize.getWidth(); // Ancho de la página
            const posicionCentradaX = (anchoPagina - anchoTexto) / 2; // posición centrada

            // Mostrar la opción seleccionada en el cuadro verde (sin añadir margen adicional)
            doc.text(texto, posicionCentradaX, textYPosition);

            // Texto predeterminado debajo del cuadro verde
            doc.setFontSize(11);
            let textoPredeterminado =
                "Con Resolución Directoral N° 0367-2020-MINAM/VMGA/DGRS y Actualización de Registro Autoritativo N° 00028-2020-MINAM/VGMA/DGRS, el Ministerio del Ambiente autoriza nuestra Infraestructura de Valorización de Residuos Sólidos Orgánicos, Inorgánicos No Peligrosos y Residuos Reaprovechables provenientes de la Construcción y Demolición";
            let textoYPosition = textYPosition + 10;
            let textLines = doc.splitTextToSize(
                textoPredeterminado,
                contentWidth
            );
            textLines.forEach((line, index) => {    
                doc.text(line, margin, textoYPosition + index * 6);
            });

            // Texto predeterminado adicional
            let textoAdicional1 = "ALTO CHICAMA S.R.L. ";
            let textoAdicional2 =
                " certifica haber recibido residuos sólidos, según el siguiente detalle:";
            let textoYPositionAdicional =
                textoYPosition + textLines.length * 7 + 5;

            doc.setFont(undefined, "bold");
            doc.text(textoAdicional1, margin, textoYPositionAdicional);
            doc.setFont(undefined, "normal");
            doc.text(
                textoAdicional2,
                margin + doc.getTextWidth(textoAdicional1),
                textoYPositionAdicional
            );

            // Función para dividir texto largo en líneas
            function splitTextToLines(text, maxWidth, doc) {
                let words = text.split(" ");
                let lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    let word = words[i];
                    let width = doc.getTextWidth(currentLine + " " + word);
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine); // Agrega la última línea
                return lines;
            }

            // Inicializa `startY` antes de usarlo
            let startY = 120;
            let cellWidth = contentWidth / 4;
            let cellHeight = 12;

            let headers = [
                "Fecha",
                "N° de Guía \n" + document.getElementById("empresa").value,
                document.getElementById("tipoResiduoTitulo").value,
                "TN",
            ];

            // Encabezados en negrita
            doc.setFont(undefined, "bold");
            headers.forEach((header, index) => {
                doc.rect(
                    margin + index * cellWidth,
                    startY,
                    cellWidth,
                    cellHeight
                );
                let headerX = margin + index * cellWidth + cellWidth / 2;
                let headerY = startY + cellHeight / 2.5;
                doc.text(header, headerX, headerY, null, null, "center");
            });
            doc.setFont(undefined, "normal");

            startY += cellHeight;

            let rowData = [
                document.getElementById("fecha").value,
                document.getElementById("numeroGuia").value,
                document.getElementById("tipoRCD").value,
                document.getElementById("toneladas").value,
            ];

            // Renderizar celdas
            rowData.forEach((data, index) => {
                doc.rect(
                    margin + index * cellWidth,
                    startY,
                    cellWidth,
                    cellHeight
                );

                // Si el texto es muy largo, lo dividimos en líneas
                let maxTextWidth = cellWidth - 4; // Margen dentro de la celda
                let lines = splitTextToLines(data, maxTextWidth, doc);

                // Calcula el inicio Y para centrar el texto verticalmente
                let lineHeight = 5; // Altura de cada línea de texto
                let totalTextHeight = lines.length * lineHeight;
                let textY =
                    startY + (cellHeight - totalTextHeight) / 2 + lineHeight;

                lines.forEach((line) => {
                    let textWidth = doc.getTextWidth(line);
                    let textX =
                        margin + index * cellWidth + (cellWidth - textWidth) / 2; // Centramos horizontalmente
                    doc.text(line, textX, textY);
                    textY += lineHeight; // Mueve hacia abajo para la siguiente línea
                });
            });

            if (residuos) {
                doc.setFontSize(11);
                let texto = `Residuos sólidos provenientes de la siguiente dirección: ${residuos}, generados por:`;
                let splittedText = doc.splitTextToSize(texto, contentWidth);
                doc.text(splittedText, margin, textoYPositionAdicional + 40);
            } else {
                alert("Por favor, complete el campo 'residuos'.");
                return;
            }

            // Cuadro con información de RUC y Nombre de la Empresa
            doc.setFontSize(11);
            let infoStartY = textoYPositionAdicional + 50;
            let infoCellWidthLeft = contentWidth * 0.7; // 70% del ancho para la primera celda
            let infoCellWidthRight = contentWidth * 0.3; // 30% del ancho para la segunda celda
            let infoCellHeight = 10;

            let nomEmpresa = `${document.getElementById("nomEmpresa").value}`;
            let rucValue = `RUC: ${document.getElementById("ruc").value}`;

            // Dibuja la primera celda (nombre de la empresa)
            doc.rect(margin, infoStartY, infoCellWidthLeft, infoCellHeight);

            // Ajustar el estilo de fuente a negrita para el nombre de la empresa
            doc.setFont(undefined, "bold");

            // Calcular el ancho del texto y centrarlo
            let textWidthEmpresa = doc.getTextWidth(nomEmpresa);
            let textXEmpresa =
                margin + (infoCellWidthLeft - textWidthEmpresa) / 2;
            doc.text(nomEmpresa, textXEmpresa, infoStartY + 7);

            // Restaurar el estilo de fuente normal para el resto del texto
            doc.setFont(undefined, "normal");

            // Dibuja la segunda celda (RUC) a la derecha de la primera
            doc.rect(
                margin + infoCellWidthLeft,
                infoStartY,
                infoCellWidthRight,
                infoCellHeight
            );

            // Calcular el ancho del texto y centrarlo
            let textWidthRuc = doc.getTextWidth(rucValue);
            let textXRuc =
                margin +
                infoCellWidthLeft +
                (infoCellWidthRight - textWidthRuc) / 2;
            doc.text(rucValue, textXRuc, infoStartY + 7);

            // Agregar el texto predeterminado con los datos de la empresa y el RUC
            doc.setFontSize(11);
            let nombreEmpresa = document.getElementById("nomEmpresa").value;
            let ruc = document.getElementById("ruc").value;

            let textoPredeterminado3 = `Transportados por la empresa ${nombreEmpresa} con RUC: ${ruc} hacia la Infraestructura de Valorización Alto Chicama, ubicada en la Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad; para su valorización.`;

            let splittedText = doc.splitTextToSize(
                textoPredeterminado3,
                contentWidth
            );
            doc.text(splittedText, margin, infoStartY + 20);

            // Definir el texto completo
            let textoCompleto =
                "La EO-RS ALTO CHICAMA S.R.L. es una empresa comprometida con el cuidado del medio ambiente y que opera en cumplimiento a lo dispuesto por el D.L. N° 1278, Ley de Gestión Integral de Residuos Sólidos, su modificatoria la Ley N° 1501; su reglamento y modificatoria.";

            // Ancho máximo permitido para el texto en la página
            let maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

            // Dividir el texto completo en líneas que se ajusten al ancho máximo
            let lineasTextoCompleto = doc.splitTextToSize(
                textoCompleto,
                maxWidth
            );

            // Posición inicial donde se agregará el texto
            let yPosition = infoStartY + 40;

            // Agregar las líneas del texto completo
            lineasTextoCompleto.forEach((linea, index) => {
                // Configurar el estilo adecuado para la primera línea
                if (index === 0) {
                    let textoAdicional = "La ";
                    let textoNegrita = "EO-RS ALTO CHICAMA S.R.L. ";
                    let textoResto = linea.substring(
                        textoAdicional.length + textoNegrita.length
                    );

                    // Agregar el texto adicional
                    doc.text(textoAdicional, margin, yPosition);

                    // Cambiar a negrita y agregar el nombre de la empresa
                    doc.setFont("helvetica", "bold");
                    doc.text(
                        textoNegrita,
                        margin + doc.getTextWidth(textoAdicional),
                        yPosition
                    );

                    // Volver a texto regular y agregar el resto del texto
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        textoResto,
                        margin + doc.getTextWidth(textoAdicional + textoNegrita),
                        yPosition
                    );
                } else {
                    // Para líneas siguientes, se agrega el texto normal
                    yPosition += 5; // Ajustar este valor para manejar el espacio entre líneas
                    doc.text(linea, margin, yPosition);
                }
            });

            // Firma de la empresa
            doc.addImage(imgData, "PNG", 75, startY + 85, 60, 25);

            // Leer la imagen del QR

            // Agregar la imagen del QR
                doc.addImage(imgQR12, "PNG", 160, startY + 122, 25, 25); // Ajusta las coordenadas y tamaño según sea necesario
                // Obtener la fecha de la ID 'fecha' y transformarla
                const fecha = new Date(document.getElementById("fecha").value); // Suponiendo que tienes una fecha en formato 'YYYY-MM-DD'
                const meses = [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                ];
                const dia = fecha.getDate();
                const mes = meses[fecha.getMonth()];
                const anio = fecha.getFullYear();

                // Crear la cadena de texto para la fecha
                const textoFecha = `Trujillo, ${dia} de ${mes} del ${anio}`;

                // Obtener el ancho de la página y calcular la posición para el texto
                const pdfPageWidth = doc.internal.pageSize.width; // Usar un nombre diferente para evitar conflictos
                const textWidth = doc.getTextWidth(textoFecha); // Ancho del texto
                const textX = pdfPageWidth - textWidth - 10; // Posición X (alineado a la derecha)
                const textY = startY + 120; // Posición Y (ajusta según sea necesario)

                doc.setFontSize(10);
                doc.setTextColor(105, 105, 105); // Color gris para el texto

                // Añadir la fecha al PDF
                doc.text(textoFecha, textX, textY);

                // Texto adicional en la parte inferior izquierda
                const textLeft = 10; // Posición en X
                const textBottom = pageHeight - 30; // Posición en Y (desde abajo)

                doc.setFontSize(10);
                doc.setTextColor(105, 105, 105); // Color gris para el texto

                // Primera línea de texto
                doc.text(
                    "OFICINA / INFRAESTRUCTURA DE VALORIZACIÓN",
                    textLeft,
                    textBottom
                );

                // Segunda línea de texto
                doc.text(
                    "Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad",
                    textLeft,
                    textBottom + 5
                );

                // Tercera línea de texto
                doc.text("comercial@", textLeft, textBottom + 10);
                doc.setTextColor(0, 128, 0); // Color verde para el correo
                doc.text(
                    "serviciosambientalesaltochicama.com",
                    textLeft + doc.getTextWidth("comercial@"),
                    textBottom + 10
                );

                // Cuarta línea de texto
                doc.setTextColor(105, 105, 105); // Volver a color gris
                doc.text("914 105 601 | 913 036 413", textLeft, textBottom + 15);
                //DESCARGA
                doc.save("certificado_valorizacion.pdf");
            // Leer el archivo del QR
            //readerQR.readAsDataURL(fileQr);
        };

        reader.readAsDataURL(file); // AQUÍ CREA CANICAS

    } else if (formId === "pdfAguas") {
        const input1 = document.getElementById("firma1");
        const file1 = input1.files[0];
        let residuos = document.getElementById("residuos1").value;
        let fecha = document.getElementById("fecha1").value;
        let numeroGuia = document.getElementById("numeroGuia1").value;
        let empresa = document.getElementById("empresa1").value;
        let tipoAguaTitulo = document.getElementById("tipoAguaTitulo").value;
        let metros = document.getElementById("metros3").value;
        let nomEmpresa = document.getElementById("nomEmpresa1").value;

        if (!file1 || !residuos || !fecha || !numeroGuia || !empresa || !tipoResiduoTitulo || !toneladas || nomEmpresa) {
            alert("Por favor llene todos los campos");
            return;
        }

        const reader1 = new FileReader();
        const readerQR1 = new FileReader();
        reader1.onload = async function (event) {
            const imgData1 = event.target.result;
            const doc = new jsPDF();

            // Cargar las imágenes de encabezado y pie de página
            const imgArriba = await loadImage("img/arriba.png");
            const imgAbajo = await loadImage("img/abajo.png");

            // Márgenes de 5 mm
            const margin = 5;
            const pageWidth = 210; // Ancho total de la página en mm
            const pageHeight = 297; // Alto total de la página en mm
            const contentWidth = pageWidth - 2 * margin;

            // Ajustar altura de imágenes
            const alturaArriba = 39; // Altura en mm para la imagen de encabezado
            const alturaAbajo = 39; // Altura en mm para la imagen de pie de página

            // Cálculo del ancho para mantener la proporción
            const anchoArriba =
                (imgArriba.width / imgArriba.height) * alturaArriba;
            const anchoAbajo = (imgAbajo.width / imgAbajo.height) * alturaAbajo;

            // Encabezado y pie de página
            doc.addImage(imgArriba, "PNG", 0, 0, anchoArriba, alturaArriba); // Encabezado
            doc.addImage(
                imgAbajo,
                "PNG",
                0,
                doc.internal.pageSize.height - alturaAbajo,
                anchoAbajo,
                alturaAbajo
            ); // Pie de página
            // Título
            doc.setFontSize(18);
            doc.setTextColor(0, 100, 0);
            doc.setFont(undefined, "bold");
            doc.text("CERTIFICADO", pageWidth / 2, 50, null, null, "center");
            doc.setFont(undefined, "normal");

            // Número de certificado
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, "bold");
            doc.text(
                "N°" + document.getElementById("codigoEmpresa1").value,
                pageWidth / 2,
                60,
                null,
                null,
                "center"
            );
            doc.setFont(undefined, "normal");

            // Cuadro verde sin relleno ajustado a la altura del texto
            doc.setDrawColor(0, 100, 0);
            let textYPosition = 70;
            let textHeight = doc.getTextDimensions(
                `${document.getElementById("opcion1").value}`
            ).h;
            let rectYPosition = textYPosition - textHeight / 2 - 2;
            let rectHeight = textHeight + 2;
            doc.rect(margin, rectYPosition, contentWidth, rectHeight);

            // Obtener el texto y el tamaño del texto
            // Obtener el texto y el tamaño del texto
            const texto = document.getElementById("opcion1").value;
            doc.setFontSize(11);

            // Obtener el ancho del texto usando doc.getTextWidth()
            const anchoTexto = doc.getTextWidth(texto);

            // Calcular la posición centrada
            const anchoPagina = doc.internal.pageSize.getWidth(); // Ancho de la página
            const posicionCentradaX = (anchoPagina - anchoTexto) / 2; // posición centrada

            // Mostrar la opción seleccionada en el cuadro verde (sin añadir margen adicional)
            doc.text(texto, posicionCentradaX, textYPosition);

            // Texto predeterminado debajo del cuadro verde
            doc.setFontSize(11);
            let textoPredeterminado =
                "Con RGR N° 1165-2021-GR-LL-GGR-GRS, la Gerencia Regional de Salud – La Libertad, nos otorga la Autorización Sanitaria para el tratamiento de Aguas Residuales – Tipo Domésticas, a través del uso de tanque sépticos y un filtro biológico.";
            let textoYPosition = textYPosition + 10;
            let textLines = doc.splitTextToSize(
                textoPredeterminado,
                contentWidth
            );
            textLines.forEach((line, index) => {
                doc.text(line, margin, textoYPosition + index * 6);
            });

            // Texto predeterminado adicional
            let textoAdicional1 = "ALTO CHICAMA S.R.L. ";
            let textoAdicional2Parte1 =
                "  certifica haber recibido líquidos residuales para su tratamiento, de acuerdo al siguiente";
            let textoAdicional2Parte2 = "detalle: ";
            let textoYPositionAdicional =
                textoYPosition + textLines.length * 7 + 5;

            // Renderizar la primera parte del texto
            doc.setFont(undefined, "bold");
            doc.text(textoAdicional1, margin, textoYPositionAdicional);
            doc.setFont(undefined, "normal");
            doc.text(
                textoAdicional2Parte1,
                margin + doc.getTextWidth(textoAdicional1),
                textoYPositionAdicional
            );

            // Renderizar la segunda parte en la siguiente línea
            let textoYPositionAdicional2 = textoYPositionAdicional + 7; // Ajusta este valor según sea necesario
            doc.text(textoAdicional2Parte2, margin, textoYPositionAdicional2);

            // Función para dividir texto largo en líneas
            function splitTextToLines(text, maxWidth, doc) {
                let words = text.split(" ");
                let lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    let word = words[i];
                    let width = doc.getTextWidth(currentLine + " " + word);
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine); // Agrega la última línea
                return lines;
            }

            // Inicializa `startY` antes de usarlo
            let startY = 120;
            let cellWidth = contentWidth / 4;
            let cellHeight = 12;

            let headers = [
                "Fecha",
                "N° de Guía \n" + document.getElementById("empresa1").value,
                document.getElementById("tipoAguaTitulo").value,
                "M³",
            ];

            // Encabezados en negrita
            doc.setFont(undefined, "bold");
            headers.forEach((header, index) => {
                doc.rect(
                    margin + index * cellWidth,
                    startY,
                    cellWidth,
                    cellHeight
                );
                let headerX = margin + index * cellWidth + cellWidth / 2;
                let headerY = startY + cellHeight / 2.5;
                doc.text(header, headerX, headerY, null, null, "center");
            });
            doc.setFont(undefined, "normal");

            startY += cellHeight;

            let rowData = [
                document.getElementById("fecha1").value,
                document.getElementById("numeroGuia1").value,
                document.getElementById("tipoAgua").value,
                document.getElementById("metros3").value,
            ];

            // Renderizar celdas
            rowData.forEach((data, index) => {
                doc.rect(
                    margin + index * cellWidth,
                    startY,
                    cellWidth,
                    cellHeight
                );

                // Si el texto es muy largo, lo dividimos en líneas
                let maxTextWidth = cellWidth - 4; // Margen dentro de la celda
                let lines = splitTextToLines(data, maxTextWidth, doc);

                // Calcula el inicio Y para centrar el texto verticalmente
                let lineHeight = 5; // Altura de cada línea de texto
                let totalTextHeight = lines.length * lineHeight;
                let textY =
                    startY + (cellHeight - totalTextHeight) / 2 + lineHeight;

                lines.forEach((line) => {
                    let textWidth = doc.getTextWidth(line);
                    let textX =
                        margin + index * cellWidth + (cellWidth - textWidth) / 2; // Centramos horizontalmente
                    doc.text(line, textX, textY);
                    textY += lineHeight; // Mueve hacia abajo para la siguiente línea
                });
            });

            

            if (residuos) {
                doc.setFontSize(11);
                let texto = `Líquidos residuales provenientes de la siguiente dirección: ${residuos}, generados por:`;
                let splittedText = doc.splitTextToSize(texto, contentWidth);
                doc.text(splittedText, margin, textoYPositionAdicional + 45);
            }

            // Cuadro con información de RUC y Nombre de la Empresa
            doc.setFontSize(11);
            let infoStartY = textoYPositionAdicional + 55;
            let infoCellWidthLeft = contentWidth * 0.7; // 70% del ancho para la primera celda
            let infoCellWidthRight = contentWidth * 0.3; // 30% del ancho para la segunda celda
            let infoCellHeight = 10;

            let nomEmpresa = `${document.getElementById("nomEmpresa1").value}`;
            let rucValue = `RUC: ${document.getElementById("ruc1").value}`;

            // Dibuja la primera celda (nombre de la empresa)
            doc.rect(margin, infoStartY, infoCellWidthLeft, infoCellHeight);

            // Ajustar el estilo de fuente a negrita para el nombre de la empresa
            doc.setFont(undefined, "bold");

            // Calcular el ancho del texto y centrarlo
            let textWidthEmpresa = doc.getTextWidth(nomEmpresa);
            let textXEmpresa =
                margin + (infoCellWidthLeft - textWidthEmpresa) / 2;
            doc.text(nomEmpresa, textXEmpresa, infoStartY + 7);

            // Restaurar el estilo de fuente normal para el resto del texto
            doc.setFont(undefined, "normal");

            // Dibuja la segunda celda (RUC) a la derecha de la primera
            doc.rect(
                margin + infoCellWidthLeft,
                infoStartY,
                infoCellWidthRight,
                infoCellHeight
            );

            // Calcular el ancho del texto y centrarlo
            let textWidthRuc = doc.getTextWidth(rucValue);
            let textXRuc =
                margin +
                infoCellWidthLeft +
                (infoCellWidthRight - textWidthRuc) / 2;
            doc.text(rucValue, textXRuc, infoStartY + 7);

            // Agregar el texto predeterminado con los datos de la empresa y el RUC
            doc.setFontSize(11);
            let nombreEmpresa = document.getElementById("empresa1").value;
            let ruc = document.getElementById("ruc1").value;

            let textoPredeterminado3 = `Transportados por la empresa ${nombreEmpresa} con RUC: ${ruc} hacia la Infraestructura de Valorización Alto Chicama, ubicada en la Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad; para su valorización.`;

            let splittedText = doc.splitTextToSize(
                textoPredeterminado3,
                contentWidth
            );
            doc.text(splittedText, margin, infoStartY + 20);

            // Firma de la empresa
            doc.addImage(imgData1, "PNG", 75, startY + 75, 60, 30);

            // Leer la imagen del QR

                // Agregar la imagen del QR
                doc.addImage(imgQR12, "PNG", 160, startY + 125, 25, 20); // Ajusta las coordenadas y tamaño según sea necesario
                // Obtener la fecha de la ID 'fecha' y transformarla
                const fecha = new Date(document.getElementById("fecha1").value); // Suponiendo que tienes una fecha en formato 'YYYY-MM-DD'
                const meses = [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                ];
                const dia = fecha.getDate();
                const mes = meses[fecha.getMonth()];
                const anio = fecha.getFullYear();

                // Crear la cadena de texto para la fecha
                const textoFecha = `Trujillo, ${dia} de ${mes} del ${anio}`;

                // Obtener el ancho de la página y calcular la posición para el texto
                const pdfPageWidth = doc.internal.pageSize.width; // Usar un nombre diferente para evitar conflictos
                const textWidth = doc.getTextWidth(textoFecha); // Ancho del texto
                const textX = pdfPageWidth - textWidth - 10; // Posición X (alineado a la derecha)
                const textY = startY + 120; // Posición Y (ajusta según sea necesario)

                doc.setFontSize(10);
                doc.setTextColor(105, 105, 105); // Color gris para el texto

                // Añadir la fecha al PDF
                doc.text(textoFecha, textX, textY);

                // Texto adicional en la parte inferior izquierda
                const textLeft = 10; // Posición en X
                const textBottom = pageHeight - 30; // Posición en Y (desde abajo)

                doc.setFontSize(10);
                doc.setTextColor(105, 105, 105); // Color gris para el texto

                // Primera línea de texto
                doc.text(
                    "OFICINA / INFRAESTRUCTURA DE VALORIZACIÓN",
                    textLeft,
                    textBottom
                );

                // Segunda línea de texto
                doc.text(
                    "Panamericana Norte Km 594, Sector La Soledad – Chicama – Ascope – La Libertad",
                    textLeft,
                    textBottom + 5
                );

                // Tercera línea de texto
                doc.text("comercial@", textLeft, textBottom + 10);
                doc.setTextColor(0, 128, 0); // Color verde para el correo
                doc.text(
                    "serviciosambientalesaltochicama.com",
                    textLeft + doc.getTextWidth("comercial@"),
                    textBottom + 10
                );

                // Cuarta línea de texto
                doc.setTextColor(105, 105, 105); // Volver a color gris
                doc.text("914 105 601 | 913 036 413", textLeft, textBottom + 15);

                doc.save("certificado_valorizacion.pdf");

            // Leer el archivo del QR
            //readerQR1.readAsDataURL(fileQr1);

        };
        reader1.readAsDataURL(file1);
        //window.location.reload();

    }
    

}