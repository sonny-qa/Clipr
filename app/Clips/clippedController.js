angular.module('clipr.clipped',['ui.router', 'ui.bootstrap'])

.controller('ClipController',['$scope', 'Clips', '$modal', function($scope, Clips, $modal){

  $scope.loadClips= function (){

   Clips.loadClips().then(function(clips){
    $scope.clips = clips;
    console.log($scope.clips);
  })};

   $scope.loadClips();

   $scope.showModal = function(clipIndex, size) {
    console.log('INSIDE SHOWMODAL!', clipIndex);
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

var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item, $sce) {
     $scope.item = item;
     $scope.notes=[];

     $scope.sceUrl= $sce.trustAsResourceUrl($scope.item.clipUrl);

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
}
