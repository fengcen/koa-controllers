import * as validator from 'validator';

export function validateEmail(name: string): Function {
    return (value: string) => {
        if (!validator.isEmail(value)) {
            throw new Error(`validate fail: parameter "${name}" is not a valid email: ${value}`);
        }
    };
}
