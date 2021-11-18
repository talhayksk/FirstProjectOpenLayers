var _panel;

var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var source = new ol.source.Vector({ wrapX: false });
var xml = new XMLHttpRequest();
var file = ('Files/ILLER.kml');
var kml_layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: file,
        format: new ol.format.KML(),
        projection: 'EPSG:3857',
    }),
});

var vector = new ol.layer.Vector({
    source: source
});

var map = new ol.Map({
    layers: [raster, vector, kml_layer],
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
        var secilenler = [];
        $.each(kml_layer.getSource().getFeatures(), function (i, k) {
            var geojson2 = format.writeFeaturesObject([k]);
            geometryK = k.getGeometry();
            var intersects = turf.booleanIntersects(geojson1, geojson2);
          // console.log(intersects)
            if (intersects == true) {
                //var h = $('<textarea />').html(text).text();
                console.log(k.values_.description);
                var plateNumber = /<span class="atr-value">(\d+)<\/span>/mg.exec(k.values_.description)[1];
                //console.log(k);
                //var el = $('<div>');
                //el.html(k.get('description'));
                //var text = $('li .atr-value', el).text;
                //el.html('</div>')
                secilenler.push({ id: k.getId(), name: k.get('name'), desc: plateNumber, obj: k })

            }
        })
        json = JSON.stringify(secilenler);
        /*      JSON.parse(json);*/
        var content = `
<div class='toolbar'>
  <button id='load' class='btn btn-secondary'>Load 10000 Rows</button>
  <button id='append' class='btn btn-secondary'>Append 10000 Rows</button>
  Total rows: <span id='total'></span>
</div>
           <table id='table' width='100%'
            data-toolbar='.toolbar'
            data-height='400'
            data-virtual-scroll='true'
            data-show-columns='true'
                    >
             <thead>
                    <tr>
                         <th data-field='id'> id</th >
                         <th data-field='name'>name </th>
                         <th data-field='desc'> desc</th>
                         <th> islemler</th>
                    </tr>
             </thead>
           </table>`;
        var $table = $('#table')
        var total = 0

        function getData(number, isAppend) {
            if (!isAppend) {
                total = 0
            }
            var data = []
            for (var i = total; i < total + number; i++) {
                data.push({
                    'id': secilenler[i].id,
                    'name': secilenler[i].name,
                    'desc': secilenler[i].desc
                })
            //    console.log("aasd"+data)
            }
            if (isAppend) {
                total += number
            } else {
                total = number
            }
            $('#total').text(total)
            return data
        }

        $(function () {
            console.log('Ne zaman');
            console.log(secilenler);
            $('#table').bootstrapTable({ data: secilenler })

            //$('#load').click(function () {
            //    $table.bootstrapTable('load', getData(10000))
            //})

            //$('#append').click(function () {
            //    $table.bootstrapTable('append', getData(10000, true))
            //})
        })
        //$.each(json)
    //    secilenler.forEach(item => {
    //        content += ` <tr>
    //                <td>`+ item.id + `</td>
    //                <td>`+ item.name + `</td>
    //                <td>`+ item.desc + `</td>
    //                <td><button onclick='sehirDetay();' class='detay' type='sumbit'style="border:0;border-radius:10px;padding:5px; margin-right:5px;" >detay</button>
    //                   <button class='bilgial'style="border:0;border-radius:10px;padding:5px; margin-right:5px;" type='sumbit' >bilgi Al</button>
    //                </td>

    //            </tr>`;
    //    });
    //    content += `</tbody>
    //</table> `;
    //    $(document).ready(function () {
    //        $('table').DataTable();
    //    });
        _panel = jsPanel.create({
            id: "panel",
            theme: 'success',
            headerTitle: 'Secilen iller',
            position: 'center-top 0 58',
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

function sehirDetay() {
    //console.log(geometryK);
    //x = geometryK.getExtent()[0];
    //y = geometryK.getExtent()[3];

    $('table tbody').on('click', 'tr', function (e) {
        var id = $(this).find('td').text();
        console.log(id)

    })
    const extent = geometryK.getExtent();
    map.getView().fit(extent);
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
        map.addInteraction(draw);

    }
}


/**
 * Handle change event.
 */
typeSelect.onchange = function () {


    map.removeInteraction(draw);
    addInteraction();
};

addInteraction();

