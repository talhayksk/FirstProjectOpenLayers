
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
//buras� bize harita �zerinde point koymay� sa�layacak
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
    //point at�ld�ktan sonra yap�lacak i�ler bu scope de yer almal�
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

            alert("Kap� Numaras� Girmediniz");

            return;
        }
        //kap�n�n kordinatlar�n� x ve y de�i�kenlerine att�m
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
                alert("Hata Olu�tu");
            },
            onbeforeclose: function () {
                return onbeforeclose();
            },
        });
    }
});

