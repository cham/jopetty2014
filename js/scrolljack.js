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

    function ScrollJack(options){
        options = options || {};

        this.duration = options.duration || 1000;
    }

    ScrollJack.prototype.scrollTo = function scrollTo(y, callback){
        var startValue = document.body.scrollTop;
        var duration = this.duration;
        var delta = y - startValue;
        var start = Date.now();

        function tick(){
            var progress = Date.now() - start;
            var scrollPos = easeInOutCubic(progress, startValue, delta, duration);

            if(progress < duration){
                document.body.scrollTop = scrollPos;
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
        duration: 750
    });
})();

var adjustForNavigation = 80;

function onClickLink(link, adjustY){
    return function(e){
        e.preventDefault();

        var id = link.dataset.scrolltoid;
        var linkedNode = document.getElementById(id);
        var top = linkedNode.getBoundingClientRect().top;

        scrolljacker.scrollTo(top + document.body.scrollTop + adjustY);
        window.top.location.hash = id;
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
