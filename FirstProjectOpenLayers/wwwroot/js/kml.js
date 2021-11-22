var _panel,_panelx,_file='ILLER.KML',_map;
var _layers = [];
var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});
_layers[0] = raster;
_layers[1] = vector;
function DosyaYukle() {
    (async () => {
        const { value: file } = await Swal.fire({
            title: 'Select Kml',
            input: 'file',
           
            inputAttributes: {
                'accept': 'KML/*',
                'aria-label': 'Upload your Kml File',
                 id: 'fileupload',
            }
        })
        console.log(file);
    
        if (file) {
         _file=file.name;
            let formData = new FormData();
            formData.append("file", file);
            await fetch('Home/SaveFile/', {
                method: "POST",
                body: formData
            });
      
          var layer=  new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: 'Files/' + _file,
                    format: new ol.format.KML(),
                    projection: 'EPSG:3857',
                }),
          })
            _map.addLayer(layer);
                
            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Dosya Yuklendi!',
                showConfirmButton: false,
                timer: 1500
            })
 
        }

    })()

}


var file = ('Files/' + _file);
var kml_layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: file,
        format: new ol.format.KML(),
        projection: 'EPSG:3857',
    }),
})
var index = _layers.length;
_layers[index + 1] = kml_layer;

var source = new ol.source.Vector({ wrapX: false });
var xml = new XMLHttpRequest();
//var file = ('Files/ILLER.kml');


var vector = new ol.layer.Vector({
    source: source
});

_map = new ol.Map({
     layers: [raster, vector, kml_layer],
  //  layers: _layers[],
    target: 'map',
    view: new ol.View({
        center: [36.857143, 41.142857],
        //center: [0, 0],
        zoom: 4,
        projection: "EPSG:3857",
    })
});

var typeSelect = document.getElementById('type');
var format = new ol.format.GeoJSON();
//var format = new ol.format.KML();
var json = [];
var geometryK;
const x = 0;
const y = 0;
var secilenler = [];
var drawend = function (event) {
    var features = [kml_layer.getSource().getFeatures()];
    console.log(features);
    //  var features = kml_layer.features;
    var geometry = event.feature.getGeometry();
    var type = geometry.getType();
    if (type === "LineString" || type === "Polygon") {
        var geojson1 = format.writeFeaturesObject([event.feature]);
        var extent = geometry.getExtent();
        console.log(extent);
        // features.forEach((item) => console.log(item.get("geometry").getExtent()))
        //forEach(item in features){
        //    console.log(item.get("geometry").getExtent())
        //}
        //  ff.forEach((item) => console.log(item.get('geometry').getExtent()))
        //  ff.forEach((item) => console.log(item.get('name')))
        source.forEachFeatureIntersectingExtent(extent, function (feature) {
            var geometry = feature.getGeometry();
            var type = geometry.getType();
            if (type === "LineString" || type === "Polygon") {
                /* var geojson2 = format.writeFeaturesObject([feature]);*/
                //var intersects = turf.lineIntersect(geojson1, geojson2);
                //var points = format.readFeatures(intersects);
                //source.addFeatures(points);
            }
        });
    
        $.each(kml_layer.getSource().getFeatures(), function (i, k) {
            var geojson2 = format.writeFeaturesObject([k]);
            geometryK = k.getGeometry();
            var intersects = turf.booleanIntersects(geojson1, geojson2);
            // console.log(intersects)
            if (intersects == true) {
                //var h = $('<textarea />').html(text).text();
                // console.log(k.values_.description);
                var plateNumber = /<span class="atr-value">(\d+)<\/span>/mg.exec(k.values_.description)[1];
                //console.log(k);
                //var el = $('<div>');
                //el.html(k.get('description'));
                //var text = $('li .atr-value', el).text;
                //el.html('</div>')
                secilenler.push({
                    id: k.getId(), name: k.get('name'), extent: k, desc: plateNumber, obj: k, btn: `<input type='button' class="btn btn-warning" value='Detay' onclick="sehirDetay('` + k.getId() + `')" style='margin-right:5px;'></input>
                                                                                                   <input type='button' class="btn btn-info" value='Bilgi AL' onclick="bilgiAl( '` + k.getId() + `','` + k.get('name') + `','` + plateNumber + `')"></input>`
                })

            }
        })
        json = JSON.stringify(secilenler);
        /*      JSON.parse(json);*/
        var content = `
           <table id='table' width='100%'
            data-toolbar='.toolbar'
            data-height='500'
            data-virtual-scroll='true'
            data-show-columns='true'
data-toggle="table"
                    >
             <thead>
                    <tr>
                         <th data-field='id'> id</th >
                         <th data-field='name'>name </th>
                         <th data-field='desc'> tuik il kodu</th>
                           <th data-field='btn'>islemler</th>
                      
                    </tr>
             </thead>
           </table>
`;

        $(function () {
            $('#table').bootstrapTable({ data: secilenler })
        
        })
        function operateFormatter(value,row,index) {
            
            return [
               `<button>sdf</button>`
                //`<a class="like" href="javascript:void(0)" title="Like">`+
                //`<i class="fa fa-heart"></i>`+
                //`</a> `+
                //`<a class="remove" href="javascript:void(0)" title="Remove">`+
                //`<i class="fa fa-trash"></i>`+
                //`</a>`
            ].join('');
     
        }
        //$(document).ready(function () {
        //    $('table').DataTable();
        //});
        _panel = jsPanel.create({
            id: "panel",
            theme: 'success',
            headerTitle: 'Secilen iller',
            position: 'center-top 10 58',
            panelSize: {
                width: () => { return Math.min(900, window.innerWidth * 0.9); },
                height: () => { return Math.min(600, window.innerHeight * 0.6); }
            },
            content: content,
            callback: function () {
                this.content.style.padding = '20px';

            }
        });
    }
};

function sehirDetay(idx) {
    //console.log(geometryK);
    //x = geometryK.getExtent()[0];
    //y = geometryK.getExtent()[3];

    //$('table tbody').on('click', 'tr', function (e) {
    //    var id = $(this).find('td').text();
    //    console.log(id)

    //})
    console.log(idx);
    console.log(secilenler);
    var sehir = secilenler.find(x => x.id == idx);
    console.log(sehir);
    var extent = sehir.extent.getGeometry().getExtent();
    map.getView().fit(extent);
}
function bilgiAl(id, name, tuikKodu) {
   // _panel.close()
    console.log('fds' + id, name, tuikKodu);
    const title = id;
    console.log(title);
    var cont = `<table>
         <tr>
         <td>iladi:</td>
         <td><input id='il' type='text' value='`+ name +`'  / ></td>
         </tr>
         <tr>
         <td>tuik il kodu:</td>
         <td><input id='tuikkodu' value='`+ tuikKodu +`' type='text'  / ></td>
         </tr>
         <tr>
         <td></td>
         <td style='text-align:right'><button id='kopyala' class='btn btn-success' onclick="kaydet()" type='sumbit'>Kopyala</button></td>
         </tr>
         </table>`;
    _panelx=  jsPanel.create({
        id: "panelx",
        theme: 'success',
        headerTitle: title,
        position: 'center-top 0 150',
        width: 300,
        height: 300,
    
        content: cont,
        callback: function () {
            this.content.style.padding = '20px';
        }
    });
    $(function () {
        document.getElementById('il').value =name;
        document.getElementById('tuikkodu').value = tuikKodu;
    })
    //document.getElementById("il").value = "asda";
    //document.getElementById("tuikkodu").value = tuikKodu
}
function kaydet() {
  var il=  document.getElementById("il").value ;
    var tuik = document.getElementById("tuikkodu").value;
    var sehir = { id:'',il: il, tuikilkodu: tuik }
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

var draw; // global so we can remove it later
function addInteraction() {
    var value = typeSelect.value;


    if (value !== 'None') {
        draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value
        });
        draw.on('drawend', drawend);
        _map.addInteraction(draw);

    }
}


/**
 * Handle change event.
 */
typeSelect.onchange = function () {


    _map.removeInteraction(draw);
    addInteraction();
};

addInteraction();

