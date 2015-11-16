angular.module('clipr.clipped',['ui.router', 'ui.bootstrap'])

.controller('ClipController',['$scope', 'Clips', '$modal', 'Notes', function($scope, Clips, $modal, Notes){

  $scope.loadClips= function (){

    Clips.loadClips().then(function(clips){
      $scope.clips = clips;
      console.log($scope.clips);
    });
  };

  $scope.loadClips();

  //On 'save', make call to server with notes and site url
  //fetch Notes and display it
  $scope.addNote = function(note, url) {
    $scope.NoteAndUrl = {
      note : note,
      url : url
    };
    Notes.storeNotes($scope.NoteAndUrl);
  };

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
      resolve: {
        addNote :function(){
          return $scope.addNote;
        }
      }
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

var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item, $sce, addNote) {

 $scope.item = item;
 $scope.notes=[];

 $scope.sceUrl= $sce.trustAsResourceUrl($scope.item.clipUrl);

$scope.ok = function () {
  $modalInstance.close();
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

$scope.save = function(userNotes){
  console.log('save function!!!', userNotes);
  addNote(userNotes, $scope.item.clipUrl);
};

};
