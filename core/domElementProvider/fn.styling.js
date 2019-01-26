    //domElementProvider.addClass
    domElementProvider.addClass = function(klas) {
        if (!this) return;

        domElementLoop(this, function(ele) {
            if (!$hasClass.call(ele, klas)) {
                var className = ele.className.split(' ');
                className.push(klas);
                ele.className = className.join(' ');
            }
        });

        return this;
    };

    domElementProvider.removeClass = function(klas) {
        if (!this) return;

        domElementLoop(this, function(ele) {
            if ($hasClass.call(ele, klas)) {
                var className = ele.className.split(' ');
                className.splice(className.indexOf(klas), 1);
                ele.className = className.join(' ');
            }
        });

        return this;
    };

    domElementProvider.css = function(name, value) {
        if ((name && !value) && $isString(name)) {
            if ($isSupport.computedStyle) {
                var ret = window.getComputedStyle(this[0])[name];

                return parseInt(ret) || ret;

            } else {
                return;
            }
        }

        //set the style required with the provided value and element
        function setStyle(ele, name, value) {
            ele.style[name] = ($inArray(name, ['width', 'height', 'top', 'bottom', 'left', 'right']) && $isNumber(value)) ? value + 'px' : value;
        }

        domElementLoop(this, function(ele) {
            if (!ele.tagName || $isUndefined(ele)) {
                return;
            }

            if (!$isObject(name) && value) {
                //set the style required
                setStyle(ele, name, value);
            } else {
                for (var o in name) {
                    //set the style required
                    setStyle(ele, o, name[o]);
                }
            }
        });

        return this;
    };

    domElementProvider.hasClass = function(klass) {
        if (!this) return;

        return $hasClass.call(this[0], klass);
    };