angular.module('clipr.clipped', ['ui.router', 'ui.bootstrap', 'ngAside'])

.controller('ClipController', ['$scope', 'Clips', '$modal', 'Notes', 'AuthService', '$aside', function($scope, Clips, $modal, Notes, AuthService, $aside) {

  $scope.clips = Clips.clips;
  $scope.clipShow= false;

  $scope.loadAllClips = function() {
    Clips.loadAllClips();
  };

  $scope.loadAllClips();

  $scope.logOut = function() {
    AuthService.logOut();
  };

  $scope.clipToggle = function() {
  	if($scope.clipShow===false){
  		$scope.clipShow=true;
  	}
  	if($scope.clipShow===true){
  		$scope.clipShow=false;
  	}
  }

  $scope.showModal = function(clipIndex, size) {
    $scope.opts = {
      size: size,
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: './clipSelect/clipSelectView.html',
      controller: ModalInstanceCtrl,
      resolve: {}
    };

    $scope.opts.resolve.item = function() {
      return angular.copy({
        clipUrl: $scope.clips.data[clipIndex].clipUrl
      }); // pass name to Dialog
    };

    var modalInstance = $modal.open($scope.opts);
    modalInstance.result.then(function() {
      //on ok button press
    }, function() {
      //on cancel button press
      console.log("Modal Closed");
    });
  };

  $scope.openAside = function(position) {
    console.log('inside asiiiiideee');
    $aside.open({
      templateUrl: './Suggestions/categorySuggestionsView.html',
      placement: position,
      backdrop: false,
      controller: function($scope, $modalInstance) {
        $scope.ok = function(e) {
          $modalInstance.close();
          e.stopPropagation();
        };
        $scope.cancel = function(e) {
          $modalInstance.dismiss();
          e.stopPropagation();
        };
      }
    })
  }

}]);

var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item, $sce, Notes) {

  $scope.item = item;
  $scope.sceUrl = $sce.trustAsResourceUrl($scope.item.clipUrl);
  $scope.notes = Notes.notesObj;

  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  //On 'save', make call to server with notes and site url
  //fetch Notes and display it
  $scope.save = function(userNotes) {
    $scope.NoteAndUrl = {
      note: userNotes,
      url: $scope.item.clipUrl
    };
    console.log('Notes being passed to server', $scope.NoteAndUrl);
    Notes.addNotes($scope.NoteAndUrl);
  };

  $scope.display = function() {
    console.log('display function!!!');
    Notes.loadNotes($scope.item.clipUrl);
  };
};