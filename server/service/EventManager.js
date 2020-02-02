// @flow
const eventRegistry = new Map();

class EventManager {
  bindEventListener(eventObjCls, eventName, listenerFunction) {

    if (typeof listenerFunction !== 'function') {
      throw 'invalid argument, need a function ';
    }
    const keyName =
      typeof eventObjCls === 'string' ? eventObjCls : eventObjCls.name;
    var targetMap = eventRegistry.get(keyName);
    if (!targetMap) {
      targetMap = new Map();
      targetMap.set(eventName, [listenerFunction]);
      eventRegistry.set(keyName, targetMap);
    } else {
      var listeners = targetMap.get(eventName);
      if (!listeners) {
        targetMap.set(eventName, [listenerFunction]);
      } else {
        listeners.push(listenerFunction);
      }
    }
    return true;
  }

  emitEvents(eventName, eventObjects, data) {
    eventObjects.forEach(element => {
      this.emitEvent(eventName, element, data);
    });
  }

  emitEvent(eventName, eventObject, data) {
    const targetMap =
      typeof eventObject === 'string'
        ? eventRegistry.get(eventObject)
        : eventRegistry.get(eventObject.constructor.name);
    if (targetMap) {
      const listeners = targetMap.get(eventName);
      if (listeners) {
        listeners.map(listener => {
          //console.log('Executing for ', eventName);
          listener(eventObject, data);
        });
      }
    }
  }

  printRegistry() {
    console.log(eventRegistry);
  }
}

export default new EventManager();
