import { addParam } from '../index';

export function Ctx(target: any, propertyKey: string, index: number) {
    addParam(target, propertyKey, index, 'ctx');
}
