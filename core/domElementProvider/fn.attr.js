	/**
	 * 
	 * @param {*} attr 
	 */
	domElementProvider.removeAttr = function(attr) {
	    domElementLoop(this, function(ele) {
	        if ($isUndefined(ele)) return;

	        if (ele.getAttribute(attr)) {
	            ele.removeAttribute(attr);
	        }
	    });

	    return this;
	};

	/**
	 * 
	 * @param {*} name 
	 * @param {*} val 
	 */
	domElementProvider.attr = function(name, val) {
	    var isObjectRef = $isObject(name);
	    if (!val && name && !isObjectRef) {
	        return this[0].getAttribute(name);
	    } else {
	        domElementLoop(this, function(ele) {
	            if (!isObjectRef && val) {
	                ele.setAttribute(name, val);
	            } else {
	                if (isObjectRef) {
	                    expect(name).each(function(value, _name) {
	                        ele.setAttribute(_name, value);
	                    });
	                }
	            }
	        });
	    }

	    return this;
	};