
(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


})(jQuery);

/**
* Template Name: Arsha
* Template URL: https://bootstrapmade.com/arsha-free-bootstrap-html-template-corporate/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {

    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({
        selector: '.glightbox'
    });

    /**
     * Init swiper sliders
     */
    function initSwiper() {
        document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
            let config = JSON.parse(
                swiperElement.querySelector(".swiper-config").innerHTML.trim()
            );

            if (swiperElement.classList.contains("swiper-tab")) {
                initSwiperWithCustomPagination(swiperElement, config);
            } else {
                new Swiper(swiperElement, config);
            }
        });
    }

    window.addEventListener("load", initSwiper);


})();


function enviarCorreo() {
    var nombre = document.getElementById('gname').value;
    var apellido = document.getElementById('surname').value;
    var telefono = document.getElementById('cname').value;
    var asunto = document.getElementById('asunto').value;
    var message = document.getElementById('message').value;
    var cuerpo = "Nombre: " + nombre + "\n" + "Apellido: " + apellido + "\n" + "Teléfono: " + telefono + '\n' + "Descríbenos tu mensaje:\n" + message;

    var url = "https://mail.google.com/mail/?view=cm&fs=1&to=comercial@serviciosambientalesaltochicama.com&su=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(cuerpo);

    window.open(url, '_blank')

    setTimeout(function () {
        window.location.href = "index.html";
    }, 3000);
}

function validateNumberInput(input) {
    // Remove any non-digit character
    input.value = input.value.replace(/\D/g, '');
    // Limit length to 9 characters
    if (input.value.length > 9) {
        input.value = input.value.slice(0, 9);
    }
}