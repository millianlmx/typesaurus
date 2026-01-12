import type { TypesaurusCore as Core } from "./core.js";
export declare namespace TypesaurusHelpers {
    interface RetryOptions {
        pattern?: number[];
        bypass?: boolean;
    }
    interface RetryFunction {
        <Request, Result, SubscriptionMeta = undefined>(on: Core.SubscriptionPromiseOn<Request, Result, SubscriptionMeta>, options?: RetryOptions): Core.SubscriptionPromiseOn<Request, Result, SubscriptionMeta>;
    }
    interface SilenceFunction {
        <Result>(promise: Promise<Result>): Promise<Result | void>;
    }
    interface ResolvedFunction {
        <Doc extends Core.Doc<any, any>>(doc: Doc | null | undefined): doc is Doc | null;
    }
}
