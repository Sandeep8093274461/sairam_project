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
app.controller("myCtrl", async ($scope, $http, Excel, $timeout) => {

    $scope.showAllList = false;
    $scope.totalNfp = 0;
    $scope.totalNfk = 0;
    $scope.totalOtherItems = 0;
    $scope.totalNosdi = 0;
    $scope.totalAppCost = 0;

    var un = getCookie('un');
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    // $scope.changePassword = async () => {
    //     if($scope.newPassword === $scope.reEnterPassword) {
    //         try{
    //             await $http.post('http://localhost:7900/bloodDonation/changePassword/', { user_id:  $scope.user_id, oldPass: $scope.oldPassword, newPass: $scope.newPassword})
    //             window.alert('Your password chaned succesfully.');
    //             window.location.replace('http://localhost:7900/bloodDonation/admin/convenorDetails');
    //         } catch(e) {
    //             window.alert(e.data);
    //             console.error(e.data);
    //         }
    //     } else{
    //         $scope.oldPassword = '';
    //         $scope.newPassword = '';
    //         $scope.reEnterPassword = '';
    //         window.alert('Wrong password. please re-enter password.')
    //     }
    // } 
    $http.get('http://localhost:7900/bloodDonation/userRoute/getConvenordatadistdistinct')
        .then(response => {
            $scope.districtList = response.data;
        });
    $scope.getFilteredData = async () => {
        $scope.totalNfp = 0;
        $scope.totalNfk = 0;
        $scope.totalOtherItems = 0;
        $scope.totalNosdi = 0;
        $scope.totalAppCost = 0;
        $http.post('http://localhost:7900/bloodDonation/userRoute/getFilteredConvenorData', { dist_id: $scope.dist, fromDate: $scope.fromDate, toDate: $scope.toDate })
            .then(response => {
                $scope.indexConvenorList = response.data;
                $scope.showAllList = true;
                $scope.indexConvenorList.forEach(e => {
                    $scope.totalNfp = $scope.totalNfp + parseInt(e.nfp);
                    $scope.totalNfk = $scope.totalNfk + parseInt(e.nfk);
                    $scope.totalOtherItems = $scope.totalOtherItems + parseInt(e.other_items);
                    $scope.totalNosdi = $scope.totalNosdi + parseInt(e.nosdi);
                    $scope.totalAppCost = $scope.totalAppCost + parseInt(e.app_cost);
                })
            })
    }
    $scope.viewPic = (url) => {
        $scope.viewPicUrl = '../.' + url;
    }
    $scope.editField = (cmp) => {
        var url = "http://localhost:7900/ConvenorDetails.html?id=" + cmp.convId;
        location.replace(url);
    }
    $scope.deleteField = (cmp) => {
        removeCamp(cmp.convId);
        $http.get('http://localhost:7900/bloodDonation/userRoute/getConvenorDetails/' + un)
            .then(response => {
                $scope.indexConvenorList = response.data;
            })
    }
    $scope.selectRemoveItem = (x) => {
        $scope.removeItem = x;
    }
    $scope.removeSevaData = async () => {
        let response = await $http.post('http://localhost:7900/bloodDonation/userRoute/removeSevaData/' + $scope.removeItem.conv_id)
        if (response.data) {
            $scope.getFilteredData();
            window.alert('Convenor removed successfully.');
        } else {
            window.alert('Sorry enable to remove that convenor. Please try again.');
        }
    }
    $scope.exportToExcel = function (tableIdSeed) {
        var exportHref = Excel.tableToExcel(tableIdSeed, 'adoReportSeed');
        $timeout(function () { location.href = exportHref; }, 100); // trigger download
    }

});

app.filter('dateRangeFrom', function () {
    return function (alldata, fromDateFilter) {
        var filtered = [];
        if (fromDateFilter != undefined) {
            angular.forEach(alldata, y => {
                if (Date.parse(y.dataapplied) >= Date.parse(fromDateFilter)) {
                    filtered.push(y);
                }
            });
            return filtered;
        } else {
            return alldata;
        }
    };
});
app.filter('dateRangeTo', function () {
    return function (alldata, toDateFilter) {
        var filtered = [];
        if (toDateFilter != undefined) {
            angular.forEach(alldata, function (y) {
                if (Date.parse(y.dataapplied) <= Date.parse(toDateFilter)) {
                    filtered.push(y);
                }
            });
            return filtered;
        } else {
            return alldata;
        }
    };
});
function removeCamp(convId) {
    let data = {
        "condition": {
            "convId": convId
        },
        "collectionName": "ConvenorDetails"
    };
    var url = "http://localhost:7900/bloodDonation/userRoute/removeMyDocumentDB";
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



function validate() {
    var name = document.getElementById('name');
    var phone = document.forms["bloodCamp"]["contactNo"];
    var phone1 = document.getElementById('contactRef');
    var dob = document.getElementById('dob').value;
    var inpdt = new Date(dob);
    var today = new Date();
    var Difference_In_Time = today.getTime() - inpdt.getTime();
    var age = new Date(Difference_In_Time);
    var age_dt = Math.abs(age.getUTCFullYear() - 1970);

    if (name.value == "") {
        window.alert("Please enter your name.");
        name.focus();
        return false;
    }
    else if (isNaN(name.value) /*"%d[10]"*/) {
        alert("name confirmed");
    }
    else {
        window.alert("please enter character in name");
        name.focus();
        name.value = "";
        return false;
    }
    if (phone.value == "") {
        window.alert("Please enter your telephone number.");
        phone.focus();
        return false;
    }
    else if (phone.value.match(/^\d{10}$/)) {
        alert("number confirmed");
    }
    else {
        window.alert("please enter valid numbers only");
        return false;
    }
    if (phone1.value == "") {
        window.alert("Please enter your telephone number.");
        phone.focus();
        return false;
    }
    else if (phone1.value.match(/^\d{10}$/)) {
        alert("number confirmed");
    }
    else {
        window.alert("please enter valid numbers only");
        return false;
    }
    if (age_dt >= 18) {
        alert("confirmed");
    }
    else {
        window.alert("you are not eligible for donate blood");
        return false;
    }

    return true;
}

function binddist() {
    var url = "http://localhost:7900/bloodDonation/userRoute/getConvenordatadistdistinct";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var array = xmlhttp.responseText;

                var option = '<option value="0">-- select --</option>';
                for (index = 0; index < JSON.parse(array).length; index++) {
                    option += '<option value="' + JSON.parse(array)[index].districtName + '">' + JSON.parse(array)[index].districtName + '</option>';
                }

                $('#district').append(option);
                $('#cDistrict').append(option);
                if (getCookie('un') != "ADMIN") {
                    document.getElementById("district").value = getCookie('un');
                    $('#district').attr("disabled", true);
                    document.getElementById("cDistrict").value = getCookie('un');

                    $('#cDistrict').attr("disabled", true);

                }


            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("GET", url, true);

    xmlhttp.send();
}

function bindDonationHistoryGrid() {
    unchk();

    var qs = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    if (qs["id"] != null) {
        //qs["id"]
        alert(qs["id"]);
        var url = "http://localhost:7900/bloodDonation/userRoute/getDonationById/" + qs["id"];

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {

                    var array = xmlhttp.responseText;


                    var data = JSON.parse(xmlhttp.responseText);
                    for (var i = 0, len = data.length; i < len; i++) {
                        tr = $('<tr/>');
                        tr.append("<td>" + data[i].donorId + "</td>");
                        //tr.append("<td>" + data[i].donationDate + "</td>");
                        tr.append("<td>" + data[i].currentPlace + "</td>");
                        tr.append("<td>" + data[i].currentDistrict + "</td>");
                        $('tbody').append(tr);
                    }

                } else if (xmlhttp.status == 400) {
                    alert('there was an error 400');
                } else {
                    alert('something else other than 200 was returned');
                }
            }
        };
        xmlhttp.open("GET", url, true);

        xmlhttp.send();
    }
}

function viewFilterData() {

    let data1 = {
        "bloodGroup": document.getElementById('bloodGroup').value
    };
    var url = "http://localhost:7900/bloodDonation/userRoute/getDonorFilterList";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var data = JSON.parse(xmlhttp.responseText);

                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i] != null) {
                        tr = $('<tr/>');
                        tr.append("<td>" + data[i].donorId + "</td>");
                        tr.append("<td>" + data[i].name + "</td>");
                        tr.append("<td>" + data[i].gender + "</td>");
                        tr.append("<td>" + data[i].dateOfBirth + "</td>");
                        tr.append("<td>" + data[i].bloodGroup + "</td>");
                        tr.append("<td>" + data[i].lastDonationDate + "</td>");
                        tr.append("<td>" + data[i].district + "</td>");
                        tr.append("<td>" + data[i].Address + "</td>");
                        tr.append("<td>" + data[i].orgCode + "</td>");
                        $('tbody').append(tr);
                    }

                }
                inittable(arrayReturn);

            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(data1));
}




function userValidate(userId, myPassword) {
    let data = {
        "userdetails": {
            "username": userId,
            "password": myPassword
        }
    };
    var url = "http://localhost:7900/bloodDonation/userRoute/validateUserLogin";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var response = xmlhttp.responseText;
                if (response != null) {


                    var datares = JSON.parse(response);
                    if (datares.length > 0) {
                        if (datares[0].validated != null) {
                            if (datares[0].validated == "1") {
                                setCookie('un', userId, 1);
                                location.replace("ConvenorData.html");
                            }
                            else {
                                window.alert('Please enter correct username password');
                            }
                        }
                        else {
                            window.alert('Please enter correct username password');
                        }
                    }
                    else {
                        window.alert('Please enter correct username password');
                    }

                }
                else {
                    window.alert('Please enter correct username password');
                }

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
    var url = "http://localhost:7900/bloodDonation/user/logout";


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

function CheckValdCamp($scope) {
    var rtnflag = 1;
    if ($scope.OrgCode == '' || $scope.OrgCode == null || $scope.OrgCode.textContent == '' || $scope.OrgCode.text == '' || $scope.OrgCode.length < 4) {
        rtnflag = 0;
        $scope.showOrgCode = "Please input valud Organisation Code";
        $scope.showOrgCodeError = true;
    }

    return rtnflag;
}