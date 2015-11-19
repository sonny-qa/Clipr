/**
 * Main module of the application.
 */
angular
    .module('cliprApp', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'ngTouch',
        'clipr.services',
        'clipr.clipped',
        'clipr.header',
        'clipr.sidebar',
        'clipr.suggested',
        'clipr.auth'
    ])
.run(function($rootScope,$state, AuthService){
    $rootScope.$on("$stateChangeStart", function(event,toState,toParams,fromState, fromParams){
        if (toState.authenticate && !AuthService.isAuthenticated()){
            $state.transitionTo("landing");
            event.preventDefault();
        }
    });
})
.controller("AppController", ['$scope', '$location', function($scope, $location) {
  //authentication
}])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise('/');

    $stateProvider
        .state('landing', {
            url: "/landing",
            views: {
                "main": {
                    templateUrl: 'Landing/landingView.html',
                    controller: 'AuthController'
                }
            }
        })
        .state('main', {
            authenticate : true,
            url: "/clips",
            views: {
                "main": {
                    templateUrl: 'Clips/clippedView.html',
                    controller: 'ClipController'
                },
                'header@main': {
                    templateUrl: 'Clips/headerView.html',
                    controller: 'HeaderController'
                },
                'sidebar@main': {
                    templateUrl: 'Clips/sidebarView.html',
                    controller: 'SidebarController'
                }
            }
        })
}])