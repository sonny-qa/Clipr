angular.module('clipr.services', ['ngCookies'])

//Session Service
.service('Session', function() {
    this.create = function(sessionId, userId) {
        this.id = sessionId;
        this.userId = userId;
    };

    this.destroy = function() {
        this.id = null;
        this.userId = null;
    };
})

.factory('Clips', ["$http", function($http) {
  //loadClips - hhtp request to server func
  //return back array of clip objects
  var clips = {
    data: null;
  }

  var loadClipsByCategory = function(category) {
    return $http({
      method: 'GET',
      url: '/loadClipsByCategory',
      params: {
        category: category
      }

    }).then(function(response) {
      console.log('factory response', response);
      return response.data;
    });
  };

  var loadAllClips = function() {
    return $http({
      method: 'GET',
      url: '/loadAllClips'
    }).then(function(response) {
      clips.data = response.data
    })
  }

  return {
    loadClipsByCategory: loadClipsByCategory,
    loadAllClips: loadAllClips,
    clips: clips
  };

}])

.factory('Notes', ["$http", function($http) {

<<<<<<< 68e85233ef1428e423f63436516eeb5f26295efa
    var notesObj = {
        data: []
    };

    var loadNotes = function(param) {
        return $http({
                method: 'GET',
                url: '/user/get/loadNotes',
                params: {
                    url: param
                }
            })
            .then(function(response) {
                notesObj.data = response.data;
                console.log(notesObj);
            });
    };

    var addNotes = function(param) {
        return $http({
                method: 'POST',
                url: '/user/post/addNote',
                params: param
            })
            .then(function(response) {
                console.log('factory response', response);
                notesObj.data.push(response.data);
                console.log('notesArr inside addNotes', notesObj);
            });
    };
    return {
        loadNotes: loadNotes,
        addNotes: addNotes,
        notesObj: notesObj
    };

}])

.factory('AuthService', ['$http', 'Session', '$cookies', '$state', function($http, Session, $cookies, $state) {

    var isAuthenticated = function() {
        //check local storage return true or false depending on prescence of Clipr cookie
        //console.log('cookies are delish',$cookies.get('connect.sid'))
        if ($cookies.get('clipr')) {
            return true;
        } else {
            return false;
        }
    };

    var logOut = function() {
        //remove cookie on logout
        $cookies.remove('clipr');
        $state.go('landing')
    };


    return {
        isAuthenticated: isAuthenticated,
        logOut: logOut
    };
=======
  var notesObj = {
    data: []
  };

  var loadNotes = function(param) {
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

  var addNotes = function(param) {
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
    addNotes: addNotes,
    notesObj: notesObj
  };
>>>>>>> [Feat]: Add categorization element to clipView

}])