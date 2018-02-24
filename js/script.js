// Load Panel
function showPanel(el) {
    $('section').slideUp('fast');
    $('section#' + el).slideDown(1500);

    if (el == 'portfolio') {
        $('a.works').fancybox({
            'titlePosition': 'inside'
        });
        $('a.works.iframe').fancybox({
            'type': 'iframe',
            'titlePosition': 'inside'
        })

        $('#da-thumbs > article').hoverdir();

        $('#filter a').on('click', function () {
            $('#filter a').removeClass('active');
            $(this).addClass('active');
        });

        filter();

    } else if (el == 'profile') {

        $('.profile .avatar').remove();
        $('.home .avatar').clone().appendTo('.profile #avatar');

        $('.chart').easyPieChart({
            animate: 500,

            // ----------------------------
            // Custom your chart color here
            // ----------------------------

            barColor: '#eb5b5e',
            size: 110
        });
    } else if (el == 'contact') {
        $('.gmap').mobileGmap();
    }

}

// Isotope
function filter() {
    // Needed variables
    var $container = $('#da-thumbs');
    var $filter = $('#filter');

    // Run Isotope
    $container.isotope({
        filter: '*',
        layoutMode: 'masonry',
        animationOptions: {
            duration: 750,
            easing: 'linear'
        }
    });

    // Isotope Filter
    $filter.find('a').click(function () {
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false,
            }
        });
        return false;
    });

    // Copy categories to item classes
    $filter.find('a').click(function () {
        var currentOption = $(this).attr('data-filter');
        $filter.find('a').removeClass('active');
        $(this).addClass('active');
    });
}

// Load Frame
function frame() {
    $('header a').on('click', function (e) {
        e.preventDefault();
        $('header a').removeClass('active');
        $(this).addClass('active');
        var link = $(this).attr('href').replace(/^#/, '');
        showPanel(link);
    });
}


// Contact Form
function contactForm() {

    var name = $("#name").val(),
        email = $("#email").val(),
        text = $("#message").val(),
        dataString = 'name=' + name + '&email=' + email + '&text=' + text;

    $.ajax({
        type: "POST",
        url: "formprocess.php",
        dataType: "html",
        data: dataString,
        success: function () {
            $('.contactform form').hide('fast');
            $('.success_box').fadeIn(250);
        }
    });

}

// Form Validator
function validator() {
    var validator = new FormValidator('contactform', [{
        name: 'name',
        display: 'name',
        rules: 'required'
	}, {
        name: 'email',
        rules: 'required|valid_email'
	}, {
        name: 'message',
        display: 'message',
        rules: 'required|min_length[8]'
	}], function (errors, event) {
        var SELECTOR_ERRORS = $('.error_box');

        if (errors.length > 0) {

            SELECTOR_ERRORS.empty();
            for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
                SELECTOR_ERRORS.append(errors[i].message + '<br />');
            }
            SELECTOR_ERRORS.fadeIn(200);

        } else {
            SELECTOR_ERRORS.hide();
            contactForm();
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        } else if (event) {
            event.returnValue = false;
        }
    });
}

// Tweetjs
function tweet(name) {
    $(".tweet").tweet({
        username: name,
        count: 1,
        loading_text: "loading tweets...",
        template: "{text}"
    }).bind("loaded", function () {
        $(this).find("a").attr("target", "_blank");
    });
}

// Init
$(function () {
    frame();
    validator();
});
