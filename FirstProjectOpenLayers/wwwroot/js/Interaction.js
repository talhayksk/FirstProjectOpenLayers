////var _drawLine, _drawPoint, _drawCircle, _drawPolygon;

////function addInteractionPoint() {

////    if (typeSelect !== 'None') {
////        _drawPoint = new ol.interaction.Draw({
////            source: source,
////            type: typeSelect
////        });
////        _drawPoint.setActive(true);

////        _drawPoint.on('drawend', drawend);
////        _map.addInteraction(_drawPoint);
////        _drawPoint.setActive(false);

////    }
////}
////function addInteractionLine() {
////    if (typeSelect !== 'None') {
////        _drawLine = new ol.interaction.Draw({
////            source: source,
////            type: typeSelect
////        });
////        _drawLine.setActive(true);

////        _drawLine.on('drawend', drawend);
////        _map.addInteraction(_drawLine);
////        _drawLine.setActive(false);
////        console.log(_drawLine.setActive(false))

////    }
////}
////function addInteractionCircle() {
////    if (typeSelect !== 'None') {
////        _drawCircle = new ol.interaction.Draw({
////            source: source,
////            type: typeSelect
////        });
////        _drawCircle.on('drawend', drawend);
////        _map.addInteraction(_drawCircle);
////        _drawCircle.setActive(false);

////    }
////}
////function addInteractionPolygon() {
////    if (typeSelect !== 'None') {
////        _drawPolygon = new ol.interaction.Draw({
////            source: source,
////            type: typeSelect
////        });
////        _drawPolygon.on('drawend', drawend);
////        _map.addInteraction(_drawPolygon);
////        _drawPolygon.setActive(false);

////    }
////}