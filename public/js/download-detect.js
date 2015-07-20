$(document).ready(function() {
  var githubReleaseLink = 'https://github.com/EragonJ/Kaku/releases';
  var githubReleaseAPILink =
    'https://api.github.com/repos/EragonJ/Kaku/releases/latest';

  var platform = navigator.platform;
  var macRegex = /Mac/;
  var winRegex = /Win/;
  var linuxRegex = /Lin/;
  var linux64Regex = /x86_64/;
  var $downloadButton = $('#download-button');

  // fetch the latest release first
  $.ajax({
    url: githubReleaseAPILink
  }).done(function(result) {
    var downloadLink;
    var kakuVersion = result.name || '';
    var assets = result.assets || [];

    if (macRegex.test(platform)) {
      downloadLink = getDownloadLinkFor('mac', assets);
    }
    else if (winRegex.test(platform)) {
      downloadLink = getDownloadLinkFor('win', assets);
    }
    else if (linuxRegex.test(platform)) {
      // Linux 64
      if (linux64Regex.test(platform)) {
        downloadLink = getDownloadLinkFor('linux64', assets);
      }
      // Linux 32
      else {
        downloadLink = getDownloadLinkFor('linux32', assets);
      }
    }
    
    $downloadButton
      .attr('href', downloadLink)
      .text('Download Kaku ' + kakuVersion);

  }).fail(function() {
    // there may be some problems, let's just redirect users to our repo
    $downloadButton
      .attr('href', githubReleaseLink);
  });
});

function getDownloadLinkFor(platform, assets) {
  // platform would be 'win', 'mac', 'linux32', 'linux64'
  assets = assets || [];
  for (var i = 0; i < assets.length; i++) {
    var asset = assets[i];
    var regex = RegExp(platform, 'i');
    if (regex.test(asset.name)) {
      return asset.browser_download_url;
    }
  }

  // fallback if we have some problems when publishing releases
  return githubReleaseLink;
}
