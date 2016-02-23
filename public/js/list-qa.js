$(document).ready(function() {
  $.ajax({
    url: '../tutorial.json'
  })
  .done(function(data) {
    var objLength = Object.keys(data).length;

    for (var i = 0; i < objLength; i++) {
      $('#en').append('<a href="en/how-to-back-up-music.html" class="list-group-item">' + data[i].en + '</a>');
      $('#tw').append('<a href="tw/how-to-back-up-music.html" class="list-group-item">' + data[i]['zh-TW'] + '</a>');
    }
  });
});
