import { addRouterMiddleware } from '../index';

export function Before(middleware: any) {
    return (target: any, propertyKey: string) => {
        addRouterMiddleware(middleware, target, propertyKey);
    };
}
