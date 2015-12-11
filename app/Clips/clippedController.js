angular.module('clipr.clipped', ['ui.router', 'ui.bootstrap', 'ngAside', 'angularMoment'])

.controller('ClipController', ['$scope', 'Clips', '$modal', 'AuthService', '$aside', '$cookies', '$state', '$window', function($scope, Clips, $modal, AuthService, $aside, $cookies, $state, $window) {

  $scope.clips = Clips.clips;
  $scope.clipShow = false;
  $scope.categories = Clips.clips;
  $scope.collection = "";
  $scope.categoryDisplay;


  $scope.submit = function() {
    Clips.addCollection($scope.collection);
    $scope.collection = "";
  };

  $scope.mostVisited = function() {
    $scope.categoryDisplay = 'Your Most Visited Clips:';

    Clips.mostVisited();
  };

  $scope.incrementCount = function(clipTitle) {
    Clips.incrementCount(clipTitle);
  };

  $scope.recentlyAdded = function() {
    $scope.categoryDisplay = 'Your Recently Added Clips:';
    Clips.recentlyAdded();
  };

  $scope.showCollectionClips = function(collection) {
    Clips.showCollectionClips(collection);
  };

  $scope.loadClipsByCategory = function(category) {
    Clips.loadClipsByCategory(category);
    if (category === 'all') {
      $scope.categoryDisplay = 'Your Clips:';
      console.log($scope.categoryDisplay);
    } else {
      $scope.categoryDisplay = 'Your ' + category + ' clips:';
    }
    $state.go('main');
  };

  $scope.navToClips = function() {
    Clips.loadAllClips($cookies.get('clipr'));
    $state.go('main');
  };

  $scope.loadAllClips = function() {
    $scope.categoryDisplay= 'Your Clips';
    Clips.loadAllClips($cookies.get('clipr'));
  };

  $scope.changeCategory = function(event, ui, item_id) {
    // console.log(event);
    var clipTitle = ui.draggable.find("h4").attr('title').toString();
    var category = item_id.toString();
    Clips.changeCategory(category, clipTitle);

  };

  // $scope.changeCategory = function(category, clip) {
  //   console.log('in change category')
  //   clip.category = category;
  //   Clips.changeCategory(category, clip.title);
  // }

  $scope.loadAllClips();

  $scope.loadCollections = function() {
    Clips.loadCollections();
  };

  $scope.loadCollections();

  $scope.logOut = function() {
    AuthService.logOut();
  };

  $scope.clipToggle = function() {
    if ($scope.clipShow === false) {
      $scope.clipShow = true;
    }
    if ($scope.clipShow === true) {
      $scope.clipShow = false;
    }
  };

  $scope.delete = function(clipTitle) {
    Clips.deleteClip(clipTitle);
  };


  $scope.showModal = function(clip, size) {
    $scope.opts = {
      size: size,
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
        clipUrl: clip.clipUrl,
        title: clip.title,
        category: clip.category,
        clip: clip
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

var ModalInstanceCtrl = function($scope, $modalInstance, Clips, $modal, item, $window) {
  $scope.collections = Clips.clips.collections;
  $scope.item = item.clip;
  

  $scope.windowOpen= function(clipUrl){
    $window.open('https://twitter.com/intent/tweet?hashtags=clipr&text=' + clipUrl, 'height=300, width=400');
  };

  $scope.fbShare = function (url, title, winWidth, winHeight) {
    var winTop = (screen.height / 4) - (winHeight / 2);
    var winLeft = (screen.width / 4) - (winWidth / 2);
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[url]=' + url +  'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
  };

  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.addToCollection = function(collection, clip) {
    Clips.addToCollection(collection, clip);
  };

  $scope.changeCategory = function(category, clip) {
    clip.category = category;
    Clips.changeCategory(category, clip.title);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

};