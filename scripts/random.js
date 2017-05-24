var musicapp = musicapp || {};
musicapp.random = (function () {
    function getRandom() {
        return Math.random();
    }
    
    function getRandomArbitrary(min, max) {
        return getRandom() * (max - min) + min;
    }
    
    function getRandomInt(min, max) {
        return Math.floor(getRandomArbitrary(min, max));
    }
    
    return {
        getRandom: getRandom,
        getRandomArbitrary: getRandomArbitrary,
        getRandomInt: getRandomInt
    };
})();