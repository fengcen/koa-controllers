import { addRouter } from '../index';

export function Post(path: string) {
    return (target: any, propertyKey: string) => {
        addRouter(path, target, propertyKey, 'post');
    };
}
