  /**
   * retrieve the Model binded to the current element
   */
  domElementProvider.jModel = function() {
      if (!ProviderService.jDebugProvider.$disableDebugMode) {
          return $modelMapping.$get(this.data('jModel'));
      }

      return undefined;
  };

  domElementProvider.injector = function() {
      if (this[0] === $compileTracker.lastCompiledWith) {
          return new DependencyInjectorService(1);
      }

      return undefined;
  };