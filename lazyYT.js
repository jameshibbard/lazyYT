/*! LazyYT (lazy load Youtube videos plugin) - v0.3.4 - 2014-06-30
* Usage: <div class='lazyYT' data-youtube-id='laknj093n' ratio='16:9' data-parameters='rel=0'>loading...</div>
* Copyright (c) 2014 Tyler Pearson; Licensed MIT */

'use strict';

var LazyYT = (function () {
  function setUp(el) {
    var width = el.dataset.width,
        height = el.dataset.height,
        ratio = el.dataset.ratio,
        id = el.dataset.youtubeId,
        aspectRatio = ['16', '9'],
        paddingTop = 0,
        youtubeParameters = el.dataset.parameters || '';

    if (typeof width === 'undefined' || typeof height === 'undefined') {
      height = 0;
      width = '100%';
      aspectRatio = (ratio.split(':')[1] / ratio.split(':')[0]) * 100;
      paddingTop = aspectRatio + '%';
    } else {
      height = height + 'px';
      width = width + 'px';
    }

    el.style.position = 'relative';
    el.style.height = height;
    el.style.width = width;
    el.style.paddingTop = paddingTop;
    el.style.background = 'url(http://img.youtube.com/vi/' + id + '/hqdefault.jpg) center center no-repeat';
    el.style.cursor = 'pointer';
    el.style.backgroundSize = 'cover';

    el.innerHTML = '<p id="lazyYT-title-' + id + '" class="lazyYT-title"></p><div class="lazyYT-button"></div>';
    el.classList.add('lazyYT-image-loaded');

    var request = new XMLHttpRequest();
    request.open('GET', 'https://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json', true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        var data = JSON.parse(request.responseText);
        document.getElementById('lazyYT-title-' + id).innerHTML = data.entry.title.$t;
      }
    };
    request.send();

    el.addEventListener('click', function(e) {
      e.preventDefault();
      if (!el.classList.contains('lazyYT-video-loaded') && el.classList.contains('lazyYT-image-loaded')) {
        el.innerHTML = '<iframe width="' + width + '" height="' + height + '" src="http://www.youtube.com/embed/' + id + '?autoplay=1&' + youtubeParameters +  '" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe>';
        el.classList.remove('lazyYT-image-loaded');
        el.classList.add('lazyYT-video-loaded');
      }
    }, false);
  }

  return {
    init: function(selector) {
      var els = document.querySelectorAll(selector);
      [].forEach.call(els, function(el) {
        el.style.cursor = 'pointer';
        setUp(el);
      });
    }
  };
})();
