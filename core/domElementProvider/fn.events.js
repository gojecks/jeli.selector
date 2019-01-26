  /**
   * 
   * @param {*} eventName 
   */
  domElementProvider.triggerHandler = function(eventName) {
      var listener = events._data(eventName, this[0]);
      if (listener.length && this[0].dispatchEvent) {
          this[0].dispatchEvent(listener[0].event);
      }
  };

  /**
   * 
   * @param {*} eventName 
   * @param {*} arg 
   */
  domElementProvider.trigger = function(eventName, arg) {
      var event = element.Event.apply(null, arguments);
      domElementLoop(this, function(ele) {
          ele.dispatchEvent(event);
      });
  };

  domElementProvider.ready = eliready;