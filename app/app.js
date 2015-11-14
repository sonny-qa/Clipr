/**
 * Main module of the application.
 */
angular
    .module('cliprApp', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'ngTouch',
        'clipr.clipped',
        'clipr.header',
        'clipr.sidebar',
        'clipr.suggested',
    ])

.controller("AppController", function($scope, $location, Auth) {

})

.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

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
        .state('main',{
          url: "/",
          views:{
            "main": {
              templateUrl: 'Clips/clippedView.html',
              controller: 'ClippedController'
            },
            'header@main': {
              templateUrl: 'Clips/headerView.html',
              controller:'HeaderController'
            },
            'sidebar@main': {
              templateUrl: 'Clips/sidebarView.html',
              controller: 'SidebarController'
            }
          }
        })
}])