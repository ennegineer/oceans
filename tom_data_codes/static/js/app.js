let samples = "data/numbers_captured_marine_fish.json"

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
