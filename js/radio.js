$(document).ready(function() {

    var liveRadioListUrl = "https://gist.githubusercontent.com/valarpirai/473305f09f8433f1d338634ed42c437d/raw/live-radio.json";

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext(); // Audio context
    var audioSource;

    var stationList = {};
    var selectedStationList = [];

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
        renderStationList('chennai');
    });

    function renderStationList(area) {
        var stations = $(".stations");
        var list = stationList[area] || [];
        selectedStationList = list;

        stations.html("");

        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            stations.append('<li><a data-id="' + obj.id + '"><h3>' + obj.name + '</h3></a></li>');
        }

        playSelectedStation(0);
    }

    function playSelectedStation(stationId) {
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
    }
});
