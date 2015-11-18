angular.module('clipr.services', [])

.factory('Clips', ["$http", function($http) {
    //loadClips - hhtp request to server func
    //return back array of clip objects

    var loadClips = function() {
        return $http({
            method: 'GET',
            url: '/loadclips'

        }).then(function(response) {
            console.log('factory response', response);
            return response.data;
        });
    };

    return {
        loadClips: loadClips
    };
}])

.factory('Notes', ["$http", function($http) {

  var notesObj = {
    data: []
  };

    var loadNotes = function(param){
      console.log('INSIDE loadNotes!');
      return $http({
        method: 'GET',
        url: '/user/get/loadNotes',
        params: {
          url: param
        }
      })
        .then(function(response) {
        console.log('factory response', response);
        notesObj.data = response.data;
        console.log(notesObj);
      });
    };

    var addNotes = function(param){
        return $http({
            method: 'POST',
            url: '/user/post/addNote',
            params: param
        })
          .then(function(response) {
            console.log('factory response', response);
            notesObj.data.push(response.data);
            console.log('notesObj inside addNotes', notesObj);
        });
    };
    return {
      loadNotes: loadNotes,
      addNotes : addNotes,
      notesObj: notesObj
    };

}]);