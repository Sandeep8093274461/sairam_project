// JavaScript source code
var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {

    var un = getCookie('un');
    if (un != "ADMIN") {
        location.replace("login.html");
    }
    var lth;
    $scope.addUser = async () => {

        $http.get('http://localhost:7900/bloodDonation/getUserMail/' + $scope.email)
            .then(responsed => {
                if (responsed.data.length > 0) {
                   
                    lth = responsed.data.length;
                }
                else {
                    alert('Please use different Email ID.');
                }
            })

        alert(lth);   
        let data = {
            userName: $scope.district1,
            email: $scope.email,
            credential: $scope.password
        };

        await $http.post('http://localhost:7900/bloodDonation/addUserDetails', { data: data });
        window.alert(`District is added successfully.`);
        window.location.href = 'password.html';
    }

});

app.controller("districtData", async ($scope, $http) => {

    var un = getCookie('un');
   

    $http.get('http://localhost:7900/bloodDonation/getUserDetails/' + un)
        .then(responsed => {
            $scope.userList = responsed.data;
        })
    $scope.updateData = (cmp) => {
        var url = "http://localhost:7900/passwordUpdate.html?id=" + cmp.id;
        location.replace(url);
    }
});


app.controller("rstpwd", async ($scope, $http) => {
    $scope.updateData = async () => {



        let data = {
            "condition": { "email": $scope.email },
            "newValue": {
                "email": $scope.email,
                "credential": $scope.password,
                "squestion": $scope.squestion,
                "sanswer": $scope.sanswer
            },
            "collectionName": "districtDetails"
        };

        try {
            let responsefinal = await $http.post('http://localhost:7900/bloodDonation/changeUserUpdates', { data: data });
            window.alert(responsefinal.data[0].msg);
            window.location.href = 'login.html'
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }
    }
});

app.controller("userUpdate", async ($scope, $http) => {
    var un = getCookie('un');
   
    $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
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

            if (qs["id"] != null) {
                
                //Update Details
                $http.get('http://localhost:7900/bloodDonation/getUserById/' + qs["id"])
                    .then(response1 => {
                        var resCm = response1.data;
                        $scope.userid = resCm[0].id;
                        $scope.email = resCm[0].email;
                        $scope.district = resCm[0].userName;
                        $scope.password = resCm[0].credential;
                        angular.element(document.getElementById('district'))[0].disabled = true;
                    })

            }
            else {
                //Add Details

            }
        })


    $scope.updateData = async () => {




        let data = {
            "condition": { "id": parseInt($scope.userid) },
            "newValue": {
                "email": $scope.email,
                "userName": $scope.district,
                "contactNo": $scope.contactNo,
                "credential": $scope.password,
                "squestion": $scope.squestion,
                "sanswer": $scope.sanswer
            },
            "collectionName": "districtDetails"
        };

        try {
            await $http.post('http://localhost:7900/bloodDonation/changeUserUpdates1', { data: data });
            window.alert(`${$scope.district} details updated successfully.`);
            window.location.href = 'password.html'
        } catch (e) {
            window.alert('Problem to add Try Again.')
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
    if (getCookie('un') == null) {
        location.replace("login.html");
    }
    else {
        eraseCookie('un');
        location.replace("login.html");
    }

}
function unchk() {
    if (getCookie('un') == null) {
        location.replace("login.html");
    }
}

