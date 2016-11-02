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
  var $releaseNote = $('.release-note');
  var $downloadDropdownMenu = $('.download-dropdown-menu');

  // fetch the latest release first
  $.ajax({
    url: githubReleaseAPILink
  }).done(function(result) {
    var downloadLink;
    var kakuVersion = result.name || '';
    var assets = result.assets || [];
    var releaseNote = result.body || '';
    releaseNote = releaseNote.split('\n');

    var downloads = {};
    var platforms = ['linux32', 'linux64', 'win', 'mac'];
    var platformNames = ['Linux32', 'Linux64', 'Windows', 'Mac OS X'];
    var platformsIcon = ['fa-linux', 'fa-linux', 'fa-windows', 'fa-apple'];

    platforms.forEach(function(platformName) {
      downloads[platformName] = getDownloadLinkFor(platformName, assets);
    });

    if (macRegex.test(platform)) {
      downloadLink = downloads['mac'];
    }
    else if (winRegex.test(platform)) {
      downloadLink = downloads['win'];
    }
    else if (linuxRegex.test(platform)) {
      // Linux 64
      if (linux64Regex.test(platform)) {
        downloadLink = downloads['linux64']
      }
      // Linux 32
      else {
        downloadLink = downloads['linux32'];
      }
    }

    platforms.forEach(function(platformName, index) {
      var $dropdownList = $('<li><a></a></li>');
      $a = $dropdownList.find('a');
      $a.attr('href', downloads[platformName]);
      $a.html('<i class="fa fa-fw ' + platformsIcon[index] + '"></i>' + platformNames[index] + ' - v' + kakuVersion);
      $downloadDropdownMenu.prepend($dropdownList);
    });
    
    $downloadButton
      .attr('href', downloadLink)
      .text('Download Kaku ' + kakuVersion);

    releaseNote.forEach(function(eachLine) {
      var $line = $('<div></div>');

      if (eachLine.length === 1) {
        $line = $('<br>');
      } else {
        $line.text(eachLine);
        $line.emoji();
      }

      $releaseNote.append($line);
    });

  }).fail(function() {
    // there may be some problems, let's just redirect users to our repo
    $downloadButton
      .attr('href', githubReleaseLink);
  });

  function getDownloadLinkFor(platformName, assets) {
    var patterns = {
      'linux32': /ia32\.AppImage$/,
      'linux64': /x86_64\.AppImage$/,
      'win': /\.exe$/,
      'mac': /\.dmg$/
    };

    // platform would be 'win', 'mac', 'linux32', 'linux64'
    assets = assets || [];
    for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      var regex = patterns[platformName];
      if (regex.test(asset.name)) {
        return asset.browser_download_url;
      }
    }

    // fallback if we have some problems when publishing releases
    return githubReleaseLink;
  }
});
