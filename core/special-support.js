  //element prototype
  element.support = $isSupport;
  element.events = events;
  element.fn = domElementProvider;
  element.Event = Event;
  element.contains = function(parent, child) {
      return element(parent).contains(child);
  };


  //Extend dom eventlistener 
  //new special event
  var elemsToRemove = element([]);

  function handle_removed_events(e) {
      elemsToRemove.each(function(idx, elem) {
          element(elem).triggerHandler('remove');
      });
  }

  //@Object Special Event for remove
  events.special.remove = {
      setup: function() {
          elemsToRemove = elemsToRemove.add(this);
          if (elemsToRemove.getLength() === 1) {
              element(document).on('jEli.event.remove', handle_removed_events);
          }
      },
      add: function(handleObj) {
          var old_handler;

          function new_handler(ev) {
              var elem = ev.target,
                  isMe = elem === document.body;
              if (!document.body.contains(elem) && !isMe) {
                  old_handler.apply(this, arguments);
                  element(elem).unbind(ev.type);
              }
          };

          if ($isFunction(handleObj)) {
              old_handler = handleObj;
              return new_handler;
          } else {
              old_handler = handleObj.handler;
              handleObj.handler = new_handler;
          }
      },
      remove: function() {
          elemsToRemove = elemsToRemove.not(this);
      }
  };