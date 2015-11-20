angular.module('clipr.auth',[])

.controller('AuthController', function($scope){
 // console.log("hello");
}); ;;angular.module('clipr.clipped',['ui.router', 'ui.bootstrap'])

.controller('ClipController',['$scope', 'Clips', '$modal', 'Notes', 'AuthService', function($scope, Clips, $modal, Notes, AuthService){

  $scope.clips= Clips.clips

  $scope.loadAllClips= function (){
    Clips.loadAllClips()
  };

  $scope.loadAllClips();

  $scope.logOut = function(){
    AuthService.logOut();
  }


  $scope.showModal = function(clipIndex, size) {
    $scope.opts = {
      size: size,
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : './clipSelect/clipSelectView.html',
      controller : ModalInstanceCtrl,
      resolve: {}
    };

  $scope.opts.resolve.item = function() {
    return angular.copy({clipUrl:$scope.clips.data[clipIndex].clipUrl}); // pass name to Dialog
  };

  var modalInstance = $modal.open($scope.opts);
      modalInstance.result.then(function(){
            //on ok button press
          },function(){
            //on cancel button press
            console.log("Modal Closed");
          });
    };

  }]);

var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item, $sce, Notes) {

 $scope.item = item;
 $scope.sceUrl= $sce.trustAsResourceUrl($scope.item.clipUrl);
 $scope.notes= Notes.notesObj;

$scope.ok = function () {
  $modalInstance.close();
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

//On 'save', make call to server with notes and site url
//fetch Notes and display it
$scope.save = function(userNotes){
    $scope.NoteAndUrl = {
      note : userNotes,
      url : $scope.item.clipUrl
    };
    console.log('Notes being passed to server', $scope.NoteAndUrl);
    Notes.addNotes($scope.NoteAndUrl);
};

$scope.display = function(){
  console.log('display function!!!');
  Notes.loadNotes($scope.item.clipUrl);
  };

};
;angular.module('clipr.header',['ui.router']);



	
;angular.module('clipr.sidebar',['ui.router'])

.controller('SidebarController',['$scope', 'Clips', function($scope, Clips){
  console.log("placeholder to make linter happy");

  $scope.loadClipsByCategory= function(category){
  	Clips.loadClipsByCategory(category);
  }

}]);



	
;angular.module('clipr.services', ['ngCookies'])

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
    data: null
  }

  var loadClipsByCategory = function(category) {
    console.log('category', category)
    return $http({
      method: 'POST',
      url: '/loadClipsByCategory',
      params: {
        category: category
      }
    }).then(function(response) {
      console.log('category response yo', response);
      clips.data = response.data
    });
  };

  var loadAllClips = function() {
    return $http({
      method: 'GET',
      url: '/loadAllClips'
    }).then(function(response) {
      console.log('load all clips response', response.data)
      clips.data = response.data
      console.log(clips)
    })
  }

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
        //console.log('cookies are delish',$cookies.get('connect.sid'))
        if ($cookies.get('clipr')) {
            return true;
        } else {
            return false;
        }
    };

  var logOut = function() {
    console.log('in logout yo')
      //remove cookie on logout
    $cookies.remove('clipr');
    $state.go('landing')
  };


  return {
    isAuthenticated: isAuthenticated,
    logOut: logOut
  };

}]);/**
 * Main module of the application.
 */
angular
    .module('cliprApp', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'ngTouch',
        'clipr.services',
        'clipr.clipped',
        'clipr.header',
        'clipr.sidebar',
        'clipr.suggested',
        'clipr.auth'
    ])
.run(function($rootScope,$state, AuthService){
    $rootScope.$on("$stateChangeStart", function(event,toState,toParams,fromState, fromParams){
        if (toState.authenticate && !AuthService.isAuthenticated()){
            $state.transitionTo("landing");
            event.preventDefault();
        }
    });
})
.controller("AppController", ['$scope', '$location', function($scope, $location) {
  //authentication
}])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise('/');

    $stateProvider
        .state('landing', {
            url: "/landing",
            views: {
                "main": {
                    templateUrl: 'Landing/landingView.html',
                    controller: 'AuthController'
                }
            }
        })
        .state('main', {
            authenticate : true,
            url: "/clips",
            views: {
                "main": {
                    templateUrl: 'Clips/clippedView.html',
                    controller: 'ClipController'
                },
                'header@main': {
                    templateUrl: 'Clips/headerView.html',
                    controller: 'HeaderController'
                },
                'sidebar@main': {
                    templateUrl: 'Clips/sidebarView.html',
                    controller: 'SidebarController'
                }
            }
        })
}]);angular.module('clipr.suggested',['ui.router']);



	
