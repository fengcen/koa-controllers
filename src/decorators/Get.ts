import { addRouter } from '../index';

export function Get(path: string) {
  return (target: any, propertyKey: string) => {
    addRouter(path, target, propertyKey, 'get');
  };
}
