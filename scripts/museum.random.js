var museum = museum || {};
museum.random = museum.random || {};
museum.random = (function() {
    function getRandom() {
        return Math.random();
    }

    function getRandomArbitrary(min, max) {
        return getRandom() * (max - min) + min;
    }

    function getRandomInt(min, max) {
        return Math.floor(getRandomArbitrary(min, max));
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    return {
        getRandom: getRandom,
        getRandomArbitrary: getRandomArbitrary,
        getRandomInt: getRandomInt,
        guid: guid
    };
})();
