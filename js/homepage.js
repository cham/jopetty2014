(function($){
    'use strict';
    // return;
    if(!$){
        return;
    }

    var $window = $(window),
        $nav = $('.stickynav'),
        $clickToActivate = $('.maps-click-to-active'),
        numWigglers = $('.wiggler').length,
        wigglers = $('.wiggler').map(function(i){
            return new DelayedWiggler($(this), i, numWigglers);
        }).toArray(),
        navRestTop = $nav.position().top,
        stuck = false,
        scrollers;

    function buildScrollers(){
        return $('.scrollbg').map(function(){
            return new ScrollEffect($(this));
        }).toArray();
    }

    function DelayedWiggler($node, iterator, totalwigglers){
        var wiggleDelay = 5000,
            wiggleDuration = 3000,
            lastTick = 0;

        if(!window.requestAnimationFrame){
            return;
        }

        $node.removeClass('wiggler');

        function tick(){
            if(Date.now() - lastTick > wiggleDelay * totalwigglers){
                $node.addClass('wiggler');
                setTimeout(function(){
                    $node.removeClass('wiggler');
                }, wiggleDuration);
                lastTick = Date.now();
            }
            requestAnimationFrame(tick);
        }

        setTimeout(tick, wiggleDelay * iterator);
    }

    function ScrollEffect($node){
        var transitionValue = 'background-position 0.2s ease-in-out';

        this.$node = $node;
        this.y = $node.position().top;
        this.height = $node.outerHeight();
        this.startY = 0;
        this.endY = -390;
        this.currentY = 0;

        this.$node.css({
            'background-position': 'center ' + this.startY + 'px',
            '-webkit-transition': transitionValue,
            'transition': transitionValue
        });
    }

    ScrollEffect.prototype.update = function update(windowY, windowHeight){
        var hitzonePadding = 300,
            progress,
            y;

        if((windowY + windowHeight) < this.y - hitzonePadding){
            return;
        }
        if(windowY > (this.y + this.height + hitzonePadding)){
            return;
        }

        progress = (1 + (windowY - this.y) / this.height)/2;
        y = this.startY + Math.floor((this.endY - this.startY) * progress);

        if(y !== this.currentY){
            this.$node.css({
                'background-position': 'center ' + y + 'px'
            });
            this.currentY = y;
        }
    };

    function setNavPosition(){
        var stick = $window.scrollTop() > navRestTop;

        if(stick !== stuck){
            if(stick){
                $nav.addClass('fixed');
            }else{
                $nav.removeClass('fixed');
            }
        }

        stuck = stick;
    }

    function updateScrollers(){
        var scrollY = $window.scrollTop(),
            windowHeight = $(window).height();

        scrollers.forEach(function(scroller){
            scroller.update(scrollY, windowHeight);
        });
    }

    function debounce(cb, debounceMs){
        var debounceTimer = 0;

        return function(){
            var now = Date.now();
            if((now - debounceTimer) < debounceMs){
                return;
            }
            debounceTimer = now;

            cb();
        };
    }

    function throttle(cb, throttleMs){
        var fireCb;

        return function(){
            if(fireCb){
                clearTimeout(fireCb);
            }
            fireCb = setTimeout(cb, throttleMs);
        };
    }

    $(window).bind('scroll', debounce(function(){
        setNavPosition();
    }, 50));
    $(window).bind('scroll', debounce(function(){
        updateScrollers();
    }, 150));

    $(window).bind('resize', throttle(function(){
        scrollers = buildScrollers();
        updateScrollers();
    }, 150));

    scrollers = buildScrollers();
    updateScrollers();
    setNavPosition();

    $clickToActivate.click(function(){
        init_map();
        $(window).bind('resize', throttle(function(){
            init_map();
        }, 500));
        $(this).remove();
    });

})(window.jQuery);
