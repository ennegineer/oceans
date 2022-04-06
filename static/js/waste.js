//api key for openweather maps
var apiKey = "8398899c56ffcd0db03f0a592eff659a"
var zoom = 3
//https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={8398899c56ffcd0db03f0a592eff659a}
//https://tile.openweathermap.org/map/wind_new/3/20/20.png?appid={8398899c56ffcd0db03f0a592eff659a}

var tilelink = `https://tile.openweathermap.org/map/wind_new/20/20/3.png?appid=8398899c56ffcd0db03f0a592eff659a`
// tile layer
var baseLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://carto.com/basemaps/">CartoB</a> contributors'
})

var owm_layer = L.tileLayer(tilelink, {

})
//open weather street map layer with leaflet
//works but downsides; it only takes so many calls per second and in a world wide view; that gets eaten quickly
//possible solutions: limit zoom/pan/scroll etc. or just simple limit how big the map is so it needs less tiles
var temp = L.OWM.temperature({appId: apiKey})

// to make passed strings camel case
function capitalizeFirstLetter(string) {
  var holder = string.charAt(0).toUpperCase() + string.slice(1);
  return holder
}

//all layers
var eutrophic_hypoxic = new L.LayerGroup();
var world_currents = new L.LayerGroup();
var trash_markers = new L.LayerGroup();

//put all boats into one layer and make the legend. the legend should explain they were rated based on their chance of bycatch from highest to loweset


//add world rivers to eutrophication layer
//better highlights the path that runoff takes
d3.json("static/data/world_rivers.json").then(function (data) {
  var river = data.features //#9ecae1
  L.geoJson(river, {
    style: function (feature) {
      return {color: "#deebf7",fillOpacity:0.8};
    }
  }).addTo(eutrophic_hypoxic)
})

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
})

//lat = 5, long = 6. refers to what was found by a variety of clean up charities around the world
d3.json("static/data/marine_debris_results_location_not_dropped.json").then(function (data) {
  var info = data.data;
  //console.log(info)
  //var pointArray = [];
  var customMarker = L.ExtraMarkers.icon({
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

  //set up the marker cluster
  var markers = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var text = String(markers.length)
      //var html = '<div class="circle">' + markers.length + '</div>';
      //L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(32, 32) });
      return L.ExtraMarkers.icon({
        shape: 'square',
        markerColor: 'cyan',
        prefix: 'fa',
        icon: 'fa-number',
        iconColor: '#fff',
        iconRotate: 0,
        extraClasses: '',
        number: text,
        svg: false
      }) 
    }, spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true 
  },
);
//info[i][2] is the category
//set up for the individual markers
  for (i = 0; i < info.length; i++) {
    var name = info[i][1]
    var cat = info[i][2]
    var lat = info[i][5]
    var lng = info[i][6]
    var coord = [lat, lng]
    
    markers.addLayer(L.marker(coord), {icon : customMarker}).bindPopup("Item Found: " + name +"<hr>Category: "+ cat);
  
  }
  markers.addTo(trash_markers)
})

d3.json("static/data/Major_Ocean_Currents.geojson").then(function (data) {
  var currents = data.features
  L.geoJson(currents, {
    style: function (feature) {
      return {color: "#002366",fillOpacity:0.8};
    }
  }).addTo(world_currents)
})


var baseMaps = {
  "Base Map": baseLayer,
  "Temperature Map": temp,
}; 

var overlayMaps = {
  "World Currents": world_currents,
  "Beach Debris at Cleanup Sites": trash_markers,
  "Eutrophication": eutrophic_hypoxic
};

var myMap = L.map("map", {
  center: [0,0],
  zoom: 2,
  layers: [baseLayer, trash_markers]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);