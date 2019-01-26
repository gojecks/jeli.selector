(function() {
    // jEli DOM Manipulation
    // simple Library that works like jQuery
    // created 11-10-15 6:45pm
    //This functionality extends jEli element

    if (window.jQuery) {
        return false;
    }

    'use strict';

    var FX = ({
        easing: {
            linear: function(progress) {
                return progress;
            },
            quadratic: function(progress) {
                return Math.pow(progress, 2);
            },
            swing: function(progress) {
                return 0.5 - Math.cos(progress * Math.PI) / 2;
            },
            circ: function(progress) {
                return 1 - Math.sin(Math.acos(progress));
            },
            back: function(progress, x) {
                return Math.pow(progress, 2) * ((x + 1) * progress - x);
            },
            bounce: function(progress) {
                for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                    if (progress >= (7 - 4 * a) / 11) {
                        return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                    }
                }
            },
            elastic: function(progress, x) {
                return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
            }
        }
    });


    function $animate(options) {
        var start = new Date;
        if (typeof options.duration === 'string') {
            switch (options.duration) {
                case ('fast'):
                    options.duration = 100;
                    break;
                case ('slow'):
                    options.duration = 1000;
                    break
            }
        }
        var id = setInterval(function() {
            var timePassed = new Date - start;
            var progress = timePassed / options.duration;
            if (progress > 1) {
                progress = 1;
            }
            options.progress = progress;
            var delta = options.delta(progress);
            options.step(delta);
            if (progress == 1) {
                clearInterval(id);
                options.complete();
            }
        }, options.delay || 10);
    }

    function fireCallback(callback, d) {
        if (callback && jEli.$isFunction(callback)) {
            callback.call(d);
        }
    }

    //@Function Name animate
    //Arguments 3 {OPTIONS} , NUMBER , FUNCTION
    //@return jEli Instance
    jEli.dom.fn.animate = function(options, speed, callback) {
        var len = this.length;
        while (len--) {
            var ele = this[len];
            $animate({
                duration: speed,
                delta: function(progress) {
                    progress = this.progress;
                    return FX.easing.swing(progress);
                },
                complete: callback || function() {},
                step: function(delta) {
                    for (var opts in options) {
                        ele.style[opts] = Math.floor(options[opts] * delta) + 'px';
                    };
                }
            });
        }

        return this;
    };


    jEli.dom.fn.hide = function(speed, callback) {
        speed = speed || 100,
            jEli.dom.fn.each(this, function(i, ele) {
                if (jEli.$isUndefined(ele)) {
                    return;
                }

                //animate the ele
                jEli.dom.fn.animate({ display: "none" }, speed, callback);
            });

        return this;
    };

    jEli.dom.fn.show = function(speed, callback) {
        speed = speed || 100,
            jEli.dom.fn.each(this, function(i, ele) {
                if (jEli.$isUndefined(ele)) {
                    return;
                }

                //animate the ele
                jEli.dom.fn.animate({ display: "block" }, speed, callback);
            });

        return this;
    };



    function fadeFN(to, style, speed, callback) {
        $animate({
            duration: speed,
            delta: function(progress) {
                progress = this.progress;
                return FX.easing.swing(progress);
            },
            complete: function() {
                ele.style.display = style;
                done = 1;
            },
            step: function(delta) {
                ele.style.opacity = to + delta;
            }
        });
    }

    jEli.dom.fn.fadeIn = function(speed, callback) {
        speed = speed || 1000;
        var done = !1;
        jEli.dom.fn.each(this, function(i, ele) {
            fadeFN(0, 'block', speed, callback);
        });

        fireCallback(callback, this);

        return this;
    };

    jEli.dom.fn.fadeOut = function(speed, callback) {
        speed = speed || 1000;
        jEli.dom.fn.each(this, function(i, ele) {
            fadeFN(1, 'none', speed, callback);
        });

        fireCallback(callback, this);

        return this;
    };



    jEli.dom.fn.slideUp = function(speed, callback) {
        speed = speed || 1000;
        jEli.dom.fn.each(this, function(i, ele) {
            var hgt = ele.clientHeight,
                lst = hgt;
            $animate({
                duration: speed,
                delta: function(progress) {
                    progress = this.progress;
                    return FX.easing.swing(progress);
                },
                complete: function() {
                    ele.style.display = 'none';
                    ele.style.height = lst + 'px';
                },
                step: function(delta) {
                    ele.style.height = Math.floor(hgt - (hgt * delta)) + 'px';
                    ele.style.overflow = 'hidden';
                }
            });
        });

        fireCallback(callback, this);
        return this;
    };

    jEli.dom.fn.slideDown = function(speed, callback) {
        speed = speed || 1000;
        jEli.dom.fn.each(this, function(i, ele) {
            var hgt = parseInt(ele.style.height);
            ele.style.height = '0px';
            ele.style.display = '';
            $animate({
                duration: speed,
                delta: function(progress) {
                    progress = this.progress;
                    return FX.easing.swing(progress);
                },
                complete: function() {
                    ele.style.overflow = 'auto';
                },
                step: function(delta) {
                    ele.style.height = Math.floor(0 + (hgt * delta)) + 'px';
                    ele.style.overflow = 'hidden';
                }
            });
        });

        fireCallback(callback, this);
        return this;
    };

    jEli.dom.fn.toggleSlide = function() {
        jEli.dom.fn[(this[0].style.display === 'none') ? 'slideDown' : 'slideUp'].call(this);
        return this;
    };


})();