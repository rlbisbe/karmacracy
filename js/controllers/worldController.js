karmacracyControllers.controller('WordCtrl', ['$scope', '$http',
    'karmacracyLogin', 'currentKcy', '$location',
    function ($scope, $http, karmacracyLogin, currentKcy, $location) {

        $scope.username = null;
        $scope.password = null;

        $scope.url = null;
        $scope.generatedKcy = null;
        $scope.currentKcy = currentKcy;
        $scope.kcyvalue = null;
        $scope.$on("$routeChangeSuccess", function (scope, next, current) {
            $scope.transitionState = "active";
            WinJS.UI.processAll();
        });

        $scope.logged_in = karmacracyLogin.getLoggedIn();
        $scope.not_logged_in = karmacracyLogin.getNotLoggedIn();
        $scope.user = karmacracyLogin.currentUser();
        $scope.networks = karmacracyLogin.getUserNetworks();
        
        console.log($scope.networks);

        $scope.karmacracyClient = karmacracyLogin.getClient();
        $scope.kcys_loaded = null;
        $scope.kcys_not_loaded = null;

        $scope.firewords_not_loaded = null;

        $scope.firewords = [];
        $scope.kcys = [];

        $scope.share = function () {
            for (var i in $scope.networks) {
                $scope.networks[i].checked = false;
            }
            var flyout = document.getElementById("contactFlyout").winControl;
            flyout.show(main);
        };

        $scope.showLogin = function () {
            var flyout = document.getElementById("loginFlyout").winControl;
            flyout.show(main);
        };

        $scope.tryLogin = function () {
            karmacracyLogin.login($scope.username, $scope.password,
                function (error) {
                    $scope.errors = "Usuario o contraseña erróneos";
                    $scope.$apply();
                },
                function (data) {
                    $scope.user = karmacracyLogin.currentUser();
                    $scope.logged_in = karmacracyLogin.getLoggedIn();
                    $scope.not_logged_in = karmacracyLogin.getNotLoggedIn();
                    $scope.$apply();

                    var flyout = document.getElementById("loginFlyout").winControl;
                    flyout.hide(main);
                }
            );
        };

        $scope.refresh = function (force) {
            $scope.kcys_not_loaded = 'visible';
            $scope.firewords_not_loaded = 'visible';
            $scope.kcys_loaded = 'collapse';

            karmacracyLogin.getWorld(
                function (result) {
                    result.forEach(function (kcy) {
                        $scope.kcys.push(kcy);
                    });

                    $scope.kcys_not_loaded = 'collapse';
                    $scope.kcys_loaded = 'visible';
                    $scope.$apply();
                }, force);

            var getMaxValue = function (words) {
                var max = 0;

                words.forEach(function (fireword) {
                    if (fireword[1] > max) {
                        max = fireword[1];
                    }
                });

                return max;
            }

            karmacracyLogin.getFirewords(
                function (data) {
                    $scope.firewords = [];

                    var max = getMaxValue(data);

                    data.forEach(function (fireword) {
                        var myInterval = fireword[1];
                        if (myInterval >= 3 && myInterval <= 5) {
                            fireword[2] = 'rgba(86, 146, 213, 0.6)';
                        }
                        else if (myInterval >= 6 && myInterval <= 7) {
                            fireword[2] = 'rgba(86, 146, 213, 0.8)';
                        }
                        else {
                            fireword[2] = 'rgba(86, 146, 213, 1)';
                        }
                        fireword[3] = (14 + ((fireword[1] / max) * 5)) + "pt";
                        $scope.firewords.push(fireword);
                    });

                    $scope.firewords_not_loaded = 'collapse';
                    $scope.$apply();
                }, force);

        };

        $scope.changeUrl = function () {

            $scope.karmacracyClient.shortLink({ url: $scope.url },
                function (error) {
                    console.log(error);
                },
                function (success) {
                    $scope.generatedKcy = success.url;
                    $scope.kcyvalue = $scope.generatedKcy.replace("http://kcy.me/", "");
                    $scope.$apply();
                });
        };

        $scope.gotoSpecificKcy = function (kcy) {
            $scope.currentKcy.setKcy(kcy);
            $location.path("/details/" + kcy.id);
        }

        $scope.doShare = function () {
            for (var i in $scope.networks) {
                if ($scope.networks[i].checked) {
                    $scope.karmacracyClient.shareKcy({txt: $scope.generatedKcy, kcy: $scope.kcyvalue, where:
                    $scope.networks[i].type + "_" + $scope.networks[i].connectid})
                }
            }
        }

        $scope.refresh(false);
    }]);