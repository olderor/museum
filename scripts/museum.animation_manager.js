var museum = museum || {};
museum.animation_manager = museum.animation_manager || {};
museum.animation_manager = (function() {

    var animations = [];
    var forceAnimations = [];
    var animationId = 1;
    var currentAnimationId = 0;
    var index = 0;

    function clear() {
        animations = [];
        forceAnimations = [];
        animationId += 1;
        index = 0;
    }

    function shouldSkipAnimation() {
        return $('#skip-animation-checkbox').prop('checked');
    }

    function isByStep() {
        return $('#step-animation-checkbox').prop('checked');
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

    function processAnimation() {
        if (index == 0) {
            currentAnimationId = animationId;
            if (shouldSkipAnimation()) {
                processForceAnimation();
                return;
            }
        }
        if (currentAnimationId != animationId) {
            return;
        }
        if (index >= animations.length) {
            clear();
            return;
        }
        animations[index].block();
        if (!isByStep()) {
            setTimeout(function() {
                index = index + 1;
                processAnimation();
            }, getAnimationDelay(animations[index].delay));
        }
    }

    function nextAnimation() {
        index = index + 1;
        processAnimation();
    }

    return {
        clear: clear,
        addForceAnimation: addForceAnimation,
        addAnimation: addAnimation,
        processAnimation: processAnimation,
        nextAnimation: nextAnimation
    };
})();
