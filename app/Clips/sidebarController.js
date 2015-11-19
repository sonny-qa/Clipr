angular.module('clipr.sidebar',['ui.router'])

.controller('SidebarController',['$scope', 'Clips', function($scope, Clips){

  console.log("placeholder to make linter happy");

  $scope.loadClipsByCategory= function(category){
  	Clips.loadClipsByCategory(category);
  }

});



	
