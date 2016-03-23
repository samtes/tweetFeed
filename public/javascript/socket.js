"use strict";

$(() => {
  let socket = io.connect();
  let $streamContainer = $(".streams");
  let $startStopStream = $(".start_stream");
  let $clearStream = $(".clear_stream");
  let $filterInput = $(".search_input");

  let startStopStream = () => {
    let whilchButton = {
      "stop stream": "start stream",
      "start stream": "stop stream"
    };

    let emitEvent = $startStopStream.val();
    let action = whilchButton[$startStopStream.val()];
    let $feed = $("select").val();

    $startStopStream.val(action);
    socket.emit(emitEvent, $feed);
  };

  let clearStream = () => {
    $($streamContainer).empty();
  };

  let filterFeed = () => {
    let stream = $(".streams").find(".stream").hide();
    let data = this.value.split(" ");
    $.each(data, (i, v) => {
      stream.filter(":contains('" + v + "')").show();
    });
  };

  $startStopStream.click(startStopStream);
  $clearStream.click(clearStream);
  $filterInput.keyup(filterFeed);

  socket.on("new stream", data => {
    if (!data.friends) {
      let title = data.user || {name: ""};
      let created_at = data.created_at;
      let text = data.text;
      let urls = data.entities.urls || [];
      let media = data.entities.media || [];
      let $div = $("<div>").addClass("stream");

      $div.append($("<img class='profile-image' src=" + data.user.profile_image_url + ">"));
      $div.append($("<h3>" + title.name + "</h3>").addClass("title"));
      $div.append($("<div>" + created_at + "</div>"));
      $div.append($("<div>" + text + "</div>"));

      if (urls.length) {
        urls.forEach(url => {
          $div.append($("<div>url: <a href='" + url.expanded_url + "'>" + url.expanded_url + "</a></div>"));
        });
      }

      if (media.length) {
        media.forEach(m => {
          $div.append($("<div>media: <a href='" + m.expanded_url + "'>" + m.expanded_url + "</a></div>"));
        });
      }

      $(".streams").prepend($div);
    }
  });
});
