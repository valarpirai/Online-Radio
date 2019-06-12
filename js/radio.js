$(document).ready(function() {
    'use strict';

    var liveRadioListUrl = "https://gist.githubusercontent.com/valarpirai/473305f09f8433f1d338634ed42c437d/raw/live-radio.json";

    var stationList = {};
    var selectedStationList = [];
    var selectedCity = "";
    var previousBg = 1;
    var maxNumberofBg = 24;

    var trigger = $('.hamburger'),
        isClosed = false;

    // ========================================================================
    // Event Listeners
    // ========================================================================
    trigger.click(function() {
        hamburger_cross();
    });

    $('[data-toggle="offcanvas"]').click(function() {
        $('#wrapper').toggleClass('toggled');
    });

    $(document).on('click', '[data-city]', function() {
        trigger.click();
        renderStationList($(this).attr('data-city'));
    });

    $(document).on('click', '[data-id]', function() {
        playSelectedStation($(this).attr('data-id'));
    });

    $(document).on('click', '.volume-ctrl', function() {
        var muted = $("#audio-src").prop('muted');
        $("#audio-src").prop('muted', !muted);

        if(!muted) {
            $(this).addClass("play").removeClass("pause");
        } else {
            $(this).addClass("pause").removeClass("play");
        }
    });

    function hamburger_cross() {

        if (isClosed == true) {
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    // ========================================================================
    // Background Image change
    // ========================================================================
    $('.dummy-bg').css("opacity", "1");
    setTimeout(function () {
        changeBg();
        $('.dummy-bg').css("opacity", "");
    }, 1000);

    function changeBg() {
        var rand = getRandomInt(1, maxNumberofBg);
        if(rand == previousBg) {
            rand++;
        }
        if(rand > maxNumberofBg) {
            rand = 1;
        }
        var url = '.bg-img { background: url("img/' + rand + '.jpg") no-repeat center center fixed; }';
        $('#bg-image').text(url);
        previousBg = rand;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ========================================================================
    // Render City and Station list
    // ========================================================================
    function renderCityList() {
        
        var city = $(".city");
        var list = Object.keys(stationList) || [];
        
        city.html("");

        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            city.append('<li><a data-city="' + obj + '">' + obj + '</a></li>');
        }
    }

    function renderStationList(area) {
        if(!area) {
            // read from cookie
            area = cookie.get('area');
            if(!area)
                area = Object.keys(stationList)[0];
        }

        cookie.set("area", area);

        var stations = $(".stations");
        var list = (stationList[area] && stationList[area].channels) || [];
        selectedCity = area;
        selectedStationList = list;

        stations.html("");

        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            stations.append('<li><a data-id="' + obj.id + '"><h3>' + obj.name + '</h3></a></li>');
        }
    }

    // ========================================================================
    // Play selected station
    // ========================================================================
    function playSelectedStation(stationId) {
        if(!stationId) {
            // read from cookie
            stationId = cookie.get('stationId');
            if(!stationId) {
                let hash = location.hash.split('/');
                stationId = hash[2] || selectedStationList[0].id;
            }
        }

        cookie.set("stationId", stationId);

        var x;
        for(let area in stationList) {
            let channel_list = stationList[area].channels;
            for (var i = 0; i < channel_list.length; i++) {
                if(stationId == channel_list[i].id){
                    x = channel_list[i];
                    selectedStationList = channel_list;
                    renderStationList(area);
                    break;
                }
            }
        }

        if(!x)
            return;
        
        console.log(x)

        var stream = x.src;

        $('.station-name').text(x.name);
        $('.station-site').attr("href", x.website);
        var video = document.getElementById('audio-src');
        video.innerHTML = '';
        video.pause();

        var source = document.createElement('source');
        source.setAttribute('src', stream);
        video.appendChild(source);
        video.load();

        video.onloadeddata = function (e) {
            try{
                video.play();
            } catch(e) {
                console.log(e)
            }
        };

        document.title = "Online Radio - " + x.name;
        window.history.pushState('Online Radio', document.title, "#/" + selectedCity + "/" + x.id);

        changeBg();

        // <video controls="" autoplay="" name="media"><source src="http://192.240.97.69:9201/stream" type="audio/mpeg"></video>
    }

    // ========================================================================
    // Cookie Utility
    // ========================================================================
    var cookie = {
        // Read cookie
        get : function getCookie (name) {
            var cookies = {};
            var c = document.cookie.split('; ');
            for (var i = c.length - 1; i >= 0; i--) {
                var C = c[i].split('=');
                cookies[C[0]] = C[1];
            }
            return cookies[name] || null;
        },

        // create cookie
        set : function createCookie (name, value, minutes) {
            if(!minutes)
                minutes = 60 * 24;

            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
            document.cookie = name + "=" + value + expires + "; path=/";
        }
    };

    // ========================================================================
    // Download Station List data
    // ========================================================================
    $.ajax({
        url : liveRadioListUrl
    }).done(function(res) {
        res = JSON.parse(res);
        
        for(var i in res) {
            stationList[res[i].name] = res[i];
        }

        console.log(stationList);
        renderCityList();
        renderStationList();

        setTimeout(function () {
            playSelectedStation();
        }, 200);
    });
    // ========================================================================

});

// onloadedmetadata
