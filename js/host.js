!function(exports) {
  'use strict';

  LazyLoader.getJSON('/demo-package/conf.json').then(function(conf) {
    var iframe = document.querySelector('#opentok iframe');
    iframe.src = conf.server + '/waitingRoom/' + conf.hostUUID;
  });

}(this);
