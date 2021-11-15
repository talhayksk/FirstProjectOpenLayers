var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var source = new ol.source.Vector({ wrapX: false });
var xml = new XMLHttpRequest();
var file = ('Files/ILLER.kml');
console.log(file)
var kml_layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: file,
        format: new ol.format.KML()
    }),
});
   // url: 'D:/Calismalarim/FirstProjectOpenLayers/FirstProjectOpenLayers/Files/ILLER.kml',
        // url: 'C:\Users/talha.yuksek/desktop/ILLER.kml',

var vector = new ol.layer.Vector({ source: source });

var map = new ol.Map({
    layers: [raster, vector, kml_layer],
    target: 'map',
    view: new ol.View({
        center: [33, 42],
        zoom: 6,
        projection: "EPSG:4326",
    })
});
