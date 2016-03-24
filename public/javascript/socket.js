"use strict";

$(function () {
  var socket = io.connect();
  var $streamContainer = $(".streams");
  var $startStopStream = $(".start_stream");
  var $clearStream = $(".clear_stream");

  function startStopStream () {
    var whilchButton = {
      "stop stream": "start stream",
      "start stream": "stop stream"
    };

    var emitEvent = $startStopStream.val();
    var action = whilchButton[$startStopStream.val()];
    var $feed = $("select").val();

    $startStopStream.val(action);
    socket.emit(emitEvent, $feed);
  };

  function clearStream () {
    $($streamContainer).empty();
  };

  $startStopStream.click(startStopStream);
  $clearStream.click(clearStream);

  $(".search_input").keyup(function () {
    var stream = $(".streams").find(".stream").hide();
    var data = this.value.split(" ");
    $.each(data, function (i, v) {
      stream.filter(":contains('" + v + "')").show();
    });
  });

  socket.on("new stream", function (data) {
    if (!data.friends) {
      var title = data.user || {name: ""};
      var created_at = data.created_at;
      var text = data.text;
      var urls = data.entities.urls || [];
      var media = data.entities.media || [];
      var $div = $("<div>").addClass("stream");

      $div.append($("<img class='profile-image' src=" + data.user.profile_image_url + ">"));
      $div.append($("<h3>" + title.name + "</h3>").addClass("title"));
      $div.append($("<div>" + created_at + "</div>"));
      $div.append($("<div>" + text + "</div>"));

      if (urls.length) {
        urls.forEach(function (url) {
          $div.append($("<div>url: <a href='" + url.expanded_url + "'>" + url.expanded_url + "</a></div>"));
        });
      }

      if (media.length) {
        media.forEach(function (m) {
          $div.append($("<div>media: <a href='" + m.expanded_url + "'>" + m.expanded_url + "</a></div>"));
        });
      }

      $(".streams").prepend($div);
    }
  });
});
