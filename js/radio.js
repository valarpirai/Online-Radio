$(document).ready(function() {

    var liveRadioListUrl = "https://gist.githubusercontent.com/valarpirai/473305f09f8433f1d338634ed42c437d/raw/live-radio.json";

    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function() {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function() {
        $('#wrapper').toggleClass('toggled');
    });

    $.ajax({
        url : liveRadioListUrl
    }).done(function(res) {
        console.log(res);
    });
});
