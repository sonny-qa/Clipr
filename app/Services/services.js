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
    data: [],
    clips: [],
    categories: {}
  };

  var loadClipsByCategory = function(topic) {
    var categorizedClips = [];
    if (topic === 'all') {
      clips.clips = clips.data;
    }
    for (var x = 0; x < clips.data.length; x++) {
      var node = clips.data[x]
      console.log(node)
      if (node.category === topic) {
        categorizedClips.push(node)
      }
    }
    clips.clips = categorizedClips;
  };

  var loadAllClips = function(cookie) {
    return $http({
      method: 'GET',
      url: '/loadAllClips',
      params: {
        cookie: cookie
      }
    }).then(function(response) {
      clips.data = response.data;
      clips.clips = response.data;
      for (var x = 0; x < response.data.length; x++) {
        console.log(response.data)
        var clip = response.data[x];
        console.log('CLIPS', x)
        if (!clips.categories[clip.category]) {
          clips.categories[clip.category] = [clip];
        } else {
          clips.categories[clip.category].push(clip);
        }
      console.log('clips.categories', clips.categories);
      }
    });
  };

  return {
    loadClipsByCategory: loadClipsByCategory,
    loadAllClips: loadAllClips,
    clips: clips
  };

}])

.factory('Notes', ["$http", function($http) {

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
    console.log('cookies are delish', $cookies.get('clipr'));

    if ($cookies.get('clipr')) {
      return true;
    } else {
      return false;
    }
  };

  var logOut = function() {
    console.log('in logout yo');
    //remove cookie on logout
    $cookies.remove('clipr');
    $state.go('landing');
  };


  return {
    isAuthenticated: isAuthenticated,
    logOut: logOut
  };

}]);