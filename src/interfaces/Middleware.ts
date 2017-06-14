export interface Middleware {
    middleware(ctx: any, next: any): void;
}
