/**
 * jEli DOM Events
 */
var onReadyBound = false,
    isReady = false,
    DOMContentLoaded,
    readyCallbacks = [],
    cache = [],
    events = {};
// @Function to stop or prevent events
function stop(event) {
    event.preventDefault(event);
    event.stopPropagation(event);
}

//@Function to Fix events
function fix(event, el) {
    if ($isUndefined(event)) {
        var event = window.event;
    }

    //event Stop
    //event.preventDefault
    //event.stopPropagation
    event.stop = function() {
        stop(event);
    };

    //set the event target if its null
    if ($isNull(event.target) || $isUndefined(event.target)) {
        event.target = event.srcElement || el;
    }

    //set the currentTarget if its null
    if ($isNull(event.currentTarget)) {
        event.currentTarget = el;
    }

    if (!event.preventDefault) {
        event.preventDefault = function() {
            event.returnValue = false;
        };
    }

    if (!event.stopPropagation) {
        event.stopPropagation = function() {
            event.cancelBubble = true;
        };
    }
    if (event.target && event.target.nodeType === 3) {
        event.target = event.target.parentNode;
    }
    if (event.pageX == null && event.clientX != null) {
        var doc = document.documentElement,
            body = document.body;
        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }
    return event;
}

//Event Responder
function createResponder(el, handler) {
    return function(event) {
        fix(event, el);
        return handler.apply(el, [event]);
    };
}

/*
  @Function to remove Event from Cached Responder
  @Arguments : key {NUMBER}
  @return: EVENTHANDLER {FUNCTION}
*/
function removeCachedResponder(key) {

    var i = 0,
        responder,
        j = 0;

    for (j = 0; j < cache.length; j++) {
        if (j != key) {
            cache[i++] = cache[j];
        }
    }

    cache.length = i;

    return responder;
}

function IEType(type) {
    if (type.match(/:/)) {
        return type;
    }
    return 'on' + type;
}

function Event(type, arg) {
    //create a new event
    var eventHandler;
    if (window.customEvent) {
        eventHandler = new customEvent(type, { detail: ((arg) ? arg : {}) });
    } else {
        eventHandler = document.createEvent('Event');
        eventHandler.initEvent(type, true, true, ((arg) ? arg : null));
    }

    return eventHandler;
}

/*
  @Object Events extension
  @Function Add Events
  @Arguments : DOM ELEMENT {OBJECT}, EVENTNAME {STRING}, EVENTHANDLER {FUNCTION}
*/
events.add = function(element, type, handler) {
    if (!isValidElement(element)) return;

    //if special events is found
    if (events.special[type]) {
        var listener = events.special[type];
        listener.setup.call(element);
        handler = listener.add(handler);
    }

    var responder = createResponder(element, handler);

    cache.push({
        element: element,
        type: type,
        handler: handler,
        responder: responder,
        event: Event(type)
    });

    if (type.match(/:/) && element.attachEvent) {
        element.attachEvent('ondataavailable', responder);
    } else {
        if (element.addEventListener) {
            element.addEventListener(type, responder, false);
        } else if (element.attachEvent) {
            element.attachEvent(IEType(type), responder);
        }
    }
};

//getEvents from cache
events._data = function(type, element, needsKey) {
    var ret = [];
    for (var c = 0; c < cache.length; c++) {
        if ((cache[c].type === type || !type) && cache[c].element === element) {
            ret.push([cache[c]]);
            if (needsKey) {
                ret[ret.length - 1].push(c);
            }
        }
    }
    return ret;
};

/*
  @Function Remove Events
  @Arguments : DOM ELEMENT {OBJECT}, EVENTNAME {STRING}, EVENTHANDLER {FUNCTION}
  Handler is optional
*/

/**
 * 
 * @param {*} element 
 * @param {*} type 
 * @param {*} handler 
 */
events.remove = function(element, type, handler) {
    //@condition : return if element is not valid
    if (!isValidElement(element)) return;

    // @variable : get the cache event and return {ARRAY}
    var cachedEvent = this._data(type, element, true),
        responder = null;

    if (cachedEvent.length) {
        domElementLoop(cachedEvent, function(_cahched, idx) {
            removeCachedResponder(_cahched[1]);
            // Finally remove the eventListener from the element
            if (document.removeEventListener) {
                element.removeEventListener(_cahched[0].type, _cahched[0].responder, false);
            } else {
                element.detachEvent(IEType(_cahched[0].type), _cahched[0].responder);
            }
        });
    }
};

//@Events ready
/**
 * 
 * @param {*} callback 
 */
events.ready = function(callback) {
    bindOnReady();
    readyCallbacks.push(callback);
};

//custom eventListener Object
events.special = {};

events.addDomMethods = function() {
    if ($isUndefined(domElementProvider)) return;

    domElementProvider.bind = function(type, handler) {
        domElementLoop(this, function(context, index) {
            if (handler) {
                events.add(context, type, handler);
            }
        });

        return this;
    };

    /**
     * 
     * @param {*} type 
     */
    domElementProvider.unbind = function(type) {
        domElementLoop(this, function(context, index) {
            events.remove(context, type);
            //trigger event special event
            if (events.special[type] && events.special[type].remove) {
                events.special[type].remove.call(context);
            }
        });

        return this;
    };

    /**
     * 
     * @param {*} type 
     * @param {*} selector 
     * @param {*} handler 
     */
    domElementProvider.on = function(type, selector, handler) {
        //Type of event is an object
        if ($isObject(type)) {
            var $self = this;
            findInList.call(type, function(a, ev) {
                $self.bind(a, ev);
            });
        } else {
            if (!handler) {
                var handler = selector;
                this.bind(type, handler);
            } else {
                events.delegate(this[0], selector, type, handler);
            }
        }
        return this;
    };

    domElementProvider.off = domElementProvider.unbind;

    var chainedAliases = ('click dblclick mouseover mouseout mousemove ' +
        'mousedown mouseup blur focus change keydown ' +
        'keypress keyup resize scroll').split(' ');
    for (var i = 0; i < chainedAliases.length; i++) {
        (function(name) {
            domElementProvider[name] = function(handler) {
                return this.bind(name, handler);
            };
        })(chainedAliases[i]);
    }
};

//@Function DOM .isReady
/**
 * 
 * @param {*} callback 
 */
function eliready(callback) {
    readyCallbacks.push(callback)
    bindOnReady();
}

//ready state 
function ready() {
    if (!isReady) {
        if (!document.body) {
            return setTimeout(ready, 13);
        }

        isReady = true;
        for (var i in readyCallbacks) {
            readyCallbacks[i]();
        }
        readyCallbacks = null;
    }
}

function DOMReadyScrollCheck() {
    if (isReady) {
        return;
    }

    try {
        document.documentElement.doScroll('left');
    } catch (e) {
        setTimeout(DOMReadyScrollCheck, 1);
        return;
    }
    ready();
}


if (typeof document !== 'undefined') {
    if (document.addEventListener) {
        DOMContentLoaded = function() {
            document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
            ready();
        };
    } else if (document.attachEvent) {
        DOMContentLoaded = function() {
            if (document.readyState === 'complete') {
                document.detachEvent('onreadystatechange', DOMContentLoaded);
                ready();
            }
        };
    }
}


function bindOnReady() {
    if (onReadyBound) return;
    onReadyBound = true;
    if (document.readyState === 'complete') {
        ready();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
        window.addEventListener('load', ready, false);
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', DOMContentLoaded);
        window.attachEvent('onload', ready);
        var toplevel = false;
        try {
            toplevel = window.frameElement == null;
        } catch (e) {}
        if (document.documentElement.doScroll && toplevel) {
            DOMReadyScrollCheck();
        }
    }
}