import { Middleware } from '../interfaces/Middleware';

export type RequestMethod = 'get' | 'post';
export type Decorator = 'ctx' | 'request-param';

export interface MultipartOptions {
  dest: string;
  storage?: any;
  limits?: UploadFileLimitOptions;
}
export interface UploadFileLimitOptions {
  fileSize?: number;
  files?: number;
}
export interface ControllerOptions {
  multipart: MultipartOptions;
}

export class RequestParamMeta {
  public name: string;
  public options?: RequestParamOptions;
}

export interface RequestParamOptions {
  enum?: any;
  file?: boolean;
  multiple?: boolean;
  required?: boolean;
  default?: any;

  min?: number;
  max?: number;
  email?: boolean;
}

export interface MethodParamMeta {
  decorator: Decorator;
  additionalMeta?: RequestParamMeta;
}

export type MethodParamMetas = { [key: number]: MethodParamMeta };

export interface RouterDetail {
  path: string;
  requestMethod: RequestMethod;
  controller: string;
  controllerMethod: string;
  paramTypes: any;
  befores?: Middleware[];
  methodParamMetas?: MethodParamMetas;
}
