var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson"


var TectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


d3.json(earthquakeURL, function(data) {

    createFeatures(data.features); 

});


function createFeatures(earthquakeData) {

  var earthquakes = L.geoJson(earthquakeData, {

    onEachFeature: function (feature, layer){

      layer.bindPopup("<h5>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +

      "</h5><p>" + new Date(feature.properties.time) + "</p>");

    },

    pointToLayer: function (feature, latlng) {

      return new L.circle(latlng,

        {radius: getRadiusmarker(feature.properties.mag),

          fillColor: getColor(feature.properties.mag),

          color: "#000",

          weight: .5,

          fillOpacity: .5,

          stroke: true

      })

    }

  });

  createMap(earthquakes) 

}





function createMap(earthquakes) {


  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +

    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");

  var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +

    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +

    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");




  var baseMaps = {

    "Satellite Map": satelliteMap,

    "Outdoor Map": outdoorMap,

    "Light Map": lightMap

  };


  var tectonicPlates = new L.LayerGroup();

  var overlayMaps = {

    Earthquakes: earthquakes,

    "Tectonic Plates": tectonicPlates

  };



  var myMap = L.map("map", {

    center: [41.881832, -87.62317],

    zoom: 2.5,

    layers: [lightMap, earthquakes, tectonicPlates]

  });





   d3.json(TectonicPlatesURL, function(plateData) {


     L.geoJson(plateData, {

       color: "blue",

       weight: 2

     })

     .addTo(tectonicPlates);

   });



  L.control.layers(baseMaps, overlayMaps, {

    collapsed: false

  }).addTo(myMap);



  var legend = L.control({position: 'topright'});



  legend.onAdd = function (myMap) {



    var div = L.DomUtil.create('div', 'info legend'),

              grades = [0, 1, 2, 3, 4, 5],

              labels = [];


    for (var i = 0; i < grades.length; i++) {

        div.innerHTML +=

            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +

            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

    }

    return div;

  };

  legend.addTo(myMap);

}



function getColor(d) {

  return d > 5 ? '#F30' :

  d > 4  ? '#F60' :

  d > 3  ? '#F90' :

  d > 2  ? '#FC0' :

  d > 1   ? '#FF0' :

            '#9F3';

}



function getRadius(value){

  return value*40000

}