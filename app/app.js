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
        'clipr.sidebar',
        'clipr.suggested',
        'clipr.categories'
    ])

.run(function($rootScope, $state, AuthService) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !AuthService.isAuthenticated()) {
                $state.transitionTo("landing");
                event.preventDefault();
            }
        });
    })
    .controller("AppController", ['$scope', '$location', function($scope, $location) {
        //authentication
    }])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('landing', {
            url: "/landing",
            views: {
                "main": {
                    templateUrl: 'html/landingView.html',
                    controller: 'landingController'
                }
            }
        })
        .state('categories',{
            url:"/categories",
            views:{
                "main":{
                    templateUrl:'html/categories.html',
                    controller: 'CategoryController'
                },
                "header@categories":{
                    templateUrl:'html/header.html',
                    controller:'ClipController'
                }
            }
        })
        .state('main', {
            authenticate: true,
            url: "/clips",
            views: {
                "main": {
                    templateUrl: 'html/clippedView.html',
                    controller: 'ClipController'
                },
                "header@categories":{
                    templateUrl:'html/header.html',
                    controller:'ClipController'
                }
                // 'sidebar@main': {
                //     templateUrl: 'html/sidebarView.html',
                //     controller: 'SidebarController'
                // }
            }
        })

}])