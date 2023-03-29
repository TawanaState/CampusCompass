var map, watchId, userPin, directionsManager, routePath, destinationLoc, friendPin, EventPin, PlacePin;

function init() {
    map = new Microsoft.Maps.Map("#map", {
      center: new Microsoft.Maps.Location(-17.78521, 31.05311),
      zoom: 19,
      supportedMapTypes: [
        Microsoft.Maps.MapTypeId.road,
        Microsoft.Maps.MapTypeId.aerial,
        Microsoft.Maps.MapTypeId.streetside,
        Microsoft.Maps.MapTypeId.grayscale,
        Microsoft.Maps.MapTypeId.canvasDark,
        Microsoft.Maps.MapTypeId.canvasLight,
        Microsoft.Maps.MapTypeId.birdseye, //Will display a button in the future.
    ],
      mapTypeId: Microsoft.Maps.MapTypeId.canvasLight
    });

    friendPin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(-17.78521, 31.05311), {visible : false, icon: 'assets/img/user_location_48px.png',
    anchor: new Microsoft.Maps.Point(24, 24)});
    EventPin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(-17.78521, 31.05311), {visible : false, icon: 'assets/img/point_of_interest_52px.png',
    anchor: new Microsoft.Maps.Point(26, 26)});
    PlacePin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(-17.78521, 31.05311), {visible : false, icon: 'assets/img/marker_100px.png',
      anchor: new Microsoft.Maps.Point(50, 50)});
    map.entities.push(friendPin);
    map.entities.push(EventPin);
    map.entities.push(PlacePin);



  //Load the directions and spatial math modules.
  Microsoft.Maps.loadModule(["Microsoft.Maps.Directions"], function () {
    //Create an instance of the directions manager.
    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

    //Define direciton options that you want to use, that won't be reset the next time a route is calculated.
    //Calculate a date time that is 1 hour from now.
    var departureTime  = new Date();
    departureTime.setMinutes(departureTime.getHours() + 1);

    //Set the request options that avoid highways and uses kilometers.
    directionsManager.setRequestOptions({
      distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
      routeAvoidance: [
        Microsoft.Maps.Directions.RouteAvoidance.avoidLimitedAccessHighway,
      ],
      routeMode: Microsoft.Maps.Directions.RouteMode.walking,
      time: departureTime,
      timeType: Microsoft.Maps.Directions.TimeTypes.departure
    });

    //Make the route line thick and green.
    directionsManager.setRenderOptions({
      drivingPolylineOptions: {
        strokeColor: "mediumaquamarine",
        strokeThickness: 6,
      },
    });

    Microsoft.Maps.Events.addHandler(
      directionsManager,
      "directionsUpdated",
      directionsUpdated
    );
  });
}

window.places = [
  {
    title: "University Of Zimbabwe",
    position: { lat: -17.78521, lng: 31.05311 },
    content: "The University of Zimbabwe (UZ) is a public university in Harare, Zimbabwe. It opened in 1952 as the University College of Rhodesia and Nyasaland, and was initially affiliated with the University of London. It was later renamed the University of Rhodesia, and adopted its present name upon Zimbabwe's independence in 1980. UZ is the oldest and best-ranked university in Zimbabwe. The university has eleven faculties and one college (with faculties of Agriculture, Arts, Commerce, Education, Engineering, Law, Science, Social Studies, Veterinary Sciences and the College of Health Sciences) offering a wide variety of degree programmes and many specialist research centres and institutes. The university is accredited through the National Council for Higher Education, under the Ministry of Higher and Tertiary Education. English is the language of instruction. ",
    images: [],
  },
  {
    title: "UZ Administration",
    position: { lat: -17.7813949, lng: 31.0540614 },
    content: "",
    images: [],
  },
  {
    title: "UZ Library",
    position: { lat: -17.7804668, lng: 31.053666 },
    content: "",
    images: [],
  },
  {
    title: "UZ Swimming Pool",
    position: { lat: -17.7833028, lng: 31.0548178 },
    content: "",
    images: [],
  },
  {
    title: "University Of Zimbabwe BEIT HALL",
    position: { lat: -17.7824513, lng: 31.0538720 },
    content: "",
    images: [],
  },
  {
    title: "UZ Senior Common Room",
    position: { lat: -17.7832865, lng: 31.0542170 },
    content: "",
    images: [],
  },
  {
    title: "University Of Zimbabwe Christian Union",
    position: { lat: -17.7832128, lng: 31.0534881 },
    content: "",
    images: [],
  },
  {
    title: "UZ Sports Pavilion",
    position: { lat: -17.7849074, lng: 31.0536728 },
    content: "",
    images: [],
  },
  {
    title: "Faculty Of Science",
    position: { lat: -17.7849061, lng: 31.0545811 },
    content: "",
    images: [],
  },
  {
    title: "Law Library",
    position: { lat: -17.7804304, lng: 31.0532071 },
    content: "",
    images: [],
  },
  {
    title: "Great Hall",
    position: { lat: -17.7808729, lng: 31.0541888 },
    content: "",
    images: [],
  },
  {
    title: "New Llewelyn Block",
    position: { lat: -17.7811449, lng: 31.0528340 },
    content: "",
    images: [],
  },
  {
    title: "UZ LTI LTII",
    position: { lat: -17.7803908, lng: 31.0523529 },
    content: "",
    images: [],
  },
  {
    title: "University Of Zimbabwe, Diamond Lecture Theatre",
    position: { lat: -17.7822285, lng: 31.052464 },
    content: "",
    images: [],
  },
  {
    title: "Diamond Cafe",
    position: { lat: -17.7825264, lng: 31.0532900 },
    content: "",
    images: [],
  },
  {
    title: "Department of Architure and Real Estate",
    position: { lat: -17.7828443, lng: 31.05311679 },
    content: "",
    images: [],
  },
  {
    title: "UZ Geology Department",
    position: { lat: -17.7825861, lng: 31.0525165 },
    content: "",
    images: [],
  },
  {
    title: "Faculty Of Computer Science",
    position: { lat: -17.7834768, lng: 31.0507295 },
    content: "",
    images: [],
  },
  {
    title: "UZ Computer Center",
    position: { lat: -17.7835994, lng: 31.0509306 },
    content: "",
    images: [],
  },
  {
    title: "University Of Zimbabwe, Mathematics Department",
    position: { lat: -17.7836661, lng: 31.0512377 },
    content: "",
    images: [],
  },
  {
    title: "Johnson Siziba",
    position: { lat: -17.7831240, lng: 31.0512438 },
    content: "",
    images: [],
  },
  {
    title: "University Of Zimbabwe, Physics Department",
    position: { lat: -17.7822317, lng: 31.0514667 },
    content: "",
    images: [],
  },
  {
    title: "Security Control Room",
    position: { lat: -17.7801705, lng: 31.0500368 },
    content: "",
    images: [],
  },
  {
    title: "UZ Agriculture",
    position: { lat: -17.7819539, lng: 31.0505226 },
    content: "",
    images: [],
  },
  {
    title: "UZ FACULTY OF ENGINEERING",
    position: { lat: -17.7818588, lng: 31.0491798 },
    content: "",
    images: [],
  },
  {
    title: "UZ Engineering, Mining and Metallurgy",
    position: { lat: -17.7825391, lng: 31.0490658 },
    content: "",
    images: [],
  },
  {
    title: "UZ Engineering Workshops",
    position: { lat: -17.7818240, lng: 31.0482568 },
    content: "",
    images: [],
  },
  {
    title: "UZ Medicine",
    position: { lat: -17.7841153, lng: 31.0492797 },
    content: "",
    images: [],
  },
  {
    title: "Faculty of Medicine and Health Sciences",
    position: { lat: -17.7845326, lng: 31.0494225 },
    content: "",
    images: [],
  },
  {
    title: "UZ Veterinary Science",
    position: { lat: -17.7854067, lng: 31.0490155 },
    content: "",
    images: [],
  },
  {
    title: "Faculty of Veterinary Science",
    position: { lat: -17.7860995, lng: 31.0492717 },
    content: "",
    images: [],
  },
  {
    title: "UZ HLT 200, HLT 300, HLT 500",
    position: { lat: -17.7801881, lng: 31.0513702 },
    content: "",
    images: [],
  },
  
];

window.init = init;


function startTracking() {
  //Add a pushpin to show the user's location.
  userPin = new Microsoft.Maps.Pushpin(map.getCenter(), { visible: false });
  map.entities.push(userPin);

  //Watch the users location.
  watchId = navigator.geolocation.watchPosition(usersLocationUpdated);
}

function locateFriend(param) {
  stopTracking();
  let loc = new Microsoft.Maps.Location(
    param.location.latitude,
    param.location.longitude
  );
  friendPin.setLocation(loc);
  //Create custom Pushpin
  friendPin.setOptions({
      title: param.username,
      subTitle: new Date(param.lastseen).toString(),
      text: 'f',
      visible : true
  });

  //Center the map on the user's location.
  map.setView({ center: loc });
  showinFooter('@'+param.username,'<b>Lastseen : </b> ' + new Date(param.lastseen).toString(), [], param.location);

}

function locateEvent(param) {
  stopTracking();
  let loc = new Microsoft.Maps.Location(
    param.location.latitude,
    param.location.longitude
  );
  EventPin.setLocation(loc);
  //Create custom Pushpin
  EventPin.setOptions({
      title: param.event_name,
      subTitle: 'event',
      text: 'e',
      visible : true
  });



  //Center the map on the user's location.
  map.setView({ center: loc });
  showinFooter('~'+param.event_name, param.description, param.images, param.location);

}

function locatePlace(param) {
  stopTracking();
  let loc = new Microsoft.Maps.Location(
    param.position.lat,
    param.position.lng
  );
  PlacePin.setLocation(loc);
  //Create custom Pushpin
  PlacePin.setOptions({
      title: param.title,
      subTitle: 'place',
      visible : true
  }); //Center the map on the user's location.
  map.setView({ center: loc });
  showinFooter(param.title, param.content, param.images, {latitude : param.position.lat, longitude : param.position.lng});
}

function usersLocationUpdated(position) {
  var loc = new Microsoft.Maps.Location(
    position.coords.latitude,
    position.coords.longitude
  );

  //Update the user pushpin.
  userPin.setLocation(loc);
  userPin.setOptions({ visible: true });

  //Center the map on the user's location.
  map.setView({ center: loc });

  //Calculate a new route if one hasn't been calculated or if the users current location is further than 50 meters from the current route.
  if (!routePath || Microsoft.Maps.SpatialMath.distance(loc, routePath) > 50) {
    calculateRoute(loc, destinationLoc);
  }
}

function stopTracking() {
  // Cancel the geolocation updates.
  navigator.geolocation.clearWatch(watchId);

  //Remove the user pushpin.
  map.entities.clear();
  map.entities.push(friendPin);
  map.entities.push(EventPin);
  map.entities.push(PlacePin);
  clearDirections();
}

function calculateRoute(userLocation, destination) {
  clearDirections();

  //Create waypoints to route between.
  directionsManager.addWaypoint(
    new Microsoft.Maps.Directions.Waypoint({ location: userLocation })
  );
  directionsManager.addWaypoint(
    new Microsoft.Maps.Directions.Waypoint({ location: destination })
  );

  //Calculate directions.
  directionsManager.calculateDirections();
}

function directionsUpdated(e) {
  //When the directions are updated, get a polyline for the route path to perform calculations against in the future.
  var route = directionsManager.getCurrentRoute();

  if (route && route.routePath && route.routePath.length > 0) {
    routePath = new Microsoft.Maps.Polyline(route.routePath);
  }
}

function clearDirections() {
  //Clear directions waypoints and display without clearing it's options.
  directionsManager.clearDisplay();

  var wp = directionsManager.getAllWaypoints();
  if (wp && wp.length > 0) {
    for (var i = wp.length - 1; i >= 0; i--) {
      this.directionsManager.removeWaypoint(wp[i]);
    }
  }

  routePath = null;
}

function goNow(event) {
    destinationLoc = new Microsoft.Maps.Location(
        Number(document.querySelector('#LocPin').getAttribute('lat')),
        Number(document.querySelector('#LocPin').getAttribute('lng'))
      );
      startTracking();
}
function shareNow(event) {
  input = document.getElementById('textarea_copy');
  let websi = window.location.href;
  websi = websi.replace('attractions.html', '');
  websi = websi.replace(window.location.hash, '');
  input.value = `${websi}#lat=${Number(document.querySelector('#LocPin').getAttribute('lat'))}&lng=${Number(document.querySelector('#LocPin').getAttribute('lng'))}`;
  input.classList.toggle('d-none');
  input.select();
  document.execCommand("copy");
  input.classList.toggle('d-none');
  notify('Link has been copied. </br> Now you can share with your friends :)');
}
