

const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});
const source = new ol.source.Vector({ wrapX: false });
var vector = new ol.layer.Vector({
    //source: new ol.source.Vector(),
    //source: source
    source: new ol.source.Vector({
        //url: 'D:/Calismalarim/FirstProjectOpenLayers/FirstProjectOpenLayers/Files/ILLER.kml',
        url:'C:\Users\talha.yuksek\desktop\ILLER.kml',
        url:'',
        format: new ol.format.KML()
    })
});

var cizgi_layer = new ol.layer.Vector({
    source: new ol.source.Vector()
});
const typeSelect = document.getElementById('type');

let draw,snap; // global so we can remove it later
function addInteraction() {
    const value = typeSelect.value;
    if (value !== 'None') {
        draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value,
            freehand: true,
        });
        map.addInteraction(draw);
     
    }
}


const map = new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
        center: [28.96, 41.03],
        zoom: 5,
    }),
});

typeSelect.onchange = function () {
    map.removeInteraction(draw);
    addInteraction();
};

function ActiveDraw() {
    draw.setActive(true);
    if (draw.setActive())
        draw.setActive(false)
}
addInteraction();
draw.on('drawend', function (e) {
    var currentFeature = e.feature;
    var _coords = currentFeature.getGeometry().getCoordinates();
    console.log(_coords);
    console.log(_coords.lenght);
  
   // etkilesim.setActive(false);

});