
export class RequestParamError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RequestParamError.prototype);
  }
}
