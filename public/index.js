var app = angular.module("myApp", []);
app.controller("myCtr", async ($scope, $http, $window, $filter) => {
    $scope.errMessage1 = '';
    let cDate = await $http.get('https://odishaagrilicense.nic.in/acts/getCDAte');
    var curDate = new Date(cDate);//get new date
    $scope.toDate1 = curDate;//assign today date to to date 
    $scope.toDate2 = curDate;//assign today date to to date 

    $scope.searchLocation = function () {
        $scope.errMessage1 = '';
        if ($scope.fromDate1 == undefined) {
            $scope.errMessage1 = 'Please Enter The from Date.';
        } else {
            $scope.errMessage1 = '';
            if ($scope.toDate1 > curDate) {
                $scope.errMessage1 = "To date can't be greater than current date.";
            } else {
                $scope.errMessage1 = '';
                if ($scope.fromDate1 > $scope.toDate1) {
                    $scope.errMessage1 = "To date can't be less than from date.";
                } else {
                    alert("search query here")
                }
            }
        }
    }
    $scope.searchTravel = function () {
        $http.get('https://odishaagrilicense.nic.in/acts/getInfectedSourcesDateWise?mode=' + $scope.mode + "&fromDate=" + $scope.travelFromDate + "&toDate=" + $scope.travelToDate)
            .then( response => {
                $scope.infectedSources = response.data;
            })
    }
    $http.get('https://odishaagrilicense.nic.in/acts/getAllInfectedSources')
        .then( response => {
            $scope.infectedSources = response.data;
        });


    //First map showing active infection
    var map = L.map('map', {
        center: [20.265977, 85.819951],
        zoom: 15
     })
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(map);
    //Second map showing time line based infection
    var map_timeline = L.map('map1', {
        center: [20.2961, 85.8245],
        zoom: 15
     })
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(map_timeline);
     const layeryGroupMap = L.layerGroup().addTo(map);
     const layeryGroupMapTL = L.layerGroup().addTo(map_timeline);
    $scope.loadActiveDangerZone = async () => {
        let dangerZone = $http.get('https://odishaagrilicense.nic.in/acts/getActiveDangerZone');
        let warningZone = await $http.get('https://odishaagrilicense.nic.in/acts/getActiveWarningZone');
        let dangerZone1 = await dangerZone;
        $scope.dangerZone = dangerZone1.data;
        $scope.warningZone = warningZone.data;
        $scope.warningZoneTimeLine = $scope.warningZone;
        $scope.dangerZoneTimeLine = $scope.dangerZone;
        $scope.$apply()
        loadMap();
        loadMapTimeLine();
    }
    $scope.loadActiveDangerZone();
    $scope.loadDateWiseTimeLine = async (fromDate, toDate) => {
        $scope.warningZoneTimeLine = [];
        $scope.dangerZoneTimeLine = [];
        let dangerZone = $http.get('https://odishaagrilicense.nic.in/acts/getDateWiseDangerZoneTimeLineData?fromDate='+ fromDate+ '&toDate='+ toDate );
        let warningZone = await $http.get('https://odishaagrilicense.nic.in/acts/getDateWiseWarningZoneTimeLineData?fromDate='+ fromDate+ '&toDate='+ toDate );
        $scope.warningZoneTimeLine = warningZone.data;
        let dangerZone1 = await dangerZone;
        $scope.dangerZoneTimeLine = dangerZone1.data;
        loadMapTimeLine();
        $scope.$apply();        
    }
    function loadMap() {
        layeryGroupMap.clearLayers();
        $scope.dangerZone.forEach((el) => {
            let popupContent;
            if(el.caseNo == undefined){
                popupContent = `<b style='color:red;'>Danger area.</b><br>Mark: ${el.name} <br>From date: ${new Date(el.fromDate).toLocaleDateString()}<br>To date: ${new Date(el.toDate).toLocaleDateString()} <br>Message: ${el.desc}`;
            } else {
                popupContent = `<b style='color:red;'>Danger area.</b><br>Case no.: ${el.caseNo} <br><br>Mark: ${el.name} <br>From date: ${new Date(el.fromDate).toLocaleDateString()}<br>To date: ${new Date(el.toDate).toLocaleDateString()} <br>Message: ${el.desc}`;
            }
            
            L.circle([el.lat, el.lng], {
               radius: 50,
               fillOpacity: 0.6,
               color: 'red',
               className: 'pulse'
            }).addTo(layeryGroupMap)
               .bindPopup(popupContent);
         });
         $scope.warningZone.forEach(el => {
            let popupContent = `<b style='color:blue;'>Warning area.</b><br>Mark: ${el.name} <br>From date: ${new Date(el.fromDate).toLocaleDateString()}<br>To date: ${new Date(el.toDate).toLocaleDateString()} <br>Message: ${el.desc}`;
            L.circle([el.lat, el.lng], {
               radius: 50,
               fillOpacity: 0.6,
               color: '#bb58c5',
               className: 'pulse1'
            }).addTo(layeryGroupMap)
               .bindPopup(popupContent);
         });
     }
     function loadMapTimeLine() {        
        layeryGroupMapTL.clearLayers();
        $scope.dangerZoneTimeLine.forEach((el) => {
            let popupContent;
            if(el.caseNo == undefined){
                popupContent = `<b style='color:red;'>Danger area.</b><br>Mark: ${el.name} <br>From date: ${new Date(el.fromDate).toLocaleDateString()}<br>To date: ${new Date(el.toDate).toLocaleDateString()} <br>Message: ${el.desc}`;
            } else {
                popupContent = `<b style='color:red;'>Danger area.</b><br>Case no.: ${el.caseNo} <br><br>Mark: ${el.name} <br>From date: ${new Date(el.fromDate).toLocaleDateString()}<br>To date: ${new Date(el.toDate).toLocaleDateString()} <br>Message: ${el.desc}`;
            }
            L.circle([el.lat, el.lng], {
            radius: 50,
            fillOpacity: 0.6,
            color: 'red',
            className: 'pulse'
            }).addTo(layeryGroupMapTL)
            .bindPopup(popupContent);
        });
        $scope.warningZoneTimeLine.forEach(el => {
            let popupContent = `<b style='color:blue;'>Warning area.</b><br>Mark: ${el.name} <br>From date: ${new Date(el.fromDate).toLocaleDateString()}<br>To date: ${new Date(el.toDate).toLocaleDateString()} <br>Message: ${el.desc}`;
            L.circle([el.lat, el.lng], {
            radius: 50,
            fillOpacity: 0.6,
            color: '#bb58c5',
            className: 'pulse1'
            }).addTo(layeryGroupMapTL)
            .bindPopup(popupContent);
        });
     }


});
app.filter('convertDate', function () {
    return function (dateValue) {
        var newDate = new Date(dateValue).toLocaleDateString("en-US");
        return moment(newDate).format('DD-MM-YYYY');
    };
});
app.directive("allowNumbersOnly", function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9.]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});