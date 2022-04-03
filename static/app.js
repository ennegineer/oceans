var mmsiList = [42314208291274,
    261683006747890,
    106150487182509,
    245558512447234,
    103786638076601,
    149732026109185,
    280291299563683,
    130528914446151,
    7572518792420,
    273352002611600,
    262522671777909,
    139028728648447,
    30054937091173,
    203685766228826,
    185079710227621,
    225986789154693,
    178858950138911,
    184922007900201,
    88780175381729,
    230452925672863,
    85022770160929,
    205198558017191,
    10759394346704,
    59112496180970,
    126605727399747,
    30581813007233,
    81653757071585,
    136929052181490,
    28144259049658,
    181792856256929,
    271648488454992,
    94745481952721,
    53148833486047,
    194716368060295]

  select = document.getElementById("selDataset");
  for (let i = 0; i < mmsiList.length; i++) {
    var opt = document.createElement("option");
    row = mmsiList[i];
    opt.value = row;
    opt.innerHTML = row;
    select.appendChild(opt);
  }
//   optionChanged(mmsiList[0]);

function optionChanged(selectedID) {
  // Grab the data for the selected trawler
  // Loop through the array of data
  for (let i = 0; i < trawlers.length; i++) {
    row = trawlers[i];
    // Compare value to selected argument
    if (row.mmsi == selectedID) {
      var selectedMMSI = row.mmsi;
    }
  }}

// Creating the map object
var myMap = L.map("map", {
    center: [53.9277305603, -3.0039317608],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);

  d3.json("data/trawlers/trawler_1.json").then(function (response) {
    // console.log(response);
  
    // Create a new marker cluster group.
    var markers = L.markerClusterGroup();
  
    // Loop through the data.
    for (var i = 0; i < response.length; i++) {

      console.log('made a point!')
      // Add circles to the map.
      markers.addLayer(L.circle([response[i].lat, response[i].lon], {
        fillOpacity: 0.75,
        color: "blue",
        fillColor: "green",
      }).bindPopup(`<h1>${response[i].timestamp}</h1> <hr>
        <h3>Fishing?: ${response[i].is_fishing}</h3>`));
    }
     // Add our marker cluster layer to the map.
     myMap.addLayer(markers);
  });
