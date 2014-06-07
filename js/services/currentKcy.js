karmacracyApp.service('currentKcy', [ function () {
    var _current = this;

    return {

        setKcy: function (kcy) {
            _current.kcy = kcy;
        },
        getKcy: function () {
            return _current.kcy;
        }
    }

}]);