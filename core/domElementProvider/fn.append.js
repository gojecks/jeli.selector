  /**
   * 
   * @param {*} elements 
   */
  domElementProvider.append = function(elements) {
      var arg = arguments,
          dis = this;
      domElementLoop(arg, function(obj) {
          if ($isString(obj)) {
              obj = element(obj);
          }

          domElementLoop(dis, function(ele) {
              domElementLoop(obj, function(newObj) {
                  ele.appendChild(newObj);

                  if (obj['$object:id']) {
                      ele['$object:id'] = obj['$object:id'];
                  }
              });

          });
      });

      return this;
  };

  /**
   * 
   * @param {*} elements 
   */
  domElementProvider.appendTo = function(elements) {
      var child = this,
          arg = arguments;
      if ($isObject(elements)) {
          domElementLoop(arg, function(obj) {
              obj[0].appendChild(child[0]);
          });
      } else {
          var ele = element(elements);
          if (ele.length > 0) {
              if (ele.length === 1) {
                  ele[0].appendChild(child[0]);
              } else {
                  ele.append(child.clone(1))
              }
          }
      }

      return this;
  };