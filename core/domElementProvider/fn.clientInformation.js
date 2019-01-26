  domElementProvider.height = function() {
      return this[0].clientHeight || this[0].innerHeight || -1;
  };

  domElementProvider.width = function() {
      return this[0].clientWidth || this[0].innerWidth || -1;
  };

  domElementProvider.outerWidth = function() {
      return this[0].offsetWidth || -1;
  };

  domElementProvider.outerHeight = function() {
      return this[0].offsetHeight || -1;
  };

  domElementProvider.position = function() {
      var el = this[0];
      return {
          left: el.offsetLeft,
          top: el.offsetTop
      };
  };