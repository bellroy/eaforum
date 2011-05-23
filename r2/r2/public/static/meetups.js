(function() {
  /* Show Meetup */
  document.observe("dom:loaded", function() {
    var map = $('map');
    if (map) {
      loadMaps(function() {
        var lat = map.readAttribute('data-latitude');
        var lng = map.readAttribute('data-longitude');
        var latlng = new google.maps.LatLng(lat, lng);
        var myOptions = {
          zoom: 16,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var gMap = new google.maps.Map(map, myOptions);
        var marker = new google.maps.Marker({
          map: gMap,
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: latlng,
          title: map.readAttribute('data-title')
        });
      });
    }
  });

  /* Add Meetup */
  function updateTimezone(date) {
    $$('input[name="tzoffset"]').each(function(el) {
      el.setValue(date.getTimezoneOffset() / -60)
    });
  }

  var statusIcons = {
    "spinner": "/static/spinner.gif",
    "ok": "/static/accept.png",
    "error": "/static/exclamation.png"
  };

  function updateGeocodeStatus(status, message) {
    var el = $('geocode_status');
    el.writeAttribute('src', statusIcons[status]);
    el.show();

    if (message) {
      $('geocoded_location').update(message);
    }
  }

  function geocodeLocation() {
    var el = this;
    updateGeocodeStatus('spinner');

    /* Geocode the address with Google */
    var geocoder = new google.maps.Geocoder();
    var request = {
      address: el.getValue()
    };
    geocoder.geocode(request, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var result = results.first();
        var location = result.geometry.location;
        updateGeocodeStatus('ok', result.formatted_address);
        $$('input[name="latitude"]').first().setValue(location.lat());
        $$('input[name="longitude"]').first().setValue(location.lng());
      }
      else {
        updateGeocodeStatus('error');
      }
    });
  }

  document.observe("dom:loaded", function() {
    var form = $('newmeetup');
    if (form) {
      form.focusFirstElement();

      loadMaps(function() {
        $('location').observe('change', geocodeLocation);
      });

      Protoplasm.use('timepicker', function() { /* Used by datepicker below */
        Protoplasm.use('datepicker', function() {
          var picker = new Control.DatePicker($$('input.date').first(), {epoch: true, timePicker: true, onSelect: updateTimezone});
        });
      });
    }
  });
})();