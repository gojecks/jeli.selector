/**
 * 
 * @param {*} parent 
 */
function $isMyChild(parent) {
    return function(child) {
        return parent && parent.contains(child);
    }
}

//$hasClass
/**
 * 
 * @param {*} klass 
 */
function $hasClass(klass) {
    if (!this) return false

    return (this.className.indexOf(klass) > -1) ? 1 : 0;
}

/**
 * 
 * @param {*} ele 
 * @param {*} elem 
 */
function insertBefore(ele, elem) {
    var ins = (ele.childNodes.length) ? ele.childNodes[0] : ele.childNodes;
    if (ins) {
        ele.insertBefore(elem, ins);
    } else {
        ele.appendChild(elem);
    }
}

// @Function to check for valid Element
/**
 * 
 * @param {*} ele 
 */
function isValidElement(ele) {
    return (('nodeType' in ele || ele === window) && ele.nodeType !== 3 && ele.nodeType !== 8);
}

//extend the domProvider methods
events.addDomMethods();

//element Checker
/**
 * 
 * @param {*} elements 
 */
function elementBuilder(elements) {
    var found = {},
        j = 0;
    if (elements.length) {
        for (var i in elements) {
            if (elements[i].nodeName) {
                found[i] = elements[i];
                j++;
            }
        }
    };

    found.length = j;

    return found;
}

//Check Element
/**
 * 
 * @param {*} query 
 * @param {*} elements 
 */
function elementChecker(query, elements) {
    var i,
        ret = [];
    if (query.match(/[#.:=-]/g) || query.match(new RegExp('\\s'))) {
        for (i in elements) {
            if (elements[i].tagName) {
                ret.push(l[i]);
            }
        }
    } else {
        for (i in elements) {
            if (elements[i].tagName) {
                if ($isEqual(elements[i].tagName.toLowerCase(), query)) {
                    ret.push(elements[i]);
                }
            }
        }
    }

    return elementBuilder(ret);
}
/**
 * 
 * @param {*} ele 
 * @param {*} query 
 */
function findInElement(ele, query) {
    var l;
    if ($isObject(ele) || $isArray(ele)) {
        if (!ele.length && (ele.nodeType === 9 || (ele) === window)) {
            l = element(query);
        } else {
            l = ele[0].querySelectorAll(query);
        }
    } else {
        l = document.querySelectorAll(query, document.querySelector(ele)[0]);
    }

    return elementBuilder(l);
}

//jEli find
/**
 * 
 * @param {*} query 
 */
function find(query) {
    return (this && this.length) ? findInElement(this, query) : findByXpr(query);
}
/**
 * 
 * @param {*} query 
 */
function findByXpr(query) {
    var nquery,
        ret = [];
    if (query.match(/[:]/)) {
        nquery = query.split(':');
        var ele = document.querySelectorAll(nquery[0]);
        if (ele.length) {
            var last = ele.length - 1,
                el, i;
            for (i = 0; i <= last; i++) {
                el = ele[i];
                switch (nquery[1]) {
                    case ('hidden'):
                        if (el.offsetHeight < 1)
                            ret.push(ele[i]);
                        break;
                    case ('visible'):
                        if (el.offsetHeight > 0)
                            ret.push(ele[i]);
                        break;
                }
            };
        }

        return elementBuilder(ret);
    } else {
        return elementBuilder(document.querySelectorAll(query));
    }
}

/**
 * 
 * @param {*} tag 
 */
function ByNew(tag) {
    if (tag.match(/[<>]/g)) {
        return elementBuilder(htmlParser(tag));
    }

    //Create a new DOM Element

    return elementBuilder([document.createElement(tag.replace(/[@]/g, ''))]);
}

/*
  @Function jEliDOM
  @arugments : tag :{STRING} OR {OBJECT} OR {ARRAY}, context : {STRING} OR {OBJECT} OR {ARRAY}
  @return {OBJECT}
  */
function jEliDOM() {}
jEliDOM.prototype.init = function(tag, context) {
    if (!$isUndefined(tag)) {
        function match(type) {
            return typeof tag === type;
        }

        function init() {
            var res;
            if (match('object')) {
                res = {
                    0: tag,
                    length: 1
                };

            } else if (!$isUndefined(context)) {
                res = findInElement(context, tag);
            } else if (match('string') && ((tag.match(/[#.=-]/g) || tag.match(new RegExp('\\s'))) && !tag.match(/[@<>]/g))) {
                res = find(tag);
                res.selector = tag;
                res.context = context;
            } else if (match('string') && tag.match(/[@<>]/g)) {
                res = ByNew(tag);
            } else {
                res = match('string') && find(tag);
            }

            // merge res into Object
            var ret = Object.create(domElementProvider)
            for (var prop in res) {
                ret[prop] = res[prop];
            }

            return ret;
        }

        //use try and catch method to check if jQuery is Available
        return init();
    }
};


//@Function jEli DOM
/**
 * 
 * @param {*} tag 
 * @param {*} context 
 */
function element() {
    return new jEliDOM().init.apply(null, arguments);
}

/*
  jQuery Resolver
  if jQuery is present use it else use jEliQuery
*/
/**
 * 
 * @param {*} ele 
 */
function jQueryResolver(ele) {
    return element(ele)
}