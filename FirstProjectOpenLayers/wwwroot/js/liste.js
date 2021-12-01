var _liste = [];
var _panel;
var illerList = [];
var _wkt;
var cityOptions = [];
$('#listele').on('click', function () {
    $("#cbiller").empty();
    $.ajax({
        url: 'Home/GetListe',
        contentType: "application/json; charset=utf-8",
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            data.forEach(item => {
                _liste.push({
                    id: item.id, il: item.il, tuik: item.tuikilkodu, nokta: item.merkezNoktasi, bolge: item.bolge, nufus: item.nufus
                });
            })
            $(function dropdown() {
                //var drp = document.getElementById("cbiller");
                cityOptions = [];
                //var optn = document.createElement("OPTION");
                $.each(_liste, function (i, item) {
                    //  console.log(item);
                    //optn.text = item.il;
                    //optn.value = item.tuik;
                    console.log(item);
                    cityOptions.push({ text: item.il, value: item.tuik });
                    //drp.options.add(new Option(optn.text, optn.value));
                })

            })

            var id = $('#cbiller').val();

            _panel = jsPanel.create({
                id: "panel",
                theme: 'success',
                headerTitle: 'Secilen iller',
                position: 'center-top 10 58',
                panelSize: {
                    width: () => { return Math.min(600, window.innerWidth * 0.9); },
                    height: () => { return Math.min(500, window.innerHeight * 0.6); }
                },
                contentAjax: {
                    url: 'Files/SehirListe.html',
                    done: (xhr, panel) => {
                        _panel.content.innerHTML = xhr.responseText;
                        //Prism.highlightAll();
                    }
                },
                callback: function () {
                    this.content.style.padding = '20px';
                }
            });
        }
    })
})

var snap, _source;
$('#wktDuzenle').on('click', function () {
    wktGoster()
    const wkt = document.getElementById('merkezNoktasi').value;
    const wktformat = new ol.format.WKT();
    const wktfeature = wktformat.readFeature(wkt, {
        dataprojection: 'epsg:4326',
        featureprojection: 'epsg:3857',
    });
    draw.setActive(false);
    _panel.minimize();
    const modify = new ol.interaction.Modify({
        source: _source,
    });
    _map.addInteraction(modify);
    // _map.addInteraction(new ol.interaction().defaults.Extend([select, modify]));

    snap = new ol.interaction.Snap({ source: _source });

    _map.addInteraction(snap);

    $("#topMenuUl").append(`<li class="nav-item m-1">
            <button class='nav-link text-dark btn btn-warning' id ='duzenlemeBitir'  onclick = 'duzenlemeyiBitir();' >Düzenlemeyi Bitir</button >
                        </li >`);


})

function duzenlemeyiBitir() {
    const wktformat = new ol.format.WKT();
    var geo = _source.getFeatures()[0].getGeometry();

    _wkt = wktformat.writeGeometry(geo);
    //alert(_wkt)
    document.getElementById("merkezNoktasi").value = _wkt;
    $("#duzenlemeBitir").hide(100);
    $("#duzenlemeBitir").remove();

    _panel.normalize();
}
var _vector2;
$('#wktGoster').on('click', function () {
    const wkt = document.getElementById('merkezNoktasi').value;
    const wktformat = new ol.format.WKT();

    const wktfeature = wktformat.readFeature(wkt, {
        dataprojection: 'epsg:4326',
        featureprojection: 'epsg:4326',
    });

    const vector2 = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [wktfeature],
        }),
    });
    _vector2 = vector2;
    _source = vector2.getSource();
    _map.addLayer(vector2)
    _panel.smallify();
})

function wktAl() {
    //  .getGeometries()
    const wktfetures = _activeLayer.getSource().getFeatures();
    const wktformat = new ol.format.WKT();
    var tuik = document.getElementById("tuikilkodu").value;
    $.each(wktfetures, function (index, data) {
        
        var geo = data.getGeometry().getGeometries();
        var plateNumber = /<span class="atr-value">(\d+)<\/span>/mg.exec(data.values_.description)[1];
        if (plateNumber == tuik) {
            for (let i = 0; i < geo.length; i++) {
                if (geo[i].getType() == 'Polygon') {
                    console.log(geo[i])
                    _wkt = wktformat.writeGeometry(geo[i]);
                    //console.log(_wkt);
                }
            }
        }

        //console.log(data.getGeometry().getGeometries())

    })
    var merkezNoktasi = document.getElementById('merkezNoktasi').value = _wkt;
    // _wkt = wktformat.writeGeometry(wktfetures[58].getGeometry());

    const wktfeature = wktformat.readFeature(_wkt, {
        dataprojection: 'epsg:3857',
        featureprojection: 'epsg:3857',
    });

    //const vector2 = new ol.layer.Vector({
    //    source: new ol.source.Vector({
    //        features: [wktfeature],
    //    }),
    //});
    //_map.addLayer(vector2)
    Swal.fire({
        position: 'top',
        icon: 'info',
        title: document.getElementById('il').value+' Şehirnin Geometrisi\n'+'Alındı!',
        showConfirmButton: false,
        timer: 1500
    })

}
    $(document).ready(function () {
        $.ajax({
            url: 'Files/ildetay.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $.each(data.data, function (i, item) {
                    illerList.push(item)
                });
            }
        });
    });
var ilselect = $('#cbiller').val();
$('#cbiller').on('change', function () {
    const value = ilselect;
    var sehir = _liste.find(x => x.tuik == value);
     illerList.find(x => x.plaka_kodu == sehir.tuik);
   document.getElementById("tuikilkodu").value = sehir.tuik;
    var il = document.getElementById("il").value = sehir.il;
    document.getElementById("nufus").value = sehir.nufus;
    document.getElementById("bolge").value = sehir.bolge;
    document.getElementById("merkezNoktasi").value = sehir.nokta;
    _panel.headerTitle = il;


})

function selectValue(value) {
   
}
$('#wktSil').on('click', function () {
    var id = document.getElementById("tuikilkodu").value;
    $.ajax({
        url: 'Home/SehirDetaySil',
        data: {
            "id": id
        },
        // contentType: "application/json; charset=utf-8",
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    _panel.close()
                    Listele()
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })

        }
    });
})
$('#wktKaydet').on('click', function () {
    var tuik = document.getElementById("tuikilkodu").value;
    var il = document.getElementById("il").value;
    var nufus = document.getElementById("nufus").value;
    var bolge = document.getElementById("bolge").value;
    var nokta = document.getElementById("merkezNoktasi").value;
    var data = { tuikilkodu: tuik, il: il, nufus: nufus, bolge: bolge, merkezNoktasi: nokta };

    $.ajax({
        url: 'Home/SehirDetayKaydet',
        data: data,
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


        }
    });
})
$('#wktTemizle').on('click', function () {

    _map.removeLayer(_vector2);
})

let cbhandler = function (event) {

    let len = _liste.length;
    _liste.splice(0, len);

}

document.addEventListener('jspanelclosed', cbhandler, false);

let loadhandler = function (event) {

    $("#cbiller").ready(function () {
        console.log('hh')
        var drp = document.getElementById("cbiller");
        console.log(drp);

        _liste.forEach(x => {
            var optn = document.createElement("OPTION");
            optn.text = x.il;
            optn.value = x.tuik;
            drp.options.add(new Option(optn.text, optn.value));
        });

        $('#cbiller').on('change', function (event) {
            console.log(event);
            const value = ilselect;
            var sehir = _liste.find(x => x.tuik == event.target.value);
            console
            // illerList.find(x => x.plaka_kodu == sehir.tuik);
            document.getElementById("tuikilkodu").value = sehir.tuik;
            var il = document.getElementById("il").value = sehir.il;
            document.getElementById("nufus").value = sehir.nufus;
            document.getElementById("bolge").value = sehir.bolge;
            document.getElementById("merkezNoktasi").value = sehir.nokta;
            _panel.headerTitle = il;


        })
    });

    //setTimeout(
    //    function () {
    //        $(function () {
    //            console.log('hh')
    //            var drp = document.getElementById("cbiller");
    //            console.log(drp);

    //            _liste.forEach(x => {
    //                var optn = document.createElement("OPTION");
    //                optn.text = x.il;
    //                optn.value = x.tuik;
    //                drp.options.add(new Option(optn.text, optn.value));
    //            });

    //            $('#cbiller').on('change', function (event) {
    //                console.log(event);
    //                const value = ilselect;
    //                var sehir = _liste.find(x => x.tuik == event.target.value);
    //                console
    //               // illerList.find(x => x.plaka_kodu == sehir.tuik);
    //                document.getElementById("tuikilkodu").value = sehir.tuik;
    //                var il = document.getElementById("il").value = sehir.il;
    //                document.getElementById("nufus").value = sehir.nufus;
    //                document.getElementById("bolge").value = sehir.bolge;
    //                document.getElementById("merkezNoktasi").value = sehir.nokta;
    //                _panel.headerTitle = il;


    //            })
    //        })
    //    }, 2000);
    console.log('load');
    //drp.options.add(new Option(optn.text, optn.value));
}

// assign handler to event
document.addEventListener('jspanelloaded', loadhandler, false);
