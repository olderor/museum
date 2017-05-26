var museum = museum || {};
museum.waiting = museum.waiting || {};
museum.waiting = (function() {
        var onAnimationDone = null;
        
        function animationDone() {
            $('#logo-container').hide();
            onAnimationDone();
        }
        
        function removeLogo() {
            $('#logo').removeClass('pulse');
            $('#logo').removeClass('infinite');
            $('#logo').addClass('bounceOutUp');
            if (onAnimationDone) {
                $('#logo').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', animationDone);
            }
        }
        
        var fadeInDone = false;
        var processDone = false;
        
        function shouldEndAnimation() {
            return fadeInDone && processDone;
        }
        
        function setProcessDone() {
            processDone = true;
            if (shouldEndAnimation()) {
                removeLogo();
            }
        }
        
        function pulseLogo() {
            $('#logo').removeClass('fadeInUp');
            fadeInDone = true;
            if (shouldEndAnimation()) {
                removeLogo();
                return;
            }
            $('#logo').addClass('pulse');
            $('#logo').addClass('infinite');
        }
        
        function showLogo() {
            $('#logo').addClass('animated fadeInUp');
            $('#logo').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', pulseLogo);
            $('#logo-container').show();
        }
        
        function init(onDone) {
            onAnimationDone = onDone;
            showLogo();
        }
    return {
        init: init,
        setProcessDone: setProcessDone
    };
})();