var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {
    $scope.campid = campid;
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    var imglink;
    $http.get('http://localhost:7900/bloodDonation/userRoute/getConvenordatadistdistinct')
        .then(response => {
            $scope.districtList = response.data;
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

            if (campid != '') {
                $http.get("http://localhost:7900/bloodDonation/userRoute/getCampById?campid=" + $scope.campid)
                    .then(function (response1) {
                        // $http.get('http://localhost:7900/bloodDonation/getCampById/' + qs["id"])
                        //     .then(response1 => {
                        $scope.details = response1.data[0];
                        $scope.cmpPlace = $scope.details.cmpplace;
                        $scope.dist = $scope.details.dist;
                        $scope.cmpAddress = $scope.details.cmpaddress;
                        // $scope.cmpDate = new Date(Date.parse($scope.details.cmpdate)+ 106199999);
                        $scope.cmpDate =new Date($scope.details.cmpdate)
                        
                        $scope.cmpDateTo = new Date(Date.parse($scope.details.campdateto)+ 106199999);
                        
                        $scope.cmpNoDonors = $scope.details.cmpnodonors;
                        $scope.cmpRemark = $scope.details.cmpremark;
                        $scope.campid = $scope.details.campid;
                        $scope.idp = $scope.details.idpurl;
                        $scope.showIdpError = true;
                        $scope.idpFileGood = "UPLOADED";

                        // var imglink = $scope.details.campFiles;
                        // var mydiv = document.getElementById("linkDWN");

                        // var j = 0;
                        // for (let imgd of imglink) {
                        //     var aTag = document.createElement('a');
                        //     aTag.setAttribute('id', j + 1);
                        //     aTag.setAttribute('style', 'padding-right:10px');
                        //     aTag.setAttribute('href', "http://localhost:7900/bloodDonation/downloadFile/" + JSON.parse(imglink[j]).campFile);
                        //     aTag.innerHTML = "<i class='fas fa-download' aria-hidden='true'></i>";
                        //     mydiv.appendChild(aTag);
                        //     j = parseInt(j) + 1;
                        // }




                        //document.getElementById("dist").value = resCm[0].cmpDistrict;

                        $("#add").css('display', 'none'); $("#update").css('display', 'true');
                        if (getCookie('un') != 'ADMIN') {

                            angular.element(document.getElementById('dist'))[0].disabled = true;
                        }
                    })
            }
            else {
                if (getCookie('un') != 'ADMIN') {
                    $scope.dist = getCookie('un');
                    angular.element(document.getElementById('dist'))[0].disabled = true;
                }
                $("#add").css('display', 'true'); $("#update").css('display', 'none');
            }
        })

    $scope.updateData = async () => {
        // var valFlag = CheckValdCamp($scope);
        // 
        // var valFlag = CheckValdCamp($scope);
        // if (parseInt(valFlag) == 1) {
            // var theFile = document.querySelector('#idp').files[0];
            // if (theFile != undefined) {
            //     var checkType = theFile.type;
            //     if (checkType !== "image/jpeg" && checkType !== "image/png" ) {
            //         // validation of file extension using regular expression before file upload
            //         $scope.idpFileGood = "Please select jpg/jpeg/png image";
            //         $scope.showIdpError = true;
            //     }
            //     else {
            //         var theSize = theFile.size;
            //         if (theSize > 1000000)
            //         // validation according to file size(in bytes)
            //         {
            //             $scope.idpFileGood = "File Size is Too Long";
            //             $scope.showIdpError = true;
            //         }
            //         else {
            //             $scope.loader = true;
            //             var fd = new FormData();
            //             var i = 0;
            //             var campFiles = [];
            //             for (let img of document.querySelector('#idp').files) {
            //                 fd.append('files', document.querySelector('#idp').files[parseInt(i)]);
            //                 campFiles.push(JSON.stringify({ "campFile": img.name }));
            //                 i = parseInt(i) + 1;
            //             }

            //             var data = {
            //                 cmpOrgCode: $scope.OrgCode,
            //                 cmpPlace: $scope.cmpPlace,
            //                 cmpDistrict: $scope.dist,
            //                 cmpAddress: $scope.cmpAddress,
            //                 cmpDate: $scope.cmpDate,
            //                 cmpNoDonors: $scope.cmpNoDonors,
            //                 cmpRemark: $scope.cmpRemark,
            //                 campFiles: campFiles
            //             };
            //             console.log(data)
            //             fd.append('data', JSON.stringify(data));

            //             //data.append('files', document.querySelector('#idp').files[0]);
            //             try {
            //                 await $http.post('http://localhost:7900/bloodDonation/adminRoute/addCampDetails1', fd, {
            //                     transformRequest: angular.identity,
            //                     headers: { 'Content-Type': undefined }
            //                 });
            //                 window.alert(`Camp is added successfully.`);
            //                 // window.location.href = 'detailsCamp.html'
            //             } catch (e) {
            //                 window.alert('Problem to add Try Again.')
            //             }

            //         }
            //     }
            // }
            // else {
            //     $scope.idpFileGood = "Please Choose a PDF file";
            //     $scope.showIdpError = true;
            // }
          
                $scope.data1 = [];
                $scope.data = {};

                $scope.data.user_id = user_id;
                $scope.data.dist_id = district_id;

                $scope.data.cmpPlace = $scope.cmpPlace;
                $scope.data.dist = $scope.dist;
                $scope.data.cmpAddress = $scope.cmpAddress;
                $scope.data.cmpDate = $scope.cmpDate;
                $scope.data.cmpDateTo = $scope.cmpDateTo;
                $scope.data.cmpNoDonors = $scope.cmpNoDonors;
                $scope.data.cmpRemark = $scope.cmpRemark;
                $scope.data.idpUrl = $scope.idp;
                $scope.data.campid = $scope.campid;


                var data = new FormData();
                var request = new XMLHttpRequest();
                data.append('idp', document.querySelector('#idp').files[0]);
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        window.alert("Your Data is Updated");

                        window.location.href = "http://localhost:7900/bloodDonation/user/campUpdate";
                    }
                };
                data.append('Name1', JSON.stringify(JSON.parse(angular.toJson($scope.data))));
                request.open('POST', "http://localhost:7900/bloodDonation/userRoute/updateCampDetails1");
                request.send(data);


           
        // }
    }
    $scope.addData = async () => {
        $scope.showIdpError = false;
        $scope.showOrgCodeError = false;

        // var valFlag = CheckValdCamp($scope);
        // if (parseInt(valFlag) == 1) {
            // var theFile = document.querySelector('#idp').files[0];
            // if (theFile != undefined) {
            //     var checkType = theFile.type;
            //     if (checkType !== "image/jpeg" && checkType !== "image/png" ) {
            //         // validation of file extension using regular expression before file upload
            //         $scope.idpFileGood = "Please select jpg/jpeg/png image";
            //         $scope.showIdpError = true;
            //     }
            //     else {
            //         var theSize = theFile.size;
            //         if (theSize > 1000000)
            //         // validation according to file size(in bytes)
            //         {
            //             $scope.idpFileGood = "File Size is Too Long";
            //             $scope.showIdpError = true;
            //         }
            //         else {
            //             $scope.loader = true;
            //             var fd = new FormData();
            //             var i = 0;
            //             var campFiles = [];
            //             for (let img of document.querySelector('#idp').files) {
            //                 fd.append('files', document.querySelector('#idp').files[parseInt(i)]);
            //                 campFiles.push(JSON.stringify({ "campFile": img.name }));
            //                 i = parseInt(i) + 1;
            //             }

            //             var data = {
            //                 cmpOrgCode: $scope.OrgCode,
            //                 cmpPlace: $scope.cmpPlace,
            //                 cmpDistrict: $scope.dist,
            //                 cmpAddress: $scope.cmpAddress,
            //                 cmpDate: $scope.cmpDate,
            //                 cmpNoDonors: $scope.cmpNoDonors,
            //                 cmpRemark: $scope.cmpRemark,
            //                 campFiles: campFiles
            //             };
            //             console.log(data)
            //             fd.append('data', JSON.stringify(data));

            //             //data.append('files', document.querySelector('#idp').files[0]);
            //             try {
            //                 await $http.post('http://localhost:7900/bloodDonation/adminRoute/addCampDetails1', fd, {
            //                     transformRequest: angular.identity,
            //                     headers: { 'Content-Type': undefined }
            //                 });
            //                 window.alert(`Camp is added successfully.`);
            //                 // window.location.href = 'detailsCamp.html'
            //             } catch (e) {
            //                 window.alert('Problem to add Try Again.')
            //             }

            //         }
            //     }
            // }
            // else {
            //     $scope.idpFileGood = "Please Choose a PDF file";
            //     $scope.showIdpError = true;
            // }
            let idp = document.querySelector('#idp').files[0];
            if (idp != undefined) {
                $scope.data1 = [];
                $scope.data = {};

                $scope.data.user_id = user_id;
                $scope.data.dist_id = district_id;

                $scope.data.cmpPlace = $scope.cmpPlace;
                $scope.data.dist = $scope.dist;
                $scope.data.cmpAddress = $scope.cmpAddress;
                $scope.data.cmpDate = $scope.cmpDate;
                
                $scope.data.cmpDateTo = $scope.cmpDateTo;
                $scope.data.cmpNoDonors = $scope.cmpNoDonors;
                $scope.data.cmpRemark = $scope.cmpRemark;

                var data = new FormData();
                var request = new XMLHttpRequest();
                data.append('idp', document.querySelector('#idp').files[0]);
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        window.alert("Your Request Submitted Sucessfully");

                        window.location.href = "http://localhost:7900/bloodDonation/user/campUpdate";
                    }
                };
                data.append('Name1', JSON.stringify(JSON.parse(angular.toJson($scope.data))));
                request.open('POST', "http://localhost:7900/bloodDonation/userRoute/addCampDetails1");
                request.send(data);


            } else {
                window.alert('Upload Mandatory Files');
            }
        // }


        //var fileInput = document.getElementById('filename');
        //var file = fileInput.files[0];
        //var formData = new FormData();
        //formData.append('file', file);

    }


});
function removeCamp(campId) {
    let data = {
        "condition": {
            "campId": campId
        },
        "collectionName": "campDetails"
    };
    var url = "http://localhost:7900/bloodDonation/removeMyDocumentDB";
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
    var url = "http://localhost:7900/bloodDonation/getConvenordatadistdistinct";

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
        var url = "http://localhost:7900/bloodDonation/getDonationById/" + qs["id"];

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
    var url = "http://localhost:7900/bloodDonation/adminRoute/getDonorFilterList";
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
    var url = "http://localhost:7900/bloodDonation/admin/validateUserLogin";


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
                                if (userId != 'ADMIN2') {
                                    window.location.href = "http://localhost:7900/bloodDonation/user/migrantAllData";
                                } else {
                                    window.location.href = "http://localhost:7900/bloodDonation/user/saiSabujeemaAllData";
                                }

                            }
                            else if (datares[0].validated == "2") {
                                setCookie('un', userId, 1);
                                window.location.href = "http://localhost:7900/bloodDonation/user/migrantAllData";                                // location.replace("addDonation.html");
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


// function userValidate(userId, myPassword) {


//     let data = {
//         "userdetails": {
//             "username": userId,
//             "password": myPassword
//         }
//     };
//     var url = "http://localhost:7900/bloodDonation/validateUserLogin";


//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         if (xmlhttp.readyState == XMLHttpRequest.DONE) {
//             if (xmlhttp.status == 200) {

//                 var response = xmlhttp.responseText;
//                 if (response != null) {


//                     var datares = JSON.parse(response);
//                     if (datares.length > 0) {
//                         if (datares[0].validated != null) {
//                             if (datares[0].validated == "1") {
//                                 setCookie('un', userId, 1);
//                                 location.replace("covidSeva.html");
//                             }
//                             else {
//                                 window.alert('Please enter correct username password');
//                             }
//                         }
//                         else {
//                             window.alert('Please enter correct username password');
//                         }
//                     }
//                     else {
//                         window.alert('Please enter correct username password');
//                     }

//                 }
//                 else {
//                     window.alert('Please enter correct username password');
//                 }

//             } else if (xmlhttp.status == 400) {
//                 alert('there was an error 400');
//             } else {
//                 alert('something else other than 200 was returned');
//             }
//         }
//     };
//     xmlhttp.open("POST", url, true);
//     xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
//     xmlhttp.send(JSON.stringify(data));




// }

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

// function CheckValdCamp($scope) {
//     var rtnflag = 1;
//     if ($scope.OrgCode == '' || $scope.OrgCode == null || $scope.OrgCode.textContent == '' || $scope.OrgCode.text == '' || $scope.OrgCode.length < 4) {
//         rtnflag = 0;
//         $scope.showOrgCode = "Please input valud Organisation Code";
//         $scope.showOrgCodeError = true;
//     }

//     return rtnflag;
// }





