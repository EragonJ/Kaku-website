$(document).ready(function() {
  var $qaList = $('.qa-list');

  $.ajax({
    url: '../tutorial.json'
  })
  .done(function(result) {
    var tutorials = result.data;

    tutorials.forEach(function(tutorial) {
      var page = tutorial.page;
      var languages = Object.keys(tutorial.languages);
      languages.forEach(function(language) {
        var $a = $('<a>');
        var href = language + '/' + page;
        var translation = tutorial.languages[language];
        $a.attr('href', href);
        $a.text(translation)
        $a.addClass('list-group-item');

        $qaList.find('.list-group[data-type="' + language + '"]').append($a);
      });
    });
  });
});
