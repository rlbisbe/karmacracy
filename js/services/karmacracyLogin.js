karmacracyApp.service('karmacracyLogin', ['$cacheFactory', function ($cacheFactory) {
    var _current = this;

    var logged_in = 'collapse';
    var not_logged_in = 'visible';

    var API_key = "[YOUR_API_KEY_HERE]";
    var karmacracyClient = new Karmacracy(API_key, 'es');

    var user = null;
    var userNetworks = null;

    var cache = $cacheFactory('cacheId');
    cache

    var getWorld = function (force, success) {

        if (force) {
            karmacracyClient.getKcys({ from: '1', num: '10', type: '1' },
                    function (error) { },
                    function (result) {
                        cache.put("world");
                        success(result);
                    });
        }
        var result = cache.get("world");
        success(result);
    };

    var getUserNetworks = function (callback) {
        karmacracyClient.getNetworks(
            function (error) { },
            function (data) {
                userNetworks = data;
                callback();
            })
    }

    var updateUser = function (name, key, callback) {
        karmacracyClient.setUser(name, key);
        karmacracyClient.getUserInfo(
            function (error) { },
            function (data) {
                logged_in = 'visible';
                not_logged_in = 'collapse';
                user = data;
                getUserNetworks(callback);
            })
    };

    var forceGetWorld = function (success) {
        karmacracyClient.getKcys({ from: '1', num: '10', type: '1' },
                        function (error) { },
                        function (result) {
                            cache.put("world", result);
                            success(result);
                        });
    }

    var forceGetFirewords = function (success) {
        karmacracyClient.getFirewords({ num: '30' },
                        function (error) { },
                        function (result) {
                            cache.put("firewords", result);
                            success(result);
                        });
    }

    var getCached = function (functionName, key, success, force) {
        var result = cache.get(key);

        if (force) {
            functionName(success);
            return;
        }

        if (result) {
            success(result);
            return;
        }

        functionName(success);
    }

    return {

        getFirewords: function (success, force) {
            getCached(forceGetFirewords, "firewords", success, force);
        },

        getWorld: function (success, force) {
            getCached(forceGetWorld, "world", success, force);
        },

        login: function (user, password, onError, onSuccess) {
            karmacracyClient.getKey({ u: user, p: password },
                 function (error) {
                     onError(error);
                 },
                 function (data) {
                     updateUser(user, data.key, onSuccess);
                 });
        },

        getClient: function () {
            return karmacracyClient;
        },
        getLoggedIn: function () {
            return logged_in;
        },
        getNotLoggedIn: function () {
            return not_logged_in;
        },
        currentUser: function () {
            return user;
        },
        getUserNetworks: function () {
            return userNetworks;
        }
    }

}]);