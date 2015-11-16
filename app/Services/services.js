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

    var addNote = function(param){
        return $http({
            method: 'POST',
            url: '/user/post/addNote',
            params: param
        })
          .then(function(response) {
            console.log('factory response', response);
            return response.data;
        });
    };
    return {
      addNote : addNote
    };

}]);