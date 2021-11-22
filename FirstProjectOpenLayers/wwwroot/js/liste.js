var _liste = [];
var _panel;
var illerjson = [];
function Listele() {

    $.ajax({
        url: 'Home/GetListe',
        contentType: "application/json; charset=utf-8",
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            data.forEach(item => {
                _liste.push({
                    id: item.id, il: item.il, tuik: item.tuikilkodu
                });
            })


            var content = `
   <select class="form-control" id="cbiller" name="cbiller" onchange="selectValue(this.value);" style="margin-bottom:20px;">
<option value="sec">İl Seçiniz</option>
      </select>
        <form>
            <table class="form-group " style="margin-bottom:20px;">
            <tr>
                <td>Tuik Kodu:</td>
                <td><input type="text" id="tuikilkodu" name="tuikilkodu" class="form-control"/></td>

            </tr>
                 <tr>
                <td>il:</td>
                <td><input type="text" id="il"   name="il" class="form-control"/></td>

            </tr>
                <tr>
                <td>nufus:</td>
                <td><input type="text" id="nufus" name="nufus" class="form-control"/></td>

            </tr>
                <tr>
                <td>Bölgesi:</td>
                <td><input type="text" id="bolge" name="bolge" class="form-control"/></td>

            </tr>
               <tr>
                <td>MerkezNoktası:</td>
                <td><input type="text" id="merkezNoktasi" name="merkezNoktasi" class="form-control"/></td>

            </tr>
            </table>
      

</div>
<div class="text-right m-2">
<input type='button' class="btn btn-primary" value='Merkez Nokta Bul' onclick="" style='margin-right:5px;'></input>
<input type='button' class="btn btn-danger" value='Sil' onclick="listSil();" style='margin-right:5px;'></input>
<input type='summit' class="btn btn-success" value='Kaydet' onclick="ListKaydet();" style='margin-right:5px;'></input>
</div>
  </from>
`;
            $(function dropdown() {
                var drp = document.getElementById("cbiller");
                var optn = document.createElement("OPTION");
                $.each(_liste, function (i, item) {
                  //  console.log(item);
                    optn.text = item.il;
                    optn.value = item.tuik;
                    drp.options.add(new Option(optn.text, optn.value));
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
                content: content,
                callback: function () {
                    this.content.style.padding = '20px';

                }
            });
        }
    })
}
function selectValue(value) {
 //  document.getElementById('tuikkodu').value = tuikKodu;

    $(document).ready(function () {
        $.ajax({
            url: 'Files/ildetay.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
              //  console.log(data)
               // illerjson.push(data[0].data)
                illerjson = []

                $.each(data, function (i, item) {
                    illerjson.push(item)
                });
            }
        });
    });
    console.log(illerjson);
    var sehir = _liste.find(x => x.tuik == value);
    var iljson = illerjson[0].find(x => x.plaka_kodu == value);
    console.log(iljson)
    var tuik = document.getElementById("tuikilkodu").value = sehir.tuik;
    var il = document.getElementById("il").value = sehir.il;
    var nufus = document.getElementById("nufus").value = iljson.nufus;
    var bolge = document.getElementById("bolge").value = iljson.bolge;
    var nokta = document.getElementById("merkezNoktasi");
   
}
function ListKaydet() {
    var tuik = document.getElementById("tuikilkodu").value ;
    var il = document.getElementById("il").value  ;
    var nufus = document.getElementById("nufus").value ;
    var bolge = document.getElementById("bolge").value;
    var nokta = document.getElementById("merkezNoktasi").value;
    var data = { tuikilkodu: tuik, il: il, nufus: nufus, bolge: bolge, nokta: nokta };
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
}
function listSil() {
    var id = document.getElementById("tuikilkodu").value;
    $.ajax({
        url: 'Home/SehirDetaySil',
        data: {
            "id": id
        } ,
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
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })

        }
    });
}
