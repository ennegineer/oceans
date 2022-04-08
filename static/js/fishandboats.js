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

//all layers
var eutrophic_hypoxic = new L.LayerGroup();
var world_currents = new L.LayerGroup();
var fishing_area = new L.LayerGroup();
var boat_traffic = new L.LayerGroup();
var trash_markers = new L.LayerGroup();

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
  "Base Map": baseLayer,
  "Temperature Map": temp,
}; 

var overlayMaps = {
  "World Currents": world_currents,
  "FAO Fishing Areas": fishing_area,
  "Boat Traffic": boat_traffic,
};

var myMap = L.map("map", {
  center: [0,0],
  zoom: 2,
  layers: [baseLayer, fishing_area]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

colors = ['#ffffcc','#a1dab4','#41b6c4','#225ea8','#66c2a4','#11A579', '#df65b0', '#dd1c77', '#980043'];
legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
  div = L.DomUtil.create('div','info legend'),
    labels = ['<h6> FAO Fish Zones & Boats</h6><br><h6>(from lowest to highest bycatch)</h6>'],
    categories = ['Lightly Utilized','Moderately Utilized','Heavily Utilized','Intensely Utilized',
                'Pole-Line','Trollers', 'Drifting Longlines', 'Purse Seine Nets', 'Trawlers'];

  for (i = 0; i < categories.length; i++) {
    div.innerHTML +=
        labels.push('<i class = "square" style="background:' + colors[i] + '"></i> ' + categories[i] + '<br>');
  };
  div.innerHTML = labels.join('<hr>');
return div

};

legend.addTo(myMap);

   
let samples = "static/data/numbers_captured_marine_fish.json"

function initialize(data){
  d3.json(samples).then(function (data) {
    countryList=[];
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let key in row) {
        if(key === "COUNTRY_NAME" && !countryList.includes(row[key])){
          countryList.push(row[key]);
        };
      }; 
    };
    let selectElement = d3.select("#selDataset");
    for (let i = 0; i < countryList.length; i++) {
      selectElement.append("option").text(countryList[i]).property("value", countryList[i])
    };
    createAnimation('Albania')
  });
}
initialize()

function createAnimation(Test_ID){
  d3.json(samples).then(function (data) {
    initial_countryInformation=[];
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let key in row) {
        if(key === "COUNTRY_NAME" && row[key]=='Albania'){
          initial_countryInformation.push(row);
        };
      }; 
    };
    let max=0;
    for (let i = 0; i < initial_countryInformation.length; i++) {
      if (initial_countryInformation[i].VALUE > max) {
        max = initial_countryInformation[i].VALUE;
      } else {
        max = max;
      };
    };
    // Create a lookup table to sort and regroup the columns of data, first by year, then by fish group
    let lookup = {};
    function getData(year, fish) {
      let byYear, trace;
      if (!(byYear = lookup[year])) {
        byYear = lookup[year] = {};
      };
     // Create a container for the year + fish type if it's not there yet
      if (!(trace = byYear[fish])) {
        trace = byYear[fish] = {
          x: [],
          y: [],
          id: [],
          text: [],
          // marker: {size: []}
        };
      };
      return trace;
    };
    // Go through each row, get and append the data
    for (let i = 0; i < initial_countryInformation.length; i++) {
      let element = initial_countryInformation[i];
      let trace = getData(element.PERIOD, element.SPECIES_ISSCAAP_GROUP);
      trace.text.push(element.SPECIES_ISSCAAP_GROUP);
      trace.id.push(element.SPECIES_ISSCAAP_GROUP);
      trace.x.push(element.PERIOD);
      trace.y.push(element.VALUE);
      // trace.marker.size.push(element.VALUE);
    };
    // Get the group names
    let years = Object.keys(lookup);
    let startYear = years[0];
    let groupNames = lookup[startYear];
    let fishGroups = Object.keys(groupNames)
    // Create the main traces
    let traces = [];
    for (let i = 0; i < fishGroups.length; i++) {
      let data1 = groupNames[fishGroups[i]];
      traces.push({
        name: fishGroups[i],
        x: data1.x.slice(),
        y: data1.y.slice(),
        id: data1.id.slice(),
        text: data1.text.slice(),
        mode: 'markers',
        marker: {
          size: 20,
          opacity: 0.5
        }
      });
    };
    // Create a frame for each year
    let frames = []; 
    for (let i = 0; i < years.length; i++) {
      frames.push({
      name: years[i],
      data: fishGroups.map(function (fish) {
        return getData(years[i], fish);
      })
      })
    };
    // Now create slider steps, one for each frame
    let sliderSteps = [];
    for (let i = 0; i < years.length; i++) {
      sliderSteps.push({
        method: 'animate',
        label: years[i],
        args: [[years[i]], {
          mode: 'immediate',
          transition: {duration: 300},
          frame: {duration: 300, redraw: false},
        }]
      });
    }
    let layout = {
      width: 1100,
      height: 500,
      xaxis: {
        title: 'Year',
        range: [2010, 2020],
        dtick: 1
      },
      yaxis: {
        title: 'Tonnes - live weight',
        range: [0, max*1.25]
      },
      hovermode: 'closest',
      updatemenus: [{
        x: 0,
        y: 0,
        yanchor: 'top',
        xanchor: 'left',
        showactive: false,
        direction: 'left',
        type: 'buttons',
        pad: {t: 87, r: 10},
        buttons: [{
          method: 'animate',
          args: [null, {
            mode: 'immediate',
            fromcurrent: true,
            transition: {duration: 300},
            frame: {duration: 500, redraw: false}
          }],
          label: 'Play'
        }, {
          method: 'animate',
          args: [[null], {
            mode: 'immediate',
            transition: {duration: 0},
            frame: {duration: 0, redraw: false}
          }],
          label: 'Pause'
        }]
      }],
      sliders: [{
        pad: {l: 130, t: 55},
        currentvalue: {
          visible: true,
          prefix: 'Year:',
          xanchor: 'right',
          font: {size: 20}
        },
        steps: sliderSteps
      }]
    };
    // Create the plot
    Plotly.newPlot('myGraph', {
      data: traces,
      layout: layout,
      frames: frames,
    });
  });
}

function updateAnimation(Test_ID){
  d3.json(samples).then(function (data) {
    initial_countryInformation=[];
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let key in row) {
        if(key === "COUNTRY_NAME" && row[key]==Test_ID){
          initial_countryInformation.push(row);
        };
      }; 
    };
    console.log(initial_countryInformation);
    let max=0;
    for (let i = 0; i < initial_countryInformation.length; i++) {
      if (initial_countryInformation[i].VALUE > max) {
        max = initial_countryInformation[i].VALUE;
      } else {
        max = max;
      };
    };
    // Create a lookup table to sort and regroup the columns of data, first by year, then by fish group
    let lookup = {};
    function getData(year, fish) {
      let byYear, trace;
      if (!(byYear = lookup[year])) {
        byYear = lookup[year] = {};
      };
     // Create a container for the year + fish type if it's not there yet
      if (!(trace = byYear[fish])) {
        trace = byYear[fish] = {
          x: [],
          y: [],
          id: [],
          text: []
        }
      };
      return trace;
    };
    // Go through each row, get and append the data
    for (let i = 0; i < initial_countryInformation.length; i++) {
      let element = initial_countryInformation[i];
      let trace = getData(element.PERIOD, element.SPECIES_ISSCAAP_GROUP);
      trace.text.push(element.SPECIES_ISSCAAP_GROUP);
      trace.id.push(element.SPECIES_ISSCAAP_GROUP);
      trace.x.push(element.PERIOD);
      trace.y.push(element.VALUE);
      // trace.marker.size.push(element.VALUE);
    };
    // Get the group names
    let years = Object.keys(lookup);
    let startYear = years[0];
    let groupNames = lookup[startYear];
    let fishGroups = Object.keys(groupNames);
    // Create the main traces
    let traces = [];
    for (let i = 0; i < fishGroups.length; i++) {
      let data1 = groupNames[fishGroups[i]];
      traces.push({
        name: fishGroups[i],
        x: data1.x.slice(),
        y: data1.y.slice(),
        id: data1.id.slice(),
        text: data1.text.slice(),
        mode: 'markers',
        marker: {
          size: 20,
          opacity: 0.5
        }
      });
    };
    // Create a frame for each year
    let frames = []; 
    for (let i = 0; i < years.length; i++) {
        frames.push({
        name: years[i],
        data: fishGroups.map(function (fish) {
          return getData(years[i], fish);
        })
      })
    };
    // Now create slider steps, one for each frame
    let sliderSteps = [];
    for (let i = 0; i < years.length; i++) {
      sliderSteps.push({
        method: 'animate',
        label: years[i],
        args: [[years[i]], {
          mode: 'immediate',
          transition: {duration: 300},
          frame: {duration: 300, redraw: false},
        }]
      });
    };
    let layout = {
      width: 1100,
      height: 500,
      xaxis: {
        title: 'Year',
        range: [2010, 2020],
        dtick: 1
      },
      yaxis: {
        title: 'Tonnes - live weight',
        range: [0, max*1.25]
      },
      hovermode: 'closest',
      updatemenus: [{
        x: 0,
        y: 0,
        yanchor: 'top',
        xanchor: 'left',
        showactive: false,
        direction: 'left',
        type: 'buttons',
        pad: {t: 87, r: 10},
        buttons: [{
          method: 'animate',
          args: [null, {
            mode: 'immediate',
            fromcurrent: true,
            transition: {duration: 300},
            frame: {duration: 500, redraw: false}
          }],
          label: 'Play'
        }, {
          method: 'animate',
          args: [[null], {
            mode: 'immediate',
            transition: {duration: 0},
            frame: {duration: 0, redraw: false}
          }],
          label: 'Pause'
        }]
      }],
      sliders: [{
        pad: {l: 130, t: 55},
        currentvalue: {
          visible: true,
          prefix: 'Year:',
          xanchor: 'right',
          font: {size: 20}
        },
        steps: sliderSteps
      }]
    };
    // Create the plot
    Plotly.newPlot('myGraph', {
      data: traces,
      layout: layout,
      frames: frames,
    });
  });
}
function optionChanged(Test_ID){
  d3.json(samples).then(function (data) {
    console.log(Test_ID)
    updateAnimation(Test_ID);
  });
}

var summarydata;
  d3.json('static/data/all_vessels_summary.json').then(function(data) {
    summarydata = data;
    var years = [2012, 2013, 2014, 2015, 2016];
    select = document.getElementById("selYear");
    for (let i = 0; i < years.length; i++) {
      var opt = document.createElement("option");
      row = years[i];
      opt.value = row;
      opt.innerHTML = row;
      select.appendChild(opt);
    }
    yearChanged(2012);
  });

var vtype = [];
var numvessels = [];
var datapoints = [];
function yearChanged(selectedYear) {
  vtype = [];
  numvessels = []
  datapoints = []
  // Grab the summary data for the selected year
  // Loop through the array of data
  for (let i = 0; i < summarydata.length; i++) {
    row = summarydata[i];
    // Compare value to selected argument
    if (row.Year === Number(selectedYear)) {
      vtype.push(row['Vessel Type']);
      numvessels.push(row['Num of Vessels']);
      datapoints.push(row['Data Points']);
    }
  }

  d3.select("#title1").html(`${vtype[0]}`);
  d3.select("#title2").html(`${vtype[1]}`);
  d3.select("#title3").html(`${vtype[2]}`);
  d3.select("#title4").html(`${vtype[3]}`);
  d3.select("#title5").html(`${vtype[4]}`);
  d3.select("#v2").html(`Unique Vessels: ${numvessels[1]}<br>Total data points: ${datapoints[0]}`);
  d3.select("#v3").html(`Unique Vessels: ${numvessels[2]}<br>Total data points: ${datapoints[1]}`);
  d3.select("#v1").html(`Unique Vessels: ${numvessels[0]}<br>Total data points: ${datapoints[2]}`);
  d3.select("#v4").html(`Unique Vessels: ${numvessels[3]}<br>Total data points: ${datapoints[3]}`);
  d3.select("#v5").html(`Unique Vessels: ${numvessels[4]}<br>Total data points: ${datapoints[4]}`);
  
};