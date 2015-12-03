angular.module('clipr.categories', [])

.controller('CategoryController', ['$scope', 'Clips','$cookies','$state', function($scope, Clips, $cookies, $state) {

  $scope.categories = Clips.clips;

  $scope.loadClipsByCategory = function(category) {
    Clips.loadClipsByCategory(category);
    $state.go('main')
  }

  $scope.loadAllClips = function() {
   Clips.loadAllClips($cookies.get('clipr'));
 };

  $scope.navToClips = function() {
   Clips.loadAllClips($cookies.get('clipr'));
   $state.go('main')
 };


  $scope.loadAllClips();

}])