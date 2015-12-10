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
    collections: []
  };

  var recentlyAdded = function() {
    loadClipsByCategory('all')
    var sortedClips = clips.clips.sort(function(a, b) {
      a.timeAdded = a.timeAdded || null;
      b.timeAdded = b.timeAdded || null;
      return b.timeAdded - a.timeAdded;
    })
    console.log(sortedClips)
    clips.clips = sortedClips.slice(0, 9);
  }

  var incrementCount = function(clipTitle) {
    return $http({
      method: 'POST',
      url: '/incrementCount',
      params: {
        clipTitle: clipTitle
      }
    }).then(function(response) {
      loadAllClips($cookies.get('clipr'));
    })
  }

  var loadClipsByCategory = function(topic) {
    var categorizedClips = [];
    if (topic === 'all') {
      for (var key in clips.categories) {
        for (var clip in clips.categories[key]) {
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
      clips.categories = {};
      for (var x = 0; x < response.data.length; x++) {

        var clip = response.data[x].clips;
        var suggestion = response.data[x].suggestions;

        if (!clips.categories[clip.category]) {
          clips.categories[clip.category] = {};
          clips.categories[clip.category][clip.title] = clip;
          clips.categories[clip.category][clip.title].suggestions = [suggestion];
          console.log(clips.categories[clip.category][clip.title]);
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

  var loadCollections = function() {
    return $http({
      method: 'POST',
      url: '/loadCollections'
    }).then(function(response) {
      console.log('load collection response', response)
      var response = response.data;
      var result = [];
      for (var i = 0; i < response.length; i++) {
        result.push(response[i].collection);
      }
      console.log('result', result)
      clips.collections = result;
    })
  }

  var addToCollection = function(collection, clip) {
    return $http({
      method: 'POST',
      url: '/addToCollection',
      params: {
        collection: collection,
        clip: clip.title
      }
    })
  }
  var showCollectionClips = function(collection) {
    return $http({
      method: 'POST',
      url: '/showCollectionClips',
      params: {
        collection: collection
      }
    }).then(function(response) {
      clips.clips = response.data
    })
  }

  var addCollection = function(collection) {
    return $http({
      method: 'POST',
      url: '/addCollection',
      params: {
        collection: collection
      }
    }).then(function(response) {
      console.log('received response')
      loadCollections();
    })
  }

  var deleteClip = function(clipTitle) {
    return $http({
      method: 'POST',
      url: '/deleteClip',
      params: {
        clipTitle: clipTitle,
        email: $cookies.get('clipr')
      }
    }).then(function(response) {
      loadAllClips($cookies.get('clipr'));
    })
  }

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
        loadClipsByCategory(category);
      });
    })
  }

  return {
    loadClipsByCategory: loadClipsByCategory,
    loadAllClips: loadAllClips,
    incrementCount: incrementCount,
    mostViewed: mostViewed,
    clips: clips,
    changeCategory: changeCategory,
    deleteClip: deleteClip,
    addCollection: addCollection,
    loadCollections: loadCollections,
    addToCollection: addToCollection,
    showCollectionClips: showCollectionClips,
    recentlyAdded: recentlyAdded
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