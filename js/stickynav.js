(function($){
    'use strict';

    if(!$){
        return;
    }

    var $nav = $('.stickynav'),
        navRestTop = $nav.position().top,
        stuck = false,
        debounce = 0,
        debounceMs = 20;

    function getScroll(){
        return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    function setNavPosition(){
        var stick = getScroll() > navRestTop;

        if(stick !== stuck){
            if(stick){
                $nav.addClass('fixed');
            }else{
                $nav.removeClass('fixed');
            }
        }

        stuck = stick;
    }

    function debounceScroll(){
        var now = Date.now();
        if((now - debounce) < debounceMs){
            return;
        }
        debounce = now;

        setNavPosition();
    }

    $(window).bind('scroll', debounceScroll);

    setNavPosition();

})(window.jQuery);
