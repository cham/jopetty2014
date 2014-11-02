(function(){
    'use strict';

    function slideWrapper(){
        var wrapper = document.createElement('div');
        wrapper.className = 'tinyslide';
        return wrapper;
    }

    function slideshowContainer(){
        var node = document.createElement('div');
        node.className = 'tinyslides';
        node.style.display = 'block';
        node.style.transition = 'all 1s ease-out';
        return node;
    }

    function navItem(){
        var node = document.createElement('a');
        node.className = 'tinyslide-nav';
        return node;
    }

    function getFirstSlide(rootNode){
        var childNodes = Array.prototype.slice.call(rootNode.childNodes);

        return childNodes.filter(function(node){
            return node.className && node.className.indexOf('tinyslides') === -1;
        });
    }

    function getTailSlides(rootNode, nodesPerSlide){
        var allSlideNodes = Array.prototype.slice.call(rootNode.childNodes).filter(function(node){
            return node.className;
        });

        return allSlideNodes.reduce(function(memo, node, iterator){
            var sliceStart;

            if(iterator % nodesPerSlide === 0){
                sliceStart = memo.length * iterator;
                memo.push(allSlideNodes.slice(sliceStart, sliceStart + nodesPerSlide));
            }

            return memo;
        }, []);
    }

    function setSlides(rootNode, slides){
        var container = slideshowContainer();
        
        rootNode.innerHTML = '';

        slides.forEach(function(nodes){
            var wrapper = slideWrapper();

            nodes.forEach(function(node){
                wrapper.appendChild(node);
            });

            container.appendChild(wrapper);
        });

        rootNode.appendChild(container);
    }

    function lockDom(rootNode){
        var rect = rootNode.getBoundingClientRect();
        rootNode.style.position = 'relative';
        rootNode.style.width = rect.width + 'px';
        rootNode.style.height = (rect.height + 50) + 'px';
    }

    function getSlides(rootNode){
        var firstSlideNodes = getFirstSlide(rootNode);
        var tailSlides = getTailSlides(rootNode.querySelector('.tinyslides'), firstSlideNodes.length);
        return [firstSlideNodes].concat(tailSlides);
    }

    function positionSlides(rootNode){
        var slides = rootNode.querySelectorAll('.tinyslide');
        var width = slides[0].getBoundingClientRect().width;
        var node;
        
        for(var i = 0; i < slides.length; i++){
            node = slides[i];
            node.style.left = (width * i) + 'px';
            node.style.width = width + 'px';
        }
    }

    function buildNav(rootNode, numSlides){
        while(numSlides--){
            rootNode.appendChild(navItem());
        }
    }

    function setActiveNav(rootNode, activeIndex){
        var navNodes = Array.prototype.slice.call(rootNode.querySelectorAll('.tinyslide-nav'));

        navNodes.forEach(function(node, i){
            if(i === activeIndex){
                node.className = 'tinyslide-nav active';
                return;
            }
            node.className = 'tinyslide-nav';
        });
    }

    function listenForNavClick(slideshow){
        var navNodes = Array.prototype.slice.call(slideshow.domNode.querySelectorAll('.tinyslide-nav'));

        function clickHandler(index){
            return function(e){
                e.preventDefault();

                slideshow.running = false;
                setActiveNav(slideshow.domNode, index);
                slideshow.slideNum = (index * slideshow.direction) - slideshow.direction;
                slideshow.nextSlide();
            };
        }

        navNodes.forEach(function(node, i){
            node.onclick = clickHandler(i);
        });
    }

    function prepareDom(slideshow){
        var allSlides = getSlides(slideshow.domNode);

        lockDom(slideshow.domNode);
        setSlides(slideshow.domNode, allSlides);
        buildNav(slideshow.domNode, allSlides.length);
        listenForNavClick(slideshow);
        positionSlides(slideshow.domNode);
    }

    function TinySlideshow(node){
        this.domNode = node;
        this.direction = 1;
        this.running = true;

        prepareDom(this);
        setActiveNav(this.domNode, 0);

        this.start();
    }

    TinySlideshow.prototype.stop = function stop(){
        this.running = false;
    };

    TinySlideshow.prototype.start = function start(){
        var numSlides = this.domNode.querySelectorAll('.tinyslide').length;
        var timePerSlide = 6000;
        var time = Date.now();
        var numTicks = 0;
        var that = this;

        function tick(){
            var now = Date.now();

            if(that.running){
                requestAnimationFrame(tick);
            }

            if(Math.abs(that.slideNum) > numSlides){
                that.reset();
                time = now;
            }
            if(now - time > timePerSlide){
                that.nextSlide();
                time = now;
            }
        }

        tick();
    };

    TinySlideshow.prototype.reset = function(){
        var slides = Array.prototype.slice.call(this.domNode.querySelectorAll('.tinyslide'));
        var slideshow = this.domNode.querySelector('.tinyslides');
        var that = this;

        slideshow.style.transition = 'none';
        slideshow.style.marginLeft = '0px';

        setTimeout(function(){
            slides.forEach(function(slide, i){
                slide.style.left = (i * 860) + 'px';
            });
            slideshow.style.transition = 'all 1s ease-out';
            that.nextSlide();
        }, 10);

        this.slideNum = 0;
    };

    TinySlideshow.prototype.nextSlide = function nextSlide(){
        var slideshowNode = this.domNode.querySelector('.tinyslides');
        var slides = this.domNode.querySelectorAll('.tinyslide');
        var currentSlide = (this.slideNum || 0) + this.direction;
        var slideIndex = Math.abs(currentSlide);

        slides[slideIndex % slides.length].style.left = currentSlide * 860 + 'px';
        slideshowNode.style.marginLeft = (-currentSlide * 860) + 'px';

        setActiveNav(this.domNode, slideIndex === slides.length ? 0 : slideIndex);
        this.slideNum = currentSlide;
    };

    function run(){
        var nodes = document.querySelectorAll('.quote-slideshow');
        var numNodes = nodes.length;
        var slideshow;

        while(numNodes--){
            slideshow = new TinySlideshow(nodes[numNodes]);
        }
    }

    if(document.querySelectorAll && window.requestAnimationFrame && Array.prototype.reduce){
        run();
    }

})();
