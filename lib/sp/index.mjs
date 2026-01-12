export class SubscriptionPromise {
  constructor({
    request,
    get,
    subscribe
  }) {
    this.request = request;
    this.get = get;
    this.subscribe = subscribe;
    this.subscriptions = {
      result: [],
      error: []
    };
    // Bind on, so it can be used as a value
    this.on = this.on.bind(this);
    // @ts-ignore
    this.on.request = request;
  }
  get [Symbol.toStringTag]() {
    return "[object SubscriptionPromise]";
  }
  then(onFulfilled, onRejected) {
    return this.resolve().then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.resolve().catch(onRejected);
  }
  finally(onFinally) {
    return this.resolve().finally(onFinally);
  }

  // @ts-ignore: TODO: fix this
  on(callback) {
    if (this.promise) throw new Error("Can't subscribe after awaiting");
    this.subscriptions.result.push(callback);
    if (this.off) {
      // @ts-ignore: TODO: fix this
      if (this.result) callback(this.result, this.subscriptionMeta);
    } else {
      this.off = this.subscribe(
      // @ts-ignore: TODO: fix this
      (result, meta) => {
        this.result = result;
        this.subscriptionMeta = meta;
        this.subscriptions.result.forEach(callback => callback(result, meta));
      }, error => {
        this.error = error;
        this.subscriptions.error.forEach(callback => callback(error));
      });
    }
    const off = () => {
      const index = this.subscriptions.result.indexOf(callback);
      if (index !== -1) this.subscriptions.result.splice(index, 1);

      // If no more subscriptions, unsubscribe and clean up results
      if (!this.subscriptions.result.length && !this.subscriptions.error.length) {
        this.off?.();
        this.off = undefined;
        this.result = undefined;
        this.subscriptionMeta = undefined;
        this.error = undefined;
      }
    };
    const offWithCatch = () => {
      off();
    };
    offWithCatch.catch = errorCallback => {
      if (this.error) errorCallback(this.error);
      this.subscriptions.error.push(errorCallback);
      return () => {
        const index = this.subscriptions.error.indexOf(errorCallback);
        if (index !== -1) this.subscriptions.error.splice(index, 1);
        off();
      };
    };
    return offWithCatch;
  }
  resolve() {
    if (this.off) return Promise.reject(new Error("Can't await after subscribing"));
    if (this.result) return Promise.resolve(this.result);
    if (this.error) return Promise.reject(this.error);
    if (this.promise) return this.promise;
    try {
      this.promise = this.get().then(result => {
        this.result = result;
        return result;
      }).catch(error => {
        this.error = error;
        throw error;
      });
      return this.promise;
    } catch (error) {
      this.error = error;
      return Promise.reject(error);
    }
  }
}
export let TypesaurusSP;