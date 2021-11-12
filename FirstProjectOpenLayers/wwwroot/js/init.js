
var _Panel;


var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var source = new ol.source.Vector({ wrapX: false });

var kapi_layer = new ol.layer.Vector({
    source: new ol.source.Vector()
});


var vector = new ol.layer.Vector({ source: source });


var map = new ol.Map({
    layers: [raster, vector, kapi_layer],
    target: 'map',
    view: new ol.View({
        center: [33, 42],
        zoom: 6,
        projection: "EPSG:4326",
    })
});
//burasý bize harita üzerinde point koymayý saðlayacak
var kapi;
function addKapiInteraction() {
    kapi = new ol.interaction.Draw({
        source: source,
        type: 'Point'
    });
    map.addInteraction(kapi);
    kapi.setActive(false);

}
function ActiveKapi() {
    kapi.setActive(true);
}
addKapiInteraction();
const typeSelect = document.getElementById('type');
let cizgi;
function addLineInteraction() {
    if (value !== 'none') {
        cizgi = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value,
            freehand: true,
        });
    }
    map.addLineInteraction(cizgi);

}
typeSelect.onchange = function () {
    map.removeInteraction(cizgi);
    addLineInteraction();
};
addLineInteraction();

kapi.on('drawend', function (e) {
    //point atýldýktan sonra yapýlacak iþler bu scope de yer almalý
    var currentFeature = e.feature;

    var _coords = currentFeature.getGeometry().getCoordinates();
    kapi.setActive(false);

    _Panel = jsPanel.create({
        id: "kapi_ekle_panel",
        theme: 'success',
        headerTitle: 'kapi ekle',
        position: 'center-top 0 58',
        contentSize: '300 250',
        content: 'No: <input id="kapi_no" type="text"/><br><br><br><button style="height:40px;width:60px" id="kapi_kaydet" class="btn btn-success">Ekle</button>',
        callback: function () {
            this.content.style.padding = '20px';
        }
    });
    var _no = $('#kapi_no').val();

    document.getElementById('kapi_kaydet').onclick = function () {
        console.log(_data)
        var _no = $('#kapi_no').val();
        var _data = {
            x: _coords[0].toString().replace('.', ','),
            y: _coords[1].toString().replace('.', ','),
            no: _no
        };
        console.log(_no)
        if (_no.length < 1) {

            alert("Kapý Numarasý Girmediniz");

            return;
        }
        //kapýnýn kordinatlarýný x ve y deðiþkenlerine attým
        $.ajax({
            type: "POST",
            url: "/Home/SavePoint",
            dataType: 'json',
            data: _data,
            success: function (message) {
                alert("Basariyla Eklendi");
                _Panel.close();
                kapi.setActive(false);
            },
            error: function () {
                alert("Hata Oluþtu");
            },
            onbeforeclose: function () {
                return onbeforeclose();
            },
        });
    }
});

