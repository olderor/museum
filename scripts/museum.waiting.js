var museum = museum || {};
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
        function pulseLogo() {
            $('#logo').removeClass('fadeInUp');
            $('#logo').addClass('pulse');
            $('#logo').addClass('infinite');
            setTimeout(removeLogo, 3000);
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
        init: init
    };
})();