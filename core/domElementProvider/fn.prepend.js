// Prepend Fn


domElementProvider.prepend = function() {
    var arg = arguments,
        dis = this;

    domElementLoop(arg, function(obj) {
        domElementLoop(dis, function(ele) {
            domElementLoop(obj, function(newObj) {
                insertBefore(newObj, ele);
            });

        });
    });

    return this;
};

domElementProvider.prependTo = function(content) {
    var child = this,
        arg = arguments,
        ins;
    if ($isObject(content)) {
        domElementLoop(arg, function(obj) {
            insertBefore(obj[0], child[0])
        });
    } else {
        var ele = element(content);
        if (ele.length > 0) {
            if (ele.length === 1) {
                insbef(ele[0], child[0]);
            } else {
                ele.prepend(child[0])
            }
        }
    }

    return this;
};