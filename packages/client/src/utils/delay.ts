type Resolver<T> = (value: T | PromiseLike<T>) => void;

export const delay = <T>(t: number, v?: T): Promise<T> => {
  return new Promise((resolve: Resolver<T>) => {
    setTimeout(resolve.bind(null, v), t)
  })
};

Promise.prototype.delay = function(t) {
  return this.then(function(v?: any) {
    return delay(t, v);
  });
};

