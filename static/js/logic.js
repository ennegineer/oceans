//api key for openweather maps
var app_id = "8398899c56ffcd0db03f0a592eff659a"
var zoom = 3

var tilelink = `https://tile.openweathermap.org/map/wind_new/20/20/3.png?appid=8398899c56ffcd0db03f0a592eff659a`
// tile layer
var baselayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var owm_layer = L.tileLayer(tilelink, {

})
//open weather street map layer with leaflet
//works but downsides; it only takes so many calls per second and in a world wide view; that gets eaten quickly
//possible solutions: limit zoom/pan/scroll etc. or just simple limit how big the map is so it needs less tiles
var wind = L.OWM.temperature({appId: app_id})
// to make passed strings camel case
function capitalizeFirstLetter(string) {
  var holder = string.charAt(0).toUpperCase() + string.slice(1);
  return holder
}

//all layers
var eutrophic_hypoxic = new L.LayerGroup();
var world_currents = new L.LayerGroup();
var fishing_area = new L.LayerGroup();
var boat_traffic = new L.LayerGroup();
var trash_markers = new L.LayerGroup();

// var collection = turf.featureCollection(continents.features);
var options = {
  obstacles: collection
};

// var myRenderer = L.canvas({ padding: 0.5 });
// for (var i = 0; i < 100000; i += 1) { // 100k points
// 	L.circleMarker(getRandomLatLng(), {
//   	renderer: myRenderer
//   }).addTo(boat_migration).bindPopup('marker ' + i);
// }

// function getRandomLatLng() {
// 	return [
//   	-90 + 180 * Math.random(),
//     -180 + 360 * Math.random()
//   ];
// }

//put all boats into one layer and make the legend. the legend should explain they were rated based on their chance of bycatch from highest to loweset
//pole lines (1 representative)
d3.json("static/data/boats/pole_and_line_5.json").then(function (data){
    var coordArray = []
    for (i = 0; i < data.length; i++) {
      var lat = data[i]["lat"]
      var lng = data[i]["lon"]
      var coords = [lat, lng]
      coordArray.push(coords)
    }
    L.polyline(coordArray, {color: '#66c2a4',dashArray: '20, 20', dashOffset: '0'}).addTo(boat_traffic)
  })
  //trollers (1 representative)
  d3.json("static/data/boats/troller_5.json").then(function (data){
    var coordArray = []
    for (i = 0; i < data.length; i++) {
      var lat = data[i]["lat"]
      var lng = data[i]["lon"]
      var coords = [lat, lng]
      coordArray.push(coords)
    }
    L.polyline(coordArray, {color: '#11A579',dashArray: '20, 20', dashOffset: '0'}).addTo(boat_traffic)
  })
  
  // //longlines (12 representatives) data\boats\drifting_longlines\drifting_ll_1.json
  for (i = 0; i < 12; i++) {
    var jsonList = [1,11,20,35,40,50,60,70,80,90,100,108]
    var path = "static/data/boats/drifting_ll_"
    var fullPath = path + jsonList[i]+".json"
    d3.json(fullPath).then(function (data){
      var turfArray = []
      for (i = 0; i < data.length-1; i++) {
        var lat = data[i]["lat"]
        var lng = data[i]["lon"]
        var lng2 = data[i+1]["lon"]
        var turfCoords = [lng, lat]
  
        if (Math.abs(lng - lng2) > 180) {
          turfCoords = [lng.wrap(179, -179), lng2];
        }
        turfArray.push(turfCoords)
      }
      var line = turf.multiLineString(turfArray);
      var curved = turf.bezierSpline(line);
      L.geoJson(curved, {
        style: function (feature) {
        return {color: "#df65b0",fillOpacity:0.8};
        }
      }).addTo(boat_traffic)
    })
  }
  
  // //purse_seines (3 representatives)
  for (i = 0; i < 3; i++) {
    var jsonList = [2,3,6]
    var path = "static/data/boats/purse_seine_"
    var fullPath = path + jsonList[i]+".json"
    d3.json(fullPath).then(function (data){
      var coordArray = []
      for (i = 0; i < data.length-1; i++) {
        var lat = data[i]["lat"]
        var lng = data[i]["lon"]
        var lng2 = data[i+1]["lon"]
        var coords = [lng, lat]
        if (Math.abs(lng - lng2) > 180) {
          coords = [lng.wrap(179, -179), lng2];
        }
        coordArray.push(coords)
      }
      var line = turf.multiLineString(coordArray);
      var curved = turf.bezierSpline(line);
      L.geoJson(curved, {
        style: function (feature) {
        return {color: "#dd1c77",fillOpacity:0.8};
        }
      }).addTo(boat_traffic)
    })
  }
  
  //trawlers (6 representatives)
  for (i = 0; i < 6; i++) {
    var jsonList = [13,24,28,31,32,37]
    var path = "static/data/boats/trawler_"
    var fullPath = path + jsonList[i]+".json"
    d3.json(fullPath).then(function (data){
      var coordArray = []
      for (i = 0; i < data.length-1; i++) {
        var lat = data[i]["lat"]
        var lng = data[i]["lon"]
        var lng2 = data[i+1]["lon"]
        var coords = [lng, lat]
        if (Math.abs(lng - lng2) > 180) {
          coords = [lng.wrap(179, -179), lng2];
        }
        coordArray.push(coords)
      }
      var line = turf.multiLineString(coordArray);
      var curved = turf.bezierSpline(line);
      L.geoJson(curved, {
        style: function (feature) {
        return {color: "#980043",fillOpacity:0.8};
        }
      }).addTo(boat_traffic)
    })
  }


//add world rivers to eutrophication layer
//better highlights the path that runoff takes
var riverPath = "http://ihp-wins.unesco.org/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3Aworld_rivers&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326"

d3.json("data/areas/world_rivers.json").then(function (data) {
  var river = data.features //#9ecae1
  L.geoJson(river, {
    style: function (feature) {
      return {color: "#deebf7",fillOpacity:0.8};
    }
  }).addTo(eutrophic_hypoxic)
})


//pass in dataset
d3.json("static/data/wri_eutrophic_hypoxic_2011.json").then(function (data) {
    
    var hypoxic_data = data.hypoxic_eutrophic
    for (i = 0; i < hypoxic_data.length; i++ ) {
        var coord = [hypoxic_data[i]["Lat "], hypoxic_data[i]["Long "]]
        var condition = capitalizeFirstLetter(hypoxic_data[i]["Classification "])

        if (condition == "Hypoxic") {
          var yellowMarker = L.ExtraMarkers.icon({
            shape: 'circle',
            markerColor: 'yellow',
            prefix: 'fa',
            icon: 'ion-android-warning',
            iconColor: '#fff',
            iconRotate: 0,
            extraClasses: '',
            number: '',
            svg: false
          })
            L.marker(coord, {icon : yellowMarker}).bindPopup(`<h3>Status: ${condition}</h3><hr><p>${hypoxic_data[i]["Comment "]}</p>`).addTo(eutrophic_hypoxic);
        }
        else if (condition == "Eutrophic") {
          //console.log("Worst")
          var redMarker = L.ExtraMarkers.icon({
            shape: 'circle',
            markerColor: 'red',
            prefix: 'fa',
            icon: 'ion-alert',
            iconColor: '#fff',
            iconRotate: 0,
            extraClasses: '',
            number: '',
            svg: false
          })
            L.marker(coord, {icon : redMarker}).bindPopup(`<h3>Status: ${condition}</h3><hr><p>${hypoxic_data[i]["Comment "]}</p>`).addTo(eutrophic_hypoxic);
        } 
        else if (condition == "Improved") {
          var blueMarker = L.ExtraMarkers.icon({
            shape: 'circle',
            markerColor: 'blue',
            prefix: 'fa',
            icon: 'ion-chevron-up',
            iconColor: '#fff',
            iconRotate: 0,
            extraClasses: '',
            number: '',
            svg: false
          })
            L.marker(coord, {icon : blueMarker}).bindPopup(`<h3>Status: ${condition}</h3><hr><p>${hypoxic_data[i]["Comment "]}</p>`).addTo(eutrophic_hypoxic);
        }
        else {

          var whiteMarker = L.ExtraMarkers.icon({
          shape: 'circle',
          markerColor: 'white',
        })
          L.marker(coord, {icon : whiteMarker}).bindPopup(`<h3>Status: ${condition}</h3><hr><p>${hypoxic_data[i]["Comment "]}</p>`).addTo(eutrophic_hypoxic);
        }
    }
}).catch(error=>console.log(error))


d3.json("static/data/marine_debris_results_location_not_dropped.json").then(function (data) {
    var info = data.data;
    var pointArray = [];
    var markers = L.markerClusterGroup();
  
    for (i = 0; i < info.length; i++) {
      var name = info[i][1]
      var lat = info[i][5]
      var lng = info[i][6]
      var coord = [lat, lng]
      if (coord) {
        markers.addLayer(L.marker([lat,lng]))
          .bindPopup(name);
      }
      //var point = turf.point([lng, lat], {name: name});
      //pointArray.push(point)
    }
    markers.addTo(trash_markers)
    //var points = turf.randomPoint(10000, {pointArray});
    //var collection = turf.featureCollection(pointArray); ["cluster"], ["centroid"]
    //var options = {numberOfClusters: 100};
    //var clustered = turf.clustersKmeans(points, options);
    //console.log(clustered.features[0].properties["cluster"])
    
  })



d3.json("static/data/Major_Ocean_Currents.geojson").then(function (data) {
  var currents = data.features
  L.geoJson(currents, {
    style: function (feature) {
      return {color: "#002366",fillOpacity:0.8};
    }
  }).addTo(world_currents)

})

//value counts for the areas:
// fishTons = {34: 108013, 27 = 107028, 51 = 72906, 37 = 66490, 
// 31 = 49233, 47 = 48093, 21 = 45154, 39496, 71 = 38440, 57 = 37047, 
// 87 = 25593, 81 = 24043, 77 = 23715 61 = 21327, 
//67 = 12109, 48 = 11297, 58 =7330,  88 = 6784, 18 = 354 
// #f6eff7 #bdc9e1 #67a9cf #02818a
d3.json("static/data/World_Fao_Zones.json").then(function (data) {
  var area = data.features
  var fishTons = {34: 108013, 27 : 107028, 51: 72906, 37: 66490, 31: 49233, 47: 48093, 21: 45154, 41: 39496, 71: 38440, 57: 37047, 
    87: 25593, 81: 24043, 77: 23715, 61: 21327, 
    67: 12109, 48: 11297, 58: 7330,  88: 6784, 18: 354 
  }

  L.geoJson(area, {
    onEachFeature: function (feature, layer) {
      var zones = feature.properties["zone"]
      var value = fishTons[zones]
      layer.bindPopup('<h3> Zone: '+zones+'</h3><hr><p>'+value+' tons of fish were farmed here since the 1950s');
    },
    style: function (feature) {
      var zones = feature.properties["zone"]
      var value = fishTons[zones]
      var indicator = ""
      if (value < 15000) {
        indicator = "#ffffcc"
      }
      else if (value < 30000 && value > 15000) {
        indicator = "#a1dab4"
      }
      else if (value < 50000 && value > 30000) {
        indicator = "#41b6c4"
      }
      else if (value < 110000 && value > 50000) {
        indicator = "#225ea8"
      }
      else {
        indicator = "white"
      }
      return {color: indicator, fillOpacity:0.5};
    }
  }).addTo(fishing_area)
})

var baseMaps = {
  "Basic Map": baselayer,
  "Temperature Map": temp
}; 

var overlayMaps = {
  "World Currents": world_currents,
  "FAO Fishing Areas": fishing_area,
  "Boat Traffic": boat_traffic,
  "Eutrophication Map": eutrophic_hypoxic,
  "Beach Debris": trash_markers
};

var myMap = L.map("map", {
  center: [0,0],
  zoom: 4,
  layers: [baselayer, boat_traffic]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

colors = ['#66c2a4','#11A579', '#df65b0', '#dd1c77', '#980043'];
legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
  div = L.DomUtil.create('div','info legend'),
    labels = ['<h5> Boats (from lowest to highest bycatch) </h5>'],
    categories = ['Pole-Line','Trollers', 'Drifting Longlines', 'Purse Seine Nets', 'Trawlers'];

  for (i = 0; i < categories.length; i++) {
    div.innerHTML +=
        labels.push('<i class = "square" style="background:' + colors[i] + '"></i> ' + categories[i] + '<br>');
  };
  div.innerHTML = labels.join('<hr>');
return div

};

legend.addTo(myMap);