karmacracyControllers.controller('DetailsCtrl', ['$scope', '$routeParams', '$http', '$location', 'karmacracyLogin', 'currentKcy',
    function ($scope, $routeParams, $http, $location, karmacracyLogin, currentKcy) {
        
        $scope.$on("$routeChangeSuccess", function (scope, next, current) {
            $scope.transitionState = "active"
            WinJS.UI.processAll();
        });

        $scope.user = karmacracyLogin.currentUser();
        $scope.id = $routeParams.id;
        $scope.kcy = currentKcy.getKcy();

        $scope.logged_in = karmacracyLogin.getLoggedIn();
        $scope.not_logged_in = karmacracyLogin.getNotLoggedIn();

        $scope.goback = function () {
            $location.path("/world/");
        }
    }]);