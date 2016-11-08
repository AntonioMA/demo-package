!function(exports) {
  'use strict';

  function sendXHR(aType, aURL, aData, aDataType, aResponseType) {
    return new Promise(function(resolve, reject) {
      aData = typeof aData === 'object' && JSON.stringify(aData) || aData;
      var xhr = new XMLHttpRequest();
      xhr.open(aType, aURL);
      xhr.responseType = aResponseType || 'json';
      xhr.overrideMimeType && xhr.overrideMimeType('application/json');
      if (aDataType) {
        // Note that this requires
        xhr.setRequestHeader('Content-Type', aDataType);
      }

      xhr.onload = function (aEvt) {
        if (xhr.status === 200) {
          var response = xhr.responseType === 'json' && (xhr.response || {}) || xhr.responseText;
          if (xhr.responseType === 'json' && typeof xhr.response === 'string') {
            response = JSON.parse(response);
          }
          resolve(response);
        } else {
          reject({ status: xhr.status, reason: xhr.response });
        }
      };

      xhr.onerror = function (aEvt) {
        console.error('sendXHR. XHR failed ' + JSON.stringify(aEvt) + 'url: '+
                    aURL + ' Data: ' + aData + ' RC: ' + xhr.responseCode);
        reject(aEvt);
      };

      xhr.send(aData);
    });
  }

  function composeDate(data) {
    var composed = [];

    Object.keys(data).forEach(function(key) {
      composed.push(key);
      composed.push('=');
      composed.push(data[key]);
      composed.push('&');
    });

    composed.length && composed.pop();

    return composed.join('');
  }

  function putAppointment(server, aHostUUID, aEventId, aCommonData, aGuests) {
    var path = [server, 'appointment', aHostUUID, aEventId].join('/');
    console.log(path);
    var requests = [];
    aGuests.forEach(aGuestId => {
      var appointmentData = {
        guestId: aGuestId,
        description: aCommonData.description,
        allowRecording: !!aCommonData.allowRecording,
        notBefore: aCommonData.notBefore || aCommonData.startTime - 1800,
        notAfter: aCommonData.notAfter || aCommonData.endTime + 1800,
        startTime: aCommonData.startTime,
        endTime: aCommonData.endTime
      };
      requests.push(Request.sendXHR('PUT', path, appointmentData, 'application/json'));
    });
    return Promise.all(requests);
  };

  var Request = {
    sendXHR: sendXHR,
    putAppointment: putAppointment
  };

  exports.Request = Request;
}(this);
