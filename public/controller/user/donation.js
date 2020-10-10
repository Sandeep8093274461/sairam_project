// JavaScript source code
var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {
    $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
        .then(response => {
            $scope.districtList = response.data;
            $http.get('http://localhost:7900/bloodDonation/getDonorDetails')
                .then(responsed => {
                    $scope.donorList = responsed.data;
                })
        })
    $scope.retriveDonorDetails = async () => {
        
        $http.get('http://localhost:7900/bloodDonation/getDonorById/' + parseInt($scope.donorSelect))
            .then(response1 => {
                var resCm = response1.data;
                $scope.name = resCm[0].name;
                $scope.gender = resCm[0].gender;
                $scope.dob = new Date(resCm[0].dateOfBirth);
                $scope.bg = resCm[0].bloodGroup;
                $scope.lastDonationDate = new Date(resCm[0].lastDonationDate);
                $scope.dist = resCm[0].district;               
                $scope.status = resCm[0].status;
                $scope.donorid = resCm[0].donorId;               
            }) 
    }
    $scope.donationDetails = async () => {
        $scope.showDonorError = false;
        $scope.showdonationDateError = false;
        $scope.showplaceOfDonationError = false;
        $scope.showdistrictError = false;

        var valFlag = CheckValdDonation($scope);
        if (parseInt(valFlag) == 1) {
            let data = {
                donationDate: $scope.donationDate,
                currentPlace: $scope.placeOfDonation,
                currentDistrict: $scope.district,
                donorId: parseInt(parseInt($scope.donorSelect))
            };
            let dataupdate = {
                "condition": { "donorId": parseInt(parseInt($scope.donorSelect)) },
                "newValue": {
                    "lastDonationDate": $scope.donationDate
                },
                "collectionName": "donorDetails"
            };
            try {
                await $http.post('http://localhost:7900/bloodDonation/addDonoationDetails', { data: data });
                await $http.post('http://localhost:7900/bloodDonation/changeMyUpdates1', { data: dataupdate });
                window.alert(`Donation is added successfully.`);
                window.location.href = 'detailsDonation.html'
            } catch (e) {
                window.alert('Problem to add Try Again.')
            }
        }
        
        
    }
});

//cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function logout() {
    var url = "http://localhost:7900/bloodDonation/admin/logout";


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                location.replace("/");
            } else if (xmlhttp.status == 400) {
                window.alert('there was an error 400');
            } else {
                window.alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send();

}
function unchk() {
    if (getCookie('un') == null) {
        location.replace("login.html");
    }
}

function CheckValdDonation($scope) {
    var rtnflag = 1;
    
    if ($scope.donorSelect == '' || $scope.donorSelect == null || $scope.donorSelect.textContent == '' || $scope.donorSelect.text == '') {
        rtnflag = 0;
        $scope.showDonorErrorMsg = "Please select Donor";
        $scope.showDonorError = true;
    }
    if ($scope.donationDate == '' || $scope.donationDate == null || $scope.donationDate.textContent == '' || $scope.donationDate.text == '') {
        rtnflag = 0;
        $scope.showdonationDateErrorMsg = "Please select donation date";
        $scope.showdonationDateError = true;
    }
    if ($scope.placeOfDonation == '' || $scope.placeOfDonation == null || $scope.placeOfDonation.textContent == '' || $scope.placeOfDonation.text == '') {
        rtnflag = 0;
        $scope.showplaceOfDonationErrorMsg = "Please select place of donation";
        $scope.showplaceOfDonationError = true;
    }
    if ($scope.district == '' || $scope.district == null || $scope.district.textContent == '' || $scope.district.text == '') {
        rtnflag = 0;
        $scope.showdistrictErrorMsg = "Please select district of donation";
        $scope.showdistrictError = true;
    }
    return rtnflag;
}
