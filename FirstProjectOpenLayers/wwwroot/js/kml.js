var _panel, _panelx, _map, _activeLayer;
var _layers = [];
var raster = new ol.layer.Tile({
 
    source: new ol.source.XYZ({
        url: "http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        ,
        wrapX: false
    })
});
$('#kmlYukle').on('click', function () {

    (async () => {
        const { value: file } = await Swal.fire({
            title: 'Kml Dosyasi Sec',
            input: 'file',

            inputAttributes: {
                'accept': 'KML/*',
                'aria-label': 'Upload your Kml File',
                id: 'fileupload',
            }
        })
        console.log(file);
        //todo kml kullanýcadan okunacak sunucuya atýlmayacak
        if (file) {
            var url;
            let formData = new FormData();
            formData.append("file", file);
            await fetch('Home/SaveFile/', {
                method: "POST",
                body: formData
            });

            var layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                   url: 'Files/' + file.name,
                   // url: url,
                    format: new ol.format.KML(),
                    projection: 'EPSG:3857',
                }),
            })

            _map.addLayer(layer);
            _activeLayer = _map.getLayers();

            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Dosya Yuklendi!',
                showConfirmButton: false,
                timer: 1500
            })

        }

    })()


})
var source = new ol.source.Vector({ wrapX: false });

var vector = new ol.layer.Vector({
    source: source
});

_map = new ol.Map({
    // kml_layer
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([36.857143, 41.142857]),
        zoom: 6,
        projection: "EPSG:3857",//"EPSG:4326",
    }),
    controls: ol.control.defaults({
        attribution: false,
        zoom: false,
    }),
    interactions: ol.interaction.defaults({ doubleClickZoom: false }),

});

var extent = [2787835.089390983, 4145543.4083158798, 5087060.900209085, 5258466.540148046];
_map.getView().fit(extent, _map.getSize());

_map.on('click', function (evt) {
    _map.forEachLayerAtPixel(evt.pixel, function (layer) {
        _activeLayer = _map.getLayers();
    });
});
var format = new ol.format.GeoJSON();
var json = [], layers = [];
var geometryK;
const x = 0;
const y = 0;
var secilenler = [];
var drawend = function (event) {
    var features;// = [kml_layer.getSource().getFeatures()];
    features = [event.feature]
    var geometry = event.feature.getGeometry();
    var type = geometry.getType();

    if (type === "LineString" || type === "Polygon" || type === "Circle" || type === "Point") {
        var geojson1 = format.writeFeaturesObject([event.feature]);

        var extent = geometry.getExtent();

        source.forEachFeatureIntersectingExtent(extent, function (feature) {
            var geometry = feature.getGeometry();
            var type = geometry.getType();
            if (type === "LineString" || type === "Polygon" || type === "Circle" || type === "Point") {

            }
        });

        const layerCount = _map.getLayers().getArray().length;
        for (var i = 0; i < layerCount; i++) {

            if (i != 0 && i != 1) {
                var feat = _activeLayer.getArray()[i].getSource().getFeatures();
                $.each(feat, function (i, k) {
                    var geojson2 = format.writeFeaturesObject([k]);
                    geometryK = k.getGeometry();

                    var intersects = turf.booleanIntersects(geojson1, geojson2);

                    var plateNumber;
                    if (intersects == true) {
                        //var h = $('<textarea />').html(text).text();
                        try {
                            plateNumber = /<span class="atr-value">(\d+)<\/span>/mg.exec(k.getProperties().description)[1];
                        } catch (e) {
                            plateNumber = "YOK";
                        }
                        secilenler.push({
                            id: k.getId(), name: k.get('name'), extent: k, desc: plateNumber, obj: k, btn: `<input type='button' class="btn btn-warning" value='Goster' onclick="sehirDetay('` + k.getId() + `')" style='margin-right:5px;'></input>
                                                                                                   <input type='button' class="btn btn-info" value='Bilgi AL' onclick="bilgiAl( '` + k.getId() + `','` + k.get('name') + `','` + plateNumber + `')"></input>`
                        })

                    }
                })
            }
        }
        $(function () {
            $('#table').bootstrapTable({ data: secilenler, locale: 'tr', pagination: true })

        })
        _panel = jsPanel.create({
            id: "panel",
            theme: 'success',
            headerTitle: 'Secilen iller',
            position: 'center-top 10 58',
            panelSize: {
                width: () => { return Math.min(900, window.innerWidth * 0.9); },
                height: () => { return Math.min(600, window.innerHeight * 0.6); }
            },
            contentAjax: {
                url: 'Files/secilenler.html',
                done: (xhr, panel) => {
                    _panel.content.innerHTML = xhr.responseText;
                }
            },
            position: 'center 50 50',

            callback: function () {
                this.content.style.padding = '20px';
            },
            onclosed: function (panel, closedByUser) {
                let len = secilenler.length;
                secilenler.splice(0, len);
            }
        });
        switch (typeSelect) {
            case "Point":
                _drawPoint.setActive(false);
                break;
            case "LineString":
                _drawLine.setActive(false);
                break;
            case "Circle":
                _drawCircle.setActive(false);
                break;
            case "Polygon":
                _drawPolygon.setActive(false);
                break;
            default:
            // code block
        }
    }
};
var illerDetayListJson = [];
function sehirDetay(idx) {
    var sehir = secilenler.find(x => x.id == idx);
    var extent = sehir.extent.getGeometry().getExtent();
    _map.getView().fit(extent);
}
$(document).ready(function () {
    $.ajax({
        url: 'Files/ildetay.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $.each(data.data, function (i, item) {
                illerDetayListJson.push(item)
            });
        }
    });
});
function selectValue(value) {
    var sehir = _liste.find(x => x.tuik == value);
    var iljson = illerDetayListJson.find(x => x.plaka_kodu == sehir.tuik);
    var tuik = document.getElementById("tuikilkodu").value = sehir.tuik;
    var il = document.getElementById("il").value = sehir.il;
    var nufus = document.getElementById("nufus").value = iljson.nufus;
    var bolge = document.getElementById("bolge").value = iljson.bolge;
    var nokta = document.getElementById("merkezNoktasi").value = sehir.nokta;
}
function bilgiAl(id, name, tuikKodu) {
   // console.log(title);
    _panelx = jsPanel.create({
        id: "panelx",
        theme: 'success',
        headerTitle: id,
        position: 'center-top 0 150',
        width: 300,
        height: 300,
        contentAjax: {
            url: 'Files/SehirBilgi.html',
            done: (xhr, panel) => {
                _panelx.content.innerHTML = xhr.responseText;
                document.getElementById('il').value = name;
                document.getElementById('tuikkodu').value = tuikKodu;
                $('#kopyala').click(function () { kaydet(); });

            }
        },
        callback: function () {
            this.content.style.padding = '20px';
        }
    });
}
var _wkt;
function kaydet() {
    var tuik = document.getElementById("tuikkodu").value;
    var sehir = secilenler.find(x => x.desc == tuik);
    var wktfetures = sehir.obj;
    const wktformat = new ol.format.WKT();
    var plateNumber;
    var geo = wktfetures.getGeometry();
    try {
        plateNumber = tuik;
    } catch (e) {
        plateNumber = "Yok"
    }
    if (plateNumber == tuik) {
        var count = geo.getGeometries();
        for (let i = 0; i < count.length; i++) {
            if (geo.getGeometries()[i].getType() == 'Polygon') {
                console.log(geo.getGeometries()[i])
                _wkt = wktformat.writeGeometry(geo.getGeometries()[i]);
            }
        }
    }
    var il = document.getElementById("il").value;
    //----
    var iljson = illerDetayListJson.find(x => x.il_adi == il);
    var nufus = iljson.nufus;
    var bolge = iljson.bolge;
    var nokta = _wkt;//document.getElementById("merkezNoktasi").value = sehir.nokta;
    //-----
    var sehir = {id:1,il: il, tuikilkodu: tuik, bolge: bolge, nufus: nufus, merkezNoktasi: nokta }
    $.ajax({
        url: 'Home/SehirKaydet',
        data: sehir,
        // contentType: "application/json; charset=utf-8",
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Kaydedildi!',
                showConfirmButton: false,
                timer: 1500
            })
            _panelx.close()
        }
    });
}

var draw, snap;
var _drawLine, _drawPoint, _drawCircle, _drawPolygon;
$('#type').on('change', function () {
    
    typeSelect = $('#type').val();

    _drawPoint.setActive(false);
    _drawLine.setActive(false);
    _drawCircle.setActive(false);
    _drawPolygon.setActive(false);
   // addInteraction();
})
var typeSelect = $('#type').val();
function addInteraction() {
    if (typeSelect !== 'None') {
        if (typeSelect == 'Point') {
            _drawPoint = new ol.interaction.Draw({
                source: source,
                type: typeSelect
            });
            _drawPoint.setActive(true)

            _drawPoint.on('drawend', drawend);
            _map.addInteraction(_drawPoint);
        }
        if (typeSelect === "LineString") {
            _drawLine = new ol.interaction.Draw({
                source: source,
                type: typeSelect
            });
            _drawLine.setActive(true)

            _drawLine.on('drawend', drawend);
            _map.addInteraction(_drawLine);
        }
        if (typeSelect === "Circle") {
            _drawCircle = new ol.interaction.Draw({
                source: source,
                type: typeSelect
            });
            _drawCircle.setActive(true)

            _drawCircle.on('drawend', drawend);
            _map.addInteraction(_drawCircle);
        }
        if (typeSelect === "Polygon") {
            _drawPolygon = new ol.interaction.Draw({
                source: source,
                type: typeSelect
            });
            _drawPolygon.setActive(true)

            _drawPolygon.on('drawend', drawend);
            _map.addInteraction(_drawPolygon);

        }
 
    }
}
var cizBtn = document.getElementById("cizBtn");
$('#cizBtn').on('click', function () {
      addInteraction();
});
