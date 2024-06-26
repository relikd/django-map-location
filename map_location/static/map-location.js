function MapLocationInit(mapId, options = {}) {
    const valField = document.getElementById(mapId + '_value');
    const theMap = document.getElementById(mapId + '_map');
    const resetButton = document.getElementById(mapId + '_reset');

    function isZero(latlng) {
        return latlng.lat === 0 && latlng.lng === 0;
    }

    const osm = L.tileLayer(options.tileLayer || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options.tileOptions);
    const map = L.map(mapId + '_map', {
        layers: [osm],
        center: [20, -25],
        zoom: 2,
        ...(options.map || {})
    });
    L.control.locate({
        returnToPrevBounds: true,
        showPopup: false,
    }).addTo(map);

    function loadPos() {
        if (!valField.value) {
            return [0, 0];
        } else {
            return valField.value.split(',');
        }
    }
    const marker = L.marker(loadPos(), { draggable: true }).addTo(map);
    marker.on('move', function (e) {
        const pos = map.wrapLatLng(e.latlng);
        const flag = isZero(pos);
        valField.value = flag ? null : pos.lat.toFixed(6) + ',' + pos.lng.toFixed(6);
    });
    map.on('click', function (e) {
        if (isZero(marker.getLatLng())) {
            marker.setLatLng(e.latlng);
            setMapState(false);
        }
    });
    resetButton.onclick = function () {
        marker.setLatLng([0, 0]);
        setMapState(true);
        return false;
    };

    function setMapState(initial) {
        theMap.style.cursor = initial ? 'crosshair' : null;
        marker.setOpacity(initial ? 0 : 1);
    }

    if (isZero(marker.getLatLng())) {
        setMapState(true);
    } else {
        map.setView(valField.value.split(','), options.markerZoom || 18);
    }
    // re-center map
    setTimeout(() => map.invalidateSize(), 300);
}
