var app = angular.module("myApp", [])
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
});
app.controller("myCtrl", async ($scope, $http,Excel, $timeout) => {
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    $scope.allDataShow = function () {
        try {
            $http.get('http://localhost:7900/bloodDonation/userRoute/getDonorDetails?district=' + user_id)
                .then(response => {
                    $scope.indexDonorList = response.data;
                    angular.forEach(response.data, element => {

                        element.dob = new Date(Date.parse(element.dob) + 106199999)
                        if(element.lastdonationdate == null){
                            element.lastdonationdate=null;
                        }
                        else{
                            element.lastdonationdate = new Date(Date.parse(element.lastdonationdate)+ 106199999)
                        }
                     
                    })
                });


        } catch (e) {
            window.alert('Problem to add Try Again.')
        }
    }
    // $http.get('http://localhost:7900/bloodDonation/adminRoute/getDonorDetails')
    //     .then(response => {
    //         $scope.indexDonorList = response.data;
    //     })
    $scope.allDataShow();
    $scope.editField = (y) => {
        $scope.donerid = y;
        window.location.href = "http://localhost:7900/bloodDonation/user/addDonation?donerid=" + $scope.donerid;
    }
    // $scope.edit = function (y) {
    //     $scope.donerid = y;
    //     window.location.href = "http://localhost:7900/bloodDonation/admin/addDonation?donerid=" + $scope.donerid;

    // }
    $scope.view = function (y) {
        $scope.allDetails = y;
    }
    $scope.deleted = function (y) {
        $scope.allDetails = y;
    }
    $scope.deleteField = async (donerid) => {
        try {
            await $http.get('http://localhost:7900/bloodDonation/userRoute/donorDataDeleted?donerid=' + donerid);
            $scope.allDataShow();

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }
    // $scope.deleteField = (cmp) => {

    //     removeDonor(cmp.donorId);
    //     $http.get('http://localhost:7900/bloodDonation/getDonorDetails')
    //         .then(response => {
    //             $scope.indexDonorList = response.data;
    //         })
    // }
    $scope.viewDetails = (cmp) => {
        var url = "http://localhost:7900/viewDonationDetails.html?id=" + cmp.donorId;
        location.replace(url);
    }
    $scope.exportToExcel = function (tableIdSeed) {
        var exportHref = Excel.tableToExcel(tableIdSeed, 'donordetails');
        $timeout(function () { location.href = exportHref; }, 100); // trigger download
    }
});
function removeDonor(donid) {

    let data = {
        "condition": {
            "donorId": donid
        },
        "collectionName": "donorDetails"
    };
    var url = "http://localhost:7900/bloodDonation/removeMyDocument";
    postData(data, url);
}
function postData(data, url) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var response = xmlhttp.responseText;
                return response;

            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(data));
}
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
function CheckValdDonor($scope) {
    var rtnflag = 1;
    if ($scope.name == '' || $scope.name == null || $scope.name.textContent == '' || $scope.name.text == '' || String($scope.name).length < 4) {
        rtnflag = 0;
        $scope.showNameErrorMsg = "Please input name";
        $scope.showNameError = true;
    }
    else {
        var nm = $scope.name;
        if (!/^[a-zA-Z]*$/g.test(nm)) {
            rtnflag = 0;
            $scope.showNameErrorMsg = "Please input your name";
            $scope.showNameError = true;
        }
    }
    if ($scope.gender == '' || $scope.gender == null || $scope.gender.textContent == '' || $scope.gender.text == '') {
        rtnflag = 0;
        $scope.showGenderErrorMsg = "Please select Gender";
        $scope.showGenderError = true;
    }
    if ($scope.dob == '' || $scope.dob == null || $scope.dob.textContent == '' || $scope.dob.text == '') {
        rtnflag = 0;
        $scope.showDobErrorMsg = "Please enter your date of birth ";
        $scope.showDobError = true;
    }
    else {
        var dondob = new Date($scope.dob);
        var age = _calculateAge(dondob);
        if (parseInt(age) < 18) {
            rtnflag = 0;
            $scope.showDobErrorMsg = "Age should be greater than 18 ";
            $scope.showDobError = true;
        }
    }
    if ($scope.bg == '' || $scope.bg == null || $scope.bg.textContent == '' || $scope.bg.text == '') {
        rtnflag = 0;
        $scope.showBgErrorMsg = "Please select Your Blood Group";
        $scope.showBgError = true;
    }
    if ($scope.dist == '' || $scope.dist == null || $scope.dist.textContent == '' || $scope.dist.text == '') {
        rtnflag = 0;
        $scope.showdistErrorMsg = "Please select Your District";
        $scope.showdistError = true;
    }
    if ($scope.Address == '' || $scope.Address == null || $scope.Address.textContent == '' || $scope.Address.text == '') {
        rtnflag = 0;
        $scope.showAddressErrorMsg = "Please enter Your Address";
        $scope.showAddressError = true;
    }
    if ($scope.contactNo == '' || $scope.contactNo == null || $scope.contactNo.textContent == '' || $scope.contactNo.text == '' || String($scope.contactNo).length < 10) {
        rtnflag = 0;
        $scope.showcontactNoErrorMsg = "Please enter Your contact No.";
        $scope.showcontactNoError = true;
    }

    if ($scope.contactNo != '' || $scope.contactNo != null || $scope.contactNo.textContent != '' || $scope.contactNo.text != '') {

        if (String($scope.contactNo).length != 10) {
            rtnflag = 0;
            $scope.showcontactNoErrorMsg = "Please enter Your contact No. containing 10 digits";
            $scope.showcontactNoError = true;
        }

    }

    if ($scope.contactRef != '' || $scope.contactRef != null || $scope.contactRef.textContent != '' || $scope.contactRef.text != '') {

        if (String($scope.contactRef).length != 10) {
            rtnflag = 0;
            $scope.showcontactRefErrorMsg = "Please enter Your contact reference No. containing 10 digits";
            $scope.showcontactRefError = true;
        }

    }

    if ($scope.OrgCode == '' || $scope.OrgCode == null || $scope.OrgCode.textContent == '' || $scope.OrgCode.text == '' || String($scope.OrgCode).length < 4) {
        rtnflag = 0;
        $scope.showOrgCodeErrorMsg = "Please enter Organisation Code";
        $scope.showOrgCodeError = true;
    }
    if ($scope.status == '' || $scope.status == null || $scope.status.textContent == '' || $scope.status.text == '') {
        rtnflag = 0;
        $scope.showstatusErrorMsg = "Please enter Your contact No.";
        $scope.showstatusError = true;
    }
    return rtnflag;
}

function _calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}