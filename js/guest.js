!function(exports) {
  'use strict';

  var conf = {};

  LazyLoader.getJSON('/conf.json').then(function(pConf) {
    conf = pConf;
    document.getElementById('guest').textContent = conf.guest;
  });

  var home = document.querySelector('#home');

  home.addEventListener('click', function(e) {
    exports.location.reload();
  });

  chat.addEventListener('click', function(e) {
    var server = conf.server;
    var hostUUID = conf.hostUUID;
    var eventId = conf.eventId;
    var guests = [conf.guest];
    var appointmentData = {
      startTime: Date.now(),
      endTime: Date.now() + 3600,
      description: conf.description,
    };

    Request.putAppointment(server, hostUUID, eventId, appointmentData, guests).
      then(aResults => {
        alert(aResults);
        chat.classList.add('selectMenu');
        home.classList.remove('selectMenu');
        document.getElementById('ourCompany-part').classList.add('hidden');
        var iframe = document.querySelector('#opentok iframe');
        iframe.src = server + '/waitingRoom/' + aResults.url;
        document.getElementById('opentok').classList.remove('hidden');
    }).catch(e => {
      console.error('Error adding appointment:', e);
      alert('Error adding appointment');
    });
  });

}(this);
