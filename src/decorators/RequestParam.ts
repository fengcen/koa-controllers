import { RequestParamMeta, RequestParamOptions } from '../meta/index';

import { addParam } from '../index';

export function RequestParam(name: string, options?: RequestParamOptions) {
    return (target: any, propertyKey: string, index: number) => {
        const meta = <RequestParamMeta>{
            name: name,
            options: options
        };

        addParam(target, propertyKey, index, 'request-param', meta);
    };
}
