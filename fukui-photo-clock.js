/*
 * Fukui City Photo Clock
 *
 * Copyright 2015 8am.
 * http://8am.jp/
 *
 */

$(function() {
  var $dashboard   = $("#dashboard");
  var $time        = $("#time");
  var $hour        = $("#hour");
  var $minute      = $("#minute");
  var $second      = $("#second");
  var $date        = $("#date");
  var $title       = $("#title");
  var $size        = $("#size");
  var $backgrounds = $("#backgrounds").append( $(new Image()) );
  var data = {};
  var firingtimes = { day : 0, hour : 0, minute : 0, second : 0 };
  var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  var d;

  init();

  $(window).on("load orientationchange resize", function() {
    $backgrounds.width($(window).width()).height($(window).height());
  });

  function play() {
    d = now();
    if (d >= firingtimes.second) {
      onEverySecond();
    }
    requestAnimationFrame(play);
  }

  function onEverySecond() {
    showSecond();
    if (d >= firingtimes.minute) {
      onEveryMinute();
    }
  }

  function onEveryMinute() {
    showMinute();
    slide();
    if (d >= firingtimes.hour) {
      onEveryHour();
    }
  }

  function onEveryHour() {
    showHour();
    if (d >= firingtimes.day) {
      onEveryDay();
    }
  }

  function onEveryDay() {
    showDate();
  }

  function showSecond() {
    $second.text( ("0"+d.getSeconds()).slice(-2) );
    firingtimes.second = Math.floor(d / 1000) * 1000 + 1000;
  }

  function showMinute() {
    $minute.text( ("0"+d.getMinutes()).slice(-2) );
    firingtimes.minute = Math.floor(d / 60000) * 60000 + 60000;
  }

  function showHour() {
    $hour.text( ("0"+d.getHours()).slice(-2) );
    firingtimes.hour = Math.floor(d / 3600000) * 3600000 + 3600000;
  }

  function showDate() {
    $date.text([ d.getFullYear(), d.getMonth()+1, d.getDate() ].join("/") + "(" + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + ")");
    firingtimes.day = Math.floor(d / 86400000) * 86400000 + 86400000;
  }

  function slide() {
    $backgrounds.children().last().fadeIn("slow", function() {
      $title.text( $(this).data('caption') );
      $size.text( $(this).data('width') + "x" + $(this).data('height') );
      $backgrounds
        .width($(window).width())
        .height($(window).height())
        .append(setBackground())
        .children().first().remove();
    });
  }

  function getBackgrounds() {
    var deferred = new $.Deferred;
    $.ajax(
      "./backgrounds.json",
      {
        dataType: "jsonp",
        jsonpCallback: "backgrounds"
      }
    )
    .done(function( json ) {
      data = json;
      deferred.resolve();
    });
    return deferred.promise();
  }

  function setBackground() {
    var n = Math.floor( Math.random() * data.length );
    return $(new Image()).attr("src", data[n].url).on('load',function() {
      $(this)
        .attr("data-caption", data[n].caption)
        .attr("data-width", $(this)[0].naturalWidth)
        .attr("data-height", $(this)[0].naturalHeight);
    }).hide();
  }

  function now() {
    return new Date();
  }

  function init() {
    d = now();
    getBackgrounds()
    .done(function() {
      d = now();
      $backgrounds.append(setBackground()).width($(window).width()).height($(window).height());
      slide();
      showSecond();
      showMinute();
      showHour();
      showDate();
      play();
    });
  }

});