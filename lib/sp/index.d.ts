import type { TypesaurusCore } from "../types/core.js";
export declare class SubscriptionPromise<Request, Result, SubscriptionMeta = undefined> implements TypesaurusCore.SubscriptionPromise<Request, Result> {
    private result;
    private subscriptionMeta;
    private error;
    private get;
    private subscribe;
    private promise;
    private off;
    private subscriptions;
    request: Request;
    constructor({ request, get, subscribe, }: TypesaurusSP.Props<Request, Result, SubscriptionMeta>);
    get [Symbol.toStringTag](): string;
    then<FullfillResult = Result, RejectResult = never>(onFulfilled?: ((value: Result) => FullfillResult | PromiseLike<FullfillResult>) | undefined | null, onRejected?: ((reason: any) => RejectResult | PromiseLike<RejectResult>) | undefined | null): Promise<FullfillResult | RejectResult>;
    catch<CatchResult = never>(onRejected?: ((reason: any) => CatchResult | PromiseLike<CatchResult>) | undefined | null): Promise<Result | CatchResult>;
    finally(onFinally?: (() => void) | null | undefined): Promise<Result>;
    on(callback: TypesaurusCore.SubscriptionPromiseCallback<Result, SubscriptionMeta>): TypesaurusCore.OffSubscriptionWithCatch;
    private resolve;
}
export declare namespace TypesaurusSP {
    type Get<Result> = () => Promise<Result>;
    type ResultCallback<Result, SubscriptionMeta> = SubscriptionMeta extends undefined ? (result: Result) => void : (result: Result, meta: SubscriptionMeta) => void;
    type ErrorCallback = (error: Error) => void;
    type Subscribe<Result, SubscriptionMeta> = (resultCallback: ResultCallback<Result, SubscriptionMeta>, errorCallback: ErrorCallback) => TypesaurusCore.OffSubscription;
    interface Props<Request, Result, SubscriptionMeta> {
        request: Request;
        get: Get<Result>;
        subscribe: Subscribe<Result, SubscriptionMeta>;
    }
    interface Subscriptions<Result, SubscriptionMeta> {
        result: ResultCallback<Result, SubscriptionMeta>[];
        error: ErrorCallback[];
    }
}
