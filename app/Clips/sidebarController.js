angular.module('clipr.sidebar',['ui.router'])

.controller('SidebarController',['$scope', 'Clips', function($scope, Clips){

  console.log("placeholder to make linter happy");
  $scope.categories= Clips.clips

  $scope.loadClipsByCategory= function(category){
  	console.log('category', category)
  	Clips.loadClipsByCategory(category);
  };

}]);




