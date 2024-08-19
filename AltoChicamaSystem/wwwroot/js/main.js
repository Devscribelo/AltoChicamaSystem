
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

    function aosInit() {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    window.addEventListener('load', aosInit);

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


var gallery = document.querySelector('.gallery');
var galleryItems = document.querySelectorAll('.gallery-item');
var numOfItems = gallery.children.length;
var itemWidth = 23; // percent: as set in css

var featured = document.querySelector('.featured-item');

var leftBtn = document.querySelector('.move-btn.left');
var rightBtn = document.querySelector('.move-btn.right');
var leftInterval;
var rightInterval;

var scrollRate = 0.2;
var left;

function selectItem(e) {
    if (e.target.classList.contains('active')) return;

    featured.style.backgroundImage = e.target.style.backgroundImage;

    for (var i = 0; i < galleryItems.length; i++) {
        if (galleryItems[i].classList.contains('active'))
            galleryItems[i].classList.remove('active');
    }

    e.target.classList.add('active');
}

function galleryWrapLeft() {
    var first = gallery.children[0];
    gallery.removeChild(first);
    gallery.style.left = -itemWidth + '%';
    gallery.appendChild(first);
    gallery.style.left = '0%';
}

function galleryWrapRight() {
    var last = gallery.children[gallery.children.length - 1];
    gallery.removeChild(last);
    gallery.insertBefore(last, gallery.children[0]);
    gallery.style.left = '-23%';
}

function moveLeft() {
    left = left || 0;

    leftInterval = setInterval(function () {
        gallery.style.left = left + '%';

        if (left > -itemWidth) {
            left -= scrollRate;
        } else {
            left = 0;
            galleryWrapLeft();
        }
    }, 1);
}

function moveRight() {
    //Make sure there is element to the leftd
    if (left > -itemWidth && left < 0) {
        left = left - itemWidth;

        var last = gallery.children[gallery.children.length - 1];
        gallery.removeChild(last);
        gallery.style.left = left + '%';
        gallery.insertBefore(last, gallery.children[0]);
    }

    left = left || 0;

    leftInterval = setInterval(function () {
        gallery.style.left = left + '%';

        if (left < 0) {
            left += scrollRate;
        } else {
            left = -itemWidth;
            galleryWrapRight();
        }
    }, 1);
}

function stopMovement() {
    clearInterval(leftInterval);
    clearInterval(rightInterval);
}

leftBtn.addEventListener('mouseenter', moveLeft);
leftBtn.addEventListener('mouseleave', stopMovement);
rightBtn.addEventListener('mouseenter', moveRight);
rightBtn.addEventListener('mouseleave', stopMovement);


//Start this baby up
(function init() {
    var images = [
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/car.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/city.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/deer.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/flowers.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/food.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/guy.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/landscape.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/lips.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/night.jpg',
        'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/table.jpg'
    ];

    //Set Initial Featured Image
    featured.style.backgroundImage = 'url(' + images[0] + ')';

    //Set Images for Gallery and Add Event Listeners
    for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].style.backgroundImage = 'url(' + images[i] + ')';
        galleryItems[i].addEventListener('click', selectItem);
    }
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