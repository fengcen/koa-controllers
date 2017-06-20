import { RequestParamError } from '../error/index';

export function validateNumberMin(name: string, min: number): (value: number) => void {
  return (value: number) => {
    if (value < min) {
      throw new RequestParamError(`validates fail: parameter "${name}" is smaller than ${min}`);
    }
  };
}

export function validateNumberMax(name: string, min: number): (value: number) => void {
  return (value: number) => {
    if (value > min) {
      throw new RequestParamError(`validates fail: parameter "${name}" is smaller than ${min}`);
    }
  };
}
