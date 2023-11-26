class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on = (name, cb, once = false) => {
    this.listeners[name] = this.listeners[name] || [];
    this.listeners[name].push({
      fn: cb,
      once,
    });
  }

  emit = (name, ...params) => {
    this.listeners[name] = (this.listeners[name] || []).filter((eachCbDesc) => {
      eachCbDesc.fn(...params);
      if (eachCbDesc.once) {
        return false;
      }
      return true;
    });
  }

  once = (name, cb) => {
    this.on(name, cb, true);
  }

  off = (name, cb) => {
    this.listeners[name] = (this.listeners[name] || []).filter(
      (item) => item.fn !== fn,
    );
  }

  clear = (name) => {
    if (name) {
      this.listeners[name] = [];
      return;
    }
  }
}

export default new EventEmitter();