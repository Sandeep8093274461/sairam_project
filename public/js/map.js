const map = L.map('map', {
    center: [20.2961, 85.8245],
    zoom: 15
})
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(map);
const layerGroup = L.layerGroup().addTo(map);
map.on('click', $scope.clickOnMap);
function loadMapData() {
    layerGroup.clearLayers();
    $scope.dangerZone.forEach(el => {
        let popupContent = `<b style='color:red;'>Danger area.</b><br>Mark: ${el.name} <br>Date: ${new Date(el.infectedDate).toLocaleDateString()} <br>Message: ${el.desc}`;
        L.circle([el.lat, el.lng], {
            radius: 50,
            fillOpacity: 1,
            color: 'red',
            className: 'pulse'
        }).addTo(layerGroup)
            .bindPopup(popupContent);
    });
}
$scope.searchLocation = () => {
    map.panTo(new L.LatLng($scope.latitude, $scope.longitude));
    L.circle([$scope.latitude, $scope.longitude], {
        radius: 50,
        fillOpacity: 1,
        color: 'red',
        className: 'pulse'
    }).addTo(map)
}