/**
 * 
 * @param {*} reverse 
 */
domElementProvider.hash = function(reverse) {
    if ($isArray(this[0]) || $isObject(this[0])) {
        var obj = ({});
        domElementLoop(this, function(value, prop) {
            if (reverse) {
                obj[prop] = value;
            } else {
                obj[value] = prop;
            }

        });

        return element(obj);
    }

    return this;
};


domElementProvider.reverseHash = function() {
    return this.hash(true);
};