$(document).ready(function() {

    var liveRadioListUrl = "https://gist.githubusercontent.com/valarpirai/473305f09f8433f1d338634ed42c437d/raw/live-radio.json";

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext(); // Audio context
    var audioSource;

    var stationList = {};
    var selectedStationList = [];
    var selectedCity = "";

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

    $('[data-city]').click(function() {
        renderStationList($(this).attr('data-city'));
    });

    $(document).on('click', '[data-id]', function() {
        playSelectedStation($(this).attr('data-id'));
    });

    $.ajax({
        url : liveRadioListUrl
    }).done(function(res) {
        res = JSON.parse(res);
        stationList['columbo'] = res.slice(0, 17);
        stationList['chennai'] = res.slice(17, res.length);

        console.log(stationList);
        renderStationList();
    });

    function renderStationList(area) {
        if(!area) {
            // read from cookie
            area = getCookie('area');
            if(!area)
                area = 'chennai';
        }

        createCookie("area", area);

        var stations = $(".stations");
        var list = stationList[area] || [];
        selectedCity = area;
        selectedStationList = list;

        stations.html("");

        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            stations.append('<li><a data-id="' + obj.id + '"><h3>' + obj.name + '</h3></a></li>');
        }

        playSelectedStation();
    }

    function playSelectedStation(stationId) {
        if(!stationId) {
            // read from cookie
            stationId = getCookie('stationId');
            if(!stationId)
                stationId = 0;
        }

        createCookie("stationId", stationId);

        var x;
        for (var i = 0; i < selectedStationList.length; i++) {
            if(stationId == selectedStationList[i].id){
                x = selectedStationList[i];
                break;
            }
        }

        if(!x)
            return;
        
        console.log(x)

        $('.station-name').text(x.name);
        $('.station-site').attr("href", x.website);

        window.history.pushState('page2', 'Title', "/" + selectedCity + "/" + x.id);
    }

    // Read cookie
    function getCookie (name) {
        var cookies = {};
        var c = document.cookie.split('; ');
        for (i = c.length - 1; i >= 0; i--) {
            var C = c[i].split('=');
            cookies[C[0]] = C[1];
        }
        return cookies[name] || null;
    };

    // create cookie
    function createCookie (name, value, minutes) {
        if(!minutes)
            minutes = 60 * 24;

        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
    }
});
