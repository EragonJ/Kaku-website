$(document).ready(function() {
  // it is sorted by the number of commits per contributor in descending order.
  var contributorLink =
    'https://api.github.com/repos/EragonJ/Kaku/contributors';

  var rawContributorTemplate = $('.contributor-template').remove().html()
  var $contributorTemplate = $(rawContributorTemplate);
  var $contributorContainer = $('.each-block.contributors ul');

  $.ajax({
    url: contributorLink
  }).done(function(result) {
    for (var i = 0; i < result.length; i++) {
      var contributorInfo = result[i];
      var $eachContributor = $contributorTemplate.clone();

      $eachContributor
        .find('a').attr('href', contributorInfo.html_url).end()
        .find('.avatar').attr('src', contributorInfo.avatar_url).end()
        .find('.name').text(contributorInfo.login)

      $contributorContainer.append($eachContributor);
    }
  });
});
