
    // async function addServerDataToLocalBackup() {
    //     let response = await $http.get('https://odishaagrilicense.nic.in/acts/admin/getIndexCaseList');
    //     let data = response.data;
    //     data.forEach( async (e, index) => {
    //             console.log(index, e)
    //             let body = {
    //                 data: {                        
    //                     name : e.name,
    //                     age : e.age,
    //                     gender : e.gender,
    //                     mobileNo : e.mobileNo,
    //                     district : e.district,
    //                     address : e.address,
    //                     secondaryPeoples : e.secondaryPeoples,
    //                     infectedSources : e.infectedSources,
    //                     dangerZone : e.dangerZone,
    //                     infectedDate : e.infectedDate,
    //                     submitOn : e.submitOn,
    //                     finYear : e.finYear,
    //                     caseNo : e.caseNo,
    //                     upDateOn : e.upDateOn
    //                 },
    //                 collectionName: 'contactInfo'
    //             }
    //             await $http.post('http://localhost:7900/bloodDonation/admin/insertMyDocuments', body);
    //     })
    // }
    // addServerDataToLocalBackup();
    // async function updateServerDataToLocalBackup() {
    //     let response = await $http.get('http://localhost:7900/bloodDonation/admin/getIndexCaseList');
    //     let data = response.data;
    //     data.forEach( async (e, index) => {
    //             if(index >= 6) {
    //                 console.log(index, e)
    //                 let body = {
    //                     condition: { caseNo: e.caseNo},
    //                     newValue: {
    //                         name : data[index+1].name,
    //                         age : data[index+1].age,
    //                         gender : data[index+1].gender,
    //                         mobileNo : data[index+1].mobileNo,
    //                         district : data[index+1].district,
    //                         address : data[index+1].address,
    //                         secondaryPeoples : data[index+1].secondaryPeoples,
    //                         infectedSources : data[index+1].infectedSources,
    //                         dangerZone : data[index+1].dangerZone,
    //                         infectedDate : data[index+1].infectedDate,
    //                         submitOn : data[index+1].submitOn,
    //                         finYear : data[index+1].finYear,
    //                         // caseNo : data[index+1].caseNo,
    //                         upDateOn : data[index+1].upDateOn
    //                     },
    //                     collectionName: 'contactInfo'
    //                 }
    //                 // console.log(body);

    //                 $http.post('http://localhost:7900/bloodDonation/admin/changeMyUpdates', body);
    //             }
    //     })
    // }
    // updateServerDataToLocalBackup();
    //  async function removeMyDocument() {
    //      let body = {
    //          condition: {
    //             caseNo: 673
    //          },
    //          collectionName: 'contactInfo'
    //      }
    //     $http.post('http://localhost:7900/bloodDonation/admin/removeMyDocument', body);
    // }
    // removeMyDocument();




    // DANGER ZONE

// ADD CIRCLE LAYER IN PREVIOUS DOCUMENTS
    // async function changePreviousLayesToCircleType() {
    //     let response = await $http.get('https://odishaagrilicense.nic.in/acts/admin/getDateWiseDangerZoneData?fromDate='+ $scope.fromDate+ '&toDate='+ $scope.toDate );
    //     let data = response.data;
    //     data.forEach( async (e, index) => {
    //         if(e.layerType == undefined){
    //             console.log(index, e)
    //             let body = {
    //                 condition: {
    //                     lat:e.lat,
    //                     lng: e.lng
    //                 },
    //                 newValue: {
    //                     layerType: 'Circle'
    //                 },
    //                 collectionName: 'dangerZone'
    //             }
    //             await $http.post('https://odishaagrilicense.nic.in/acts/admin/changeMyUpdates', body);
    //         }
    //     })
    // }
    // changePreviousLayesToCircleType();