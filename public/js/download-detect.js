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
    var downloadFilename;

    var kakuVersion = result.name || '';
    var assets = result.assets || [];
    var releaseNote = result.body || '';
    releaseNote = releaseNote.split('\n');

    var downloads = {};
    var platforms = [
      'linuxAppImage32',
      'linuxAppImage64',
      'linux32',
      'linux64',
      'debian32',
      'debian64',
      'win64',
      'win32',
      'mac'
    ];

    var platformNames = [
      'Linux AppIamge (32 bit)',
      'Linux AppImage (64 bit)',
      'Linux (32 bit)',
      'Linux (64 bit)',
      'Debian (32 bit)',
      'Debian (64 bit)',
      'Windows (64 bit)',
      'Windows (32 bit)',
      'Mac OS X'
    ];

    var platformsIcon = [
      'fa-linux',
      'fa-linux',
      'fa-linux',
      'fa-linux',
      'fa-linux',
      'fa-linux',
      'fa-windows',
      'fa-windows',
      'fa-apple'
    ];

    platforms.forEach(function(platformName) {
      downloads[platformName] = getDownloadLinkFor(platformName, assets);
    });

    if (macRegex.test(platform)) {
      downloadLink = downloads['mac'];
      downloadFilename = 'Mac OS X';
    }
    else if (winRegex.test(platform)) {
      downloadLink = downloads['win64'];
      downloadFilename = 'Windows (64 bit)';
    }
    else if (linuxRegex.test(platform)) {
      // Linux 64
      if (linux64Regex.test(platform)) {
        downloadLink = downloads['linux64']
        downloadFilename = 'Linux (64 bit)';
      }
      // Linux 32
      else {
        downloadLink = downloads['linux32'];
        downloadFilename = 'Linux (32 bit)';
      }
    }

    platforms.forEach(function(platformName, index) {
      var $dropdownList = $('<li><a></a></li>');
      $a = $dropdownList.find('a');
      $a.attr('href', downloads[platformName]);
      $a.html('<i class="fa fa-fw ' + platformsIcon[index] + '"></i>' + platformNames[index] + ' - ' + kakuVersion);
      $downloadDropdownMenu.prepend($dropdownList);
    });
    
    $downloadButton
      .attr('href', downloadLink)
      .text('Download for ' + downloadFilename);

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
      'linuxAppImage32': /-i386\.AppImage/,
      'linuxAppImage64': /-x86_64\.AppImage/,
      'linux32': /-ia32\.tar\.gz$/,
      'linux64': /\.tar\.gz$/,
      'debian32': /_i386.deb$/,
      'debian64': /_amd64.deb$/,
      'win32': /\.exe$/,
      'win64': /\.exe$/,
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
