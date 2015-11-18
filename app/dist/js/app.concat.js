angular.module('clipr.auth',[])

.controller('AuthController', function($scope){
  console.log("hello");
}); ;angular.module('clipr.clipped',['ui.router', 'ui.bootstrap'])

.controller('ClipController',['$scope', 'Clips', '$modal', 'Notes', function($scope, Clips, $modal, Notes){

  $scope.loadClips= function (){

    Clips.loadClips().then(function(clips){
      $scope.clips = clips;
      console.log($scope.clips);
    });
  };

  $scope.loadClips();


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
      return angular.copy({clipUrl:$scope.clips[clipIndex].clipUrl}); // pass name to Dialog
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

.controller('SidebarController', function($scope){
  console.log("placeholder to make linter happy");
});



	
;angular.module('clipr.services', [])

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
      return $http({
        method: 'GET',
        url: '/user/get/loadNotes',
        params: {
          url: param
        }
      })
        .then(function(response) {
        console.log('factory response', response);
        notesArr.data= response.data;
        console.log(notesArr);
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
            notesArr.data.push(response.data);
            console.log('notesArr inside addNotes', notesArr);
        });
    };
    return {
      loadNotes: loadNotes,
      addNotes : addNotes,
      notesObj: notesObj
    };

}]);;/**
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

.controller("AppController", function($scope, $location) {
  //authentication 
})

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



	
