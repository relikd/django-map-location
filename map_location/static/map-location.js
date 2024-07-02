function MapLocationInit(mapId, options = {}) {
    const valField = document.getElementById(mapId + '_value');
    const theMap = document.getElementById(mapId + '_map');
    const btnAction = document.getElementById(mapId + '_btn');
    const display = document.getElementById(mapId + '_disp');

    function isZero(latlng) {
        return latlng.lat === 0 && latlng.lng === 0;
    }

    function asString(latlng) {
        if (isZero(latlng)) { return ''; }
        const pos = latlng.wrap();
        return pos.lat.toFixed(6) + ',' + pos.lng.toFixed(6);
    }

    const osm = L.tileLayer(options.tileLayer || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options.tileOptions);
    const map = L.map(mapId + '_map', {
        layers: [osm],
        center: [20, -25],
        zoom: 2,
        ...(options.map || {})
    });
    L.control.locate({ showPopup: false, ...(options.locate || {}) }).addTo(map);

    function loadPos() {
        if (!valField.value) {
            return [0, 0];
        } else {
            return valField.value.split(',');
        }
    }
    const marker = L.marker(loadPos(), { draggable: true });
    marker.on('move', function (e) {
        valField.value = asString(e.latlng);
        updatePrint();
    });
    map.on('click', function (e) {
        if (isZero(marker.getLatLng())) {
            marker.setLatLng(e.latlng);
            setMapState(false);
        }
    });
    btnAction.onclick = function () {
        const isReset = !!btnAction.dataset.reset;
        marker.setLatLng(isReset ? [0, 0] : map.getCenter());
        setMapState(isReset ? true : false);
        return false;
    };

    function setMapState(initial) {
        theMap.style.cursor = initial ? 'crosshair' : null;
        initial ? marker.remove() : marker.addTo(map);
        btnAction.dataset.reset = initial ? '' : '1';
        btnAction.innerText = initial ? 'Set center' : 'Reset';
    }

    function updatePrint() {
        const prefix = valField.value
            ? ('pin: ' + valField.value)
            : ('center: ' + asString(map.getCenter()));
        display.innerText = prefix + ' zoom: ' + map.getZoom();
    }
    map.on('zoomend', updatePrint);
    map.on('move', updatePrint);

    setMapState(isZero(marker.getLatLng()));
    updatePrint();

    if (valField.value) {
        map.setView(valField.value.split(','), options.markerZoom || 18);
    }
    // re-center map
    setTimeout(() => map.invalidateSize(), 300);
}
