console.log ("Test Connection - Working");
 
// Creating an initial map
var myMap = L.map("map",{
    center:[38.00, -97.00],
    zoom: 3
})

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 25,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);


// Function for getting color based on the magnitudes 
function getColor(magnitude){
    switch(true){
        case (magnitude <= 1):
            return '#F4CCCC';
            break;
        case (magnitude <= 2):
            return '#EA9999';
            break;
        case (magnitude <= 3):
            return '#E06666';
            break;
        case (magnitude <= 4):
            return '#CC0000';
            break;
        case (magnitude <= 5):
            return '#990000';
            break;
        case (magnitude > 5):
            return '#660000';
            break;
        default:
            return '#F7F2F2';
            break;
    }
}
// Function for getting radius of circle based on the magnitudes
function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 6;
            break;
        case (magnitude <= 2):
            return 8;
            break;
        case (magnitude <= 3):
            return 10;
            break;
        case (magnitude <= 4):
            return 12;
            break;
        case (magnitude <= 5):
            return 14;
            break;
        case (magnitude > 5):
            return 16;
            break;
        default:
            return 2;
            break;
    }
}  


var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting data from USGS earthquake link 
d3.json(link).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag), // different radius for different magnitude
                fillColor: getColor(feature.properties.mag), // different circle colors for different magnitude
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);

  // Create a legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          mag = [0, 1, 2, 3, 4, 5]

      div.innerHTML += "<h4>Magnitude</h4><hr>"

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mag.length; i++) {
          div.innerHTML +=
              '<i style="background:'+getColor(mag[i]+1)+'"></i>'+mag[i]+(mag[i+1]?'&ndash;'+mag[i+1]+'<br>':'+');
      }
      return div;
  };
  legend.addTo(myMap);
});

// Legend Sources: 
// https://leafletjs.com/examples/choropleth/
// https://codepen.io/haakseth/pen/KQbjdO
