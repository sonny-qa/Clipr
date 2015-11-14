angular.module('clipr.clipped',['ui.router'])

.controller('ClipController',['$scope', 'Clips', function($scope, Clips){

	 $scope.loadClips= function (){
	Clips.loadClips().then(function(clips){
		$scope.clips= clips
		console.log($scope.clips)
	})}
	
	$scope.loadClips()
}])


	
