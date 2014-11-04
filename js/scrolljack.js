/*
 * scrolljack.js
 */
var scrolljacker = (function(){
    function easeInOutCubic(t, b, c, d){
        t /= d/2;
        if(t < 1){
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    }

    function getScroll(){
        return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop || window.scrollY || 0;
    }

    function setScroll(y){
        window.scroll(0, y);
    }

    function ScrollJack(options){
        options = options || {};

        this.speed = options.speed;
    }

    ScrollJack.prototype.scrollTo = function scrollTo(y, callback){
        var startValue = getScroll();
        var delta = y - startValue;
        var duration = this.speed;
        var start = Date.now();

        function tick(){
            var progress = Date.now() - start;
            var scrollPos = easeInOutCubic(progress, startValue, delta, duration);

            if(progress < duration){
                setScroll(scrollPos);
                requestAnimationFrame(tick);
            }else{
                if(callback){
                    callback();
                }
            }
        }

        tick();
    };

    return new ScrollJack({
        speed: 1000
    });
})();

var adjustForNavigation = 80;

function onClickLink(link, adjustY){
    return function(e){
        e.preventDefault();

        var id = link.dataset.scrolltoid;
        var linkedNode = document.getElementById(id);
        var top = linkedNode.getBoundingClientRect().top;
        var scrollTop = document.body.scrollTop || window.scrollY || 0;

        scrolljacker.scrollTo(top + scrollTop + adjustY);
    };
}

function bind(adjustY){
    var links = document.querySelectorAll('.scrolljack');

    Array.apply(null, links).forEach(function(link){
        if(!link.dataset.scrolltoid){
            return;
        }
        link.onclick = onClickLink(link, adjustY || 0);
    });
}

if(Element.prototype.getBoundingClientRect && window.requestAnimationFrame && Array.apply){
    requestAnimationFrame(function(){
        var header = document.querySelector('.nav-content');
        var height = header.getBoundingClientRect().height;

        bind(-height);
    });
}
