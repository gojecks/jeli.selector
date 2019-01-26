/**
 * 
 * @param {*} data 
 */
domElementProvider.getLength = function(data) {
    data = $isUndefined(data) ? this[0] : data;

    return $isArray(data) ? data.length : $countObject(data);
};

domElementProvider.jID = function() {
    var ele = this[0],
        mkid = function() {
            var kid = ele.tagName.toLowerCase() + '_' + makeUID(10);
            ele.id = kid;
            return kid
        };
    if (ele.id) {
        return ele.id
    } else {
        return mkID();
    }
};

/**
 * 
 * @param {*} index 
 */
domElementProvider.get = function(index) {
    return this[index];
};

/**
 * 
 * @param {*} selector 
 */
domElementProvider.find = function(selector) {
    if (this.length) {
        return findInElement(this, selector);
    }

    return [];
};

domElementProvider.getFirstChild = function() {
    if (this[0].nodeType === document.ELEMENT_NODE && this[0].firstChild) {
        return this[0].firstChild;
    }

    return [];
};

// domElementProvider Not Function
/**
 * 
 * @param {*} obj 
 */
domElementProvider.not = function(obj) {
    return this.is(obj, 1);
};