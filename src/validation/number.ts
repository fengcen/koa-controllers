
export function validateNumberMin(name: string, min: number): Function {
    return (value: number) => {
        if (value < min) {
            throw new Error(`validates fail: parameter "${name}" is smaller than ${min}`);
        }
    };
}

export function validateNumberMax(name: string, min: number): Function {
    return (value: number) => {
        if (value > min) {
            throw new Error(`validates fail: parameter "${name}" is smaller than ${min}`);
        }
    };
}
