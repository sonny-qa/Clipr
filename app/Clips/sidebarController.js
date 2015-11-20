angular.module('clipr.sidebar',['ui.router'])

.controller('SidebarController',['$scope', 'Clips', function($scope, Clips){

  $scope.loadClipsByCategory= function(category){
  	Clips.loadClipsByCategory(category);
  };

}]);



	
