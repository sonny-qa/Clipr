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

.factory('Clips', ["$http", "$state", "$cookies", function($http, $state, $cookies) {
  //loadClips - hhtp request to server func
  //return back array of clip objects
  var clips = {
    data: {},
    clips: [],
    categories: {},
    collections: {}
  };

  var loadClipsByCategory = function(topic) {
    var categorizedClips = [];
    if (topic === 'all') {
      for (var key in clips.categories) {
        for (var clip in clips.categories[key]){
          categorizedClips.push(clips.categories[key][clip]);
        }
      }
    } else {
      for (var key in clips.categories[topic]) {
        categorizedClips.push(clips.categories[topic][key]);
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
      clips.categories = {}
      for (var x = 0; x < response.data.length; x++) {

        var clip = response.data[x].clips;
        var suggestion = response.data[x].suggestions;

        if (!clips.categories[clip.category]) {
          clips.categories[clip.category] = {}
          clips.categories[clip.category][clip.title] = clip;
          clips.categories[clip.category][clip.title].suggestions = [suggestion];
          console.log(clips.categories[clip.category][clip.title])
        } else {
          if (clips.categories[clip.category][clip.title]) {
            clips.categories[clip.category][clip.title].suggestions.push(suggestion);
          } else {
            clips.categories[clip.category][clip.title] = clip;
            clips.categories[clip.category][clip.title].suggestions = [suggestion];
          }
        }
        console.log('clips.categories', clips.categories);
      }
      loadClipsByCategory('all');
    });
  };

  var changeCategory = function(category, clipTitle) {
    return $http({
      method: 'POST',
      url: '/changeCategory',
      params: {
        category: category,
        clipTitle: clipTitle
      }
    }).then(function(response) {
      loadAllClips($cookies.get('clipr')).then(function(response) {
        console.log('response')
        loadClipsByCategory(category);
      });
    })
  }

  return {
    loadClipsByCategory: loadClipsByCategory,
    loadAllClips: loadAllClips,
    clips: clips,
    changeCategory: changeCategory
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
