import * as validator from 'validator';

import { RequestParamError } from '../error/index';

export function validateEmail(name: string): Function {
    return (value: string) => {
        if (!validator.isEmail(value)) {
            throw new RequestParamError(`validate fail: parameter "${name}" is not a valid email: ${value}`);
        }
    };
}
