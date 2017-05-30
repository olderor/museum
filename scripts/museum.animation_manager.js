var museum = museum || {};
museum.animation_manager = museum.animation_manager || {};
museum.animation_manager = (function() {

    var animations = [];
    var forceAnimations = [];

    function clear() {
        animations = [];
        forceAnimations = [];
    }

    function shouldSkipAnimation() {
        return $('#skip-animation-checkbox').prop('checked');
    }

    function getAnimationDelay(initialDelay) {
        if (shouldSkipAnimation()) {
            return 0;
        }
        var speed = $('#animation-speed').val();
        return initialDelay / speed;
    }

    function addAnimation(animation) {
        animations.push(animation);
    }

    function addForceAnimation(animation) {
        forceAnimations.push(animation);
        animations.push(animation);
    }

    function processForceAnimation() {
        for (var i = 0; i < forceAnimations.length; ++i) {
            forceAnimations[i].block();
        }
        clear();
    }

    function processAnimation(index) {
        if (!index) {
            index = 0;
            if (shouldSkipAnimation()) {
                processForceAnimation(0);
                return;
            }
        }
        if (index >= animations.length) {
            clear();
            return;
        }
        animations[index].block();
        setTimeout(function() {
            processAnimation(index + 1);
        }, getAnimationDelay(animations[index].delay));
    }

    return {
        clear: clear,
        addForceAnimation: addForceAnimation,
        addAnimation: addAnimation,
        processAnimation: processAnimation
    };
})();
