angular.module('clipr.clipped',['ui.router', 'ui.bootstrap'])

.controller('ClipController',['$scope', 'Clips', '$modal', function($scope, Clips, $modal){

  $scope.loadClips= function (){

   Clips.loadClips().then(function(clips){
    $scope.clips= clips;
    console.log($scope.clips);
  })};

   $scope.loadClips();

   $scope.name = 'sample data';

   $scope.showModal = function() {
    console.log('INSIDE SHOWMODAL!');
    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : './clipSelect/clipSelectView.html',
      controller : ModalInstanceCtrl,
        resolve: {} // empty storage
      };

  $scope.opts.resolve.item = function() {
      return angular.copy({name:$scope.name}); // pass name to Dialog
    }

  var modalInstance = $modal.open($scope.opts);

          modalInstance.result.then(function(){
            //on ok button press
          },function(){
            //on cancel button press
            console.log("Modal Closed");
          });
  };

    }]);


var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item) {

     $scope.item = item;

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
}
