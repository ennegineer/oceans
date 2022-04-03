//api key for openweather maps
var apiKey = "8398899c56ffcd0db03f0a592eff659a"
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
var wind = L.OWM.temperature({appId: apiKey})
// to make passed strings camel case
function capitalizeFirstLetter(string) {
  var holder = string.charAt(0).toUpperCase() + string.slice(1);
  return holder
}

var eutrophic_hypoxic = new L.LayerGroup();
var world_currents = new L.LayerGroup();
var fishing_area = new L.LayerGroup();
var boat_migration = new L.LayerGroup();

var myRenderer = L.canvas({ padding: 0.5 });
for (var i = 0; i < 100000; i += 1) { // 100k points
	L.circleMarker(getRandomLatLng(), {
  	renderer: myRenderer
  }).addTo(boat_migration).bindPopup('marker ' + i);
}

function getRandomLatLng() {
	return [
  	-90 + 180 * Math.random(),
    -180 + 360 * Math.random()
  ];
}


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
        //console.log("Unknown")
          var whiteMarker = L.ExtraMarkers.icon({
          shape: 'circle',
          markerColor: 'white',
        })
          L.marker(coord, {icon : whiteMarker}).bindPopup(`<h3>Status: ${condition}</h3><hr><p>${hypoxic_data[i]["Comment "]}</p>`).addTo(eutrophic_hypoxic);
        }
    }
}).catch(error=>console.log(error))

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
//   console.log(fishTons[34])

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
  "Temperature Map": wind,
  "Wind Map": owm_layer
}; 

var overlayMaps = {
  "Eutrophication Map": eutrophic_hypoxic,
  "World Currents": world_currents,
  "FAO Fishing Areas": fishing_area,
  "Boat Migrations": boat_migration
};

var myMap = L.map("map", {
  center: [0,0],
  zoom: 4,
  layers: [baselayer, eutrophic_hypoxic]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);