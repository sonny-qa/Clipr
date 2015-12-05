angular.module('clipr.clipped', ['ui.router', 'ui.bootstrap', 'ngAside'])

.controller('ClipController', ['$scope', 'Clips', '$modal', 'Notes', 'AuthService', '$aside', 'Suggestions', '$cookies', function($scope, Clips, $modal, Notes, AuthService, $aside, Suggestions, $cookies) {

   $scope.clips = Clips.clips;
   $scope.clipShow = false;

   $scope.loadAllClips = function() {
     Clips.loadAllClips($cookies.get('clipr'));
   };


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
   };

   $scope.showModal = function(clipUrl, title) {
     $scope.opts = {
       size: 'lg',
       backdrop: true,
       backdropClick: true,
       dialogFade: false,
       keyboard: true,
       templateUrl: 'html/clipSelectView.html',
       controller: ModalInstanceCtrl,
       resolve: {}
     };

     $scope.opts.resolve.item = function() {
       return angular.copy({
         clip: clipUrl,
         title: title
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
       templateUrl: 'html/categorySuggestionsView.html',
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
     });
   };

}]);

var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item, $sce, Notes, Suggestions) {

   $scope.item = item;
   $scope.sceUrl = $sce.trustAsResourceUrl($scope.item.clip);
   $scope.suggestions = Suggestions.content.data;
   $scope.sites = false;

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
       url: $scope.item.clip
     };
     console.log('Notes being passed to server', $scope.NoteAndUrl);
     // Notes.addNotes($scope.NoteAndUrl);
   };

   $scope.displaySites = function () {
    $scope.sites = true;
   };


    $scope.getRelated = function () {
      console.log('NEW PASS TO SUGGESTIONS', $scope.item.title);
      //call service factory - getSuggestions
      Suggestions.getContent($scope.item.title);
      // console.log("Suggestions back from server: ", $scope.suggestions);
    };

};


