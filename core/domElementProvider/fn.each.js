  /**
   * 
   * @param {*} obj 
   * @param {*} callback 
   */
  domElementProvider.each = function(obj, callback) {
      var i = 0;

      if ($isFunction(obj)) {
          callback = obj;
          obj = this;
      }

      if (obj.length) {
          while (obj.length > i) {
              callback.call(obj[i], obj[i], i);
              i++;
          }
      }

      return obj;
  };

  /**
   * mapping
   */
  domElementProvider.map = function(fn) {
      if (fn) {
          var _this = this;
          if ($isArray(_this[0])) {
              expect(_this[0]).each(function(item, idx) {
                  _this[0][idx] = fn(item, idx);
              });
          }
      }

      return this;
  }