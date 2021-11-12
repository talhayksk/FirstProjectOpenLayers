const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const source = new ol.layer.Vector({ wrapX: false });

var vector = new ol.layer.Vector({
  source: new ol.source.Vector()
  //  source: source

});

var cizgi_layer = new ol.layer.Vector({
    source: new ol.source.Vector()
});
const typeSelect = document.getElementById('type');

let draw; // global so we can remove it later
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
    layers: [raster, vector, cizgi_layer],
    target: 'map',
    view: new ol.View({
        center: [10, 10],
        zoom: 5,
    }),
});

typeSelect.onchange = function () {
    map.removeInteraction(draw);
    addInteraction();
};

addInteraction();
