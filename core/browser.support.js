// jEli Browser Support
var $isSupport = {
    websql: !!window.openDatabase,
    sqlite: !!window.sqlitePlugin,
    canvas: !!document.createElement('canvas').getContext,
    history: !!(window.history && history.pushState),
    jsonParser: !!(window.JSON && window.JSON.parse),
    domParser: !!(window.DOMParser),
    computedStyle: !!(window.getComputedStyle),
    indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || false,
    localStorage: !!window.localStorage || !1,
    slice: window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice),
    isFormData: window.FormData,
    xhrFileUpload: !!(window.XMLHttpRequestUpload && window.FileReader),
    fileReader: (window.File && window.FileReader && window.FileList && window.Blob),
    webWorker: !!window.Worker,
    intl: !!window.Intl,
    dom: {
        cloning: (function() {
            var div = document.createElement('div'),
                _clone = div.cloneNode();
            div = null;
            return !!_clone;
        })(),
        qsa: !!document.querySelectorAll,
        isValidAttribute: function(tagName, attrName) {
            return attrName in document.createElement(tagName);
        }
    },
    browser: {
        moz: 'MozAppearance' in document.createElement('div').style,
        webkit: 'WebkitAppearance' in document.createElement('div').style,
        msie: 'msTransform' in document.createElement('div').style,
        opera: 'OAppearance' in document.createElement('div').style
    },
    env: {
        android: ((navigator.userAgent.match(/Android/i) || []).length ? true : false),
        blackBerry: ((navigator.userAgent.match(/BlackBerry/i) || []).length ? true : false),
        ios: ((navigator.userAgent.match(/iPhone|iPad|iPod/i) || []).length ? true : false),
        opera: ((navigator.userAgent.match(/Opera Mini/i) || []).length ? true : false),
        windows: ((navigator.userAgent.match(/IEMobile/i) || []).length ? true : false),
        chrome: ((navigator.userAgent.match(/chrome/i) || []).length ? true : false),
        firefox: ((navigator.userAgent.match(/firefox/i) || []).length ? true : false),
        safari: ((navigator.userAgent.match(/safari/i) || []).length ? true : false),
        ie: /Edge\/|Trident\/|MSIE /.test(navigator.userAgent),
        ieG10: /Edge\/|Trident\/| /.test(navigator.userAgent)
    },
    cookieEnabled: navigator.cookieEnabled
};

$isSupport.env.mobile = (function(env) {
    return (env.android || env.blackBerry || env.ios || env.opera || env.windows || false);
})($isSupport.env);

// check for css3 Support
$isSupport.css3 = function(prop) {
    var cs = 'Khtml Moz O Ms Webkit'.split(' '),
        cst = document.createElement('div').style,
        len = cs.length,
        sty = function(key) {
            return '-' + cs[key] + '-' + prop;
        };
    if (prop in cst) {
        return prop;
    }
    while (len--) {
        chk = cs[len] + prop.charAt(0).toUpperCase() + cs[len].slice(1);
        if (chk in cst) {
            return sty(len);
        }
    }
    return false;
};


/*
  @Function serialize object to string
  @Argument (OBJECT)
  @return Query Param eg(foo=bar&bar=foo)
*/
/**
 * 
 * @param {*} obj 
 */
function serialize(obj) {
    if ($isUndefined(obj)) return;
    var param = [],
        buildParams = function(prefix, dn) {
            if ($isArray(dn)) {
                domElementLoop(dn, function(n, i) {
                    if ((/\[\]$/).test(prefix)) {
                        add(prefix, n);
                    } else {
                        buildParams(prefix + "[" + ($isObject(n) ? prefix : "") + "]", n)
                    }
                });
            } else if ($isObject(dn)) {
                for (var name in dn) {
                    buildParams(prefix + "[" + name + "]", dn[name]);
                }
            } else {
                add(prefix, dn);
            }
        },
        add = function(key, value) {
            value = $isFunction(value) ? value() : ($isEmpty(value) ? "" : value);
            param[param.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };

    if ($isArray(obj) && $isObject(obj)) {
        domElementProvider.each(obj, function(i, n) {
            add(i, n)
        });
    } else {
        for (var name in obj) {
            buildParams(name, obj[name]);
        }
    }

    return param.join("&").replace(/%20/g, '+');
}

//@Function unSerialize
/**
 * 
 * @param {*} par 
 */
function unSerialize(par) {
    var ret = {};
    if (!$isUndefined(par) && $isString(par)) {
        expect(par.split("&")).each(function(val, key) {
            if (val) {
                var splitPairs = val.split('=');
                ret[splitPairs[0]] = jSonParser(splitPairs[1]);
            }
        })
    }

    return ret;
}

/**
 * 
 * @param {*} e 
 */
function makeUID(e) {
    var h = '';
    var f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var g = 0; g < e; g++) {
        h += f.charAt(Math.floor(Math.random() * f.length))
    }
    return h
}

/**
 * 
 * @param {*} loop 
 * @param {*} callback 
 */
function domElementLoop(loop, callback) {
    var last = loop.length - 1,
        i = 0;
    while (last >= i) {
        var val = callback(loop[i], i);
        if (val === false) {
            break;
        }
        i++;
    }
}