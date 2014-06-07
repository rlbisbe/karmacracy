var karmacracyControllers = angular.module('karmacracyControllers', []);
var karmacracyApp = angular.module('karmacracyApp', [
    'ngRoute',
    'karmacracyControllers'
]);

karmacracyApp.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|ms-appx):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }]);

karmacracyApp.filter('networkFilter', function () {
    return function (input) {
        switch (input) {
            case "FB":
                return "Facebook";
            case "TW":
                return "Twitter";
            case "LI":
                return "LinkedIn";
            default:
                return "Red social";
        }
    };
});

karmacracyApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/world', {
        templateUrl: 'partials/world.html',
        controller: 'WordCtrl'
    }).
    when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
    }).when('/user', {
        templateUrl: 'partials/user.html',
        controller: 'UserCtrl'
    }).when('/details/:id', {
        templateUrl: 'partials/details.html',
        controller: 'DetailsCtrl'
    }).otherwise({
        redirectTo: '/world'
    });
}]);

WinJS.Application.onsettings = function (e) {
    e.detail.e.request.applicationCommands.append(new Windows.UI.ApplicationSettings.SettingsCommand('privacy', 'Política de privacidad', function () {
        Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri('http://rlbisbe.github.io/karmacracy/privacidad'));
    }));
};

WinJS.Application.start();