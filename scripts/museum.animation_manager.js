var museum = museum || {};
museum.animation_manager = museum.animation_manager || {};
museum.animation_manager = (function() {

    var animations = [];

    function clear() {
        animations = [];
    }

    function addAnimation(animation) {
        animations.push(animation);
    }

    function processAnimation(index) {
        if (!index) {
            index = 0;
        }
        if (index >= animations.length) {
            clear();
            return;
        }
        animations[index].block();
        setTimeout(function() {
            processAnimation(index + 1);
        }, animations[index].delay);
    }

    return {
        clear: clear,
        addAnimation: addAnimation,
        processAnimation: processAnimation
    };
})();
