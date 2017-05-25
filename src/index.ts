import 'reflect-metadata';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as _ from 'lodash';
import * as bodyParser from 'koa-bodyparser';
import * as glob from 'glob';

const Multer = require('koa-multer');

export * from './decorators/Controller';
export * from './decorators/Get';
export * from './decorators/Post';
export * from './decorators/Ctx';
export * from './decorators/RequestParam';

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
}

interface MethodParamMeta {
    decorator: Decorator;
    additionalMeta?: RequestParamMeta;
}

type MethodParamMetas = { [key: number]: MethodParamMeta };

interface RouterDetail {
    path: string;
    requestMethod: RequestMethod;
    controller: string;
    controllerMethod: string;
    paramTypes: any;
    methodParamMetas?: MethodParamMetas;
}

const router = new Router();
const controllers: { [key: string]: any } = {};
const controllerMethodRouters: { [key: string]: { [key: string]: RouterDetail } } = {};
const controllerMethodParamMetas: { [key: string]: { [key: string]: MethodParamMetas } } = {};
let controllerOptions: ControllerOptions;
let multer: any;

export interface MultipartFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
    buffer?: any;
}

export function useControllers(app: Koa, controllerFiles: string, options: ControllerOptions) {
    controllerOptions = options;
    multer = Multer(options.multipart);
    app.use(bodyParser());
    const files = glob.sync(controllerFiles);
    _.each(files, (file: any) => {
        require(file);
    });
    _.each(controllerMethodRouters, routers => {
        _.each(routers, routerDetail => {
            (router as any)[routerDetail.requestMethod](routerDetail.path, createRouterHandler(routerDetail));
        });
    });
    app.use(router.routes())
        .use(router.allowedMethods());
}

export function addRouter(path: string, target: any, propertyKey: string, method: RequestMethod) {
    const controllerName = target.constructor.name;
    const methodRouters = getMethodRouters(controllerName);
    const metas = controllerMethodParamMetas[controllerName] ?
        controllerMethodParamMetas[controllerName][propertyKey] : undefined;
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    methodRouters[propertyKey] = {
        path: path,
        requestMethod: method,
        controller: controllerName,
        paramTypes: paramTypes,
        controllerMethod: propertyKey,
        methodParamMetas: metas
    };
}

export function addController(target: any) {
    controllers[target.name] = new target();
}

export function addParam(target: any, propertyKey: string, index: number, injector: Decorator, meta?: RequestParamMeta) {
    const params = getMethodParams(target, propertyKey);
    params[index] = {
        decorator: injector,
        additionalMeta: meta
    };
}

function createRouterHandler(routerDetail: RouterDetail): any {
    return async (ctx: any, next: any) => {
        await controllers[routerDetail.controller][routerDetail.controllerMethod].apply(
            controllers[routerDetail.controller], await getHandlerInjectParams(ctx, routerDetail));
        await next();
    };
}

async function getHandlerInjectParams(ctx: any, routerDetail: RouterDetail): Promise<any[]> {
    if (routerDetail.methodParamMetas == null) {
        return [];
    } else {
        const params: any[] = [];
        if (isMultipart(ctx)) {
            await uploadMultipartFile(ctx, routerDetail);
        }

        for (let i = 0, len = _.size(routerDetail.methodParamMetas); i < len; i++) {
            const paramMeta = routerDetail.methodParamMetas[i];
            const paramType = routerDetail.paramTypes[i].name.toLowerCase();
            switch (paramMeta.decorator) {
                case 'ctx':
                    params.push(ctx);
                    break;
                case 'request-param':
                    const requestParamMeta = paramMeta.additionalMeta as RequestParamMeta;
                    if (requestParamMeta == null) {
                        throw new Error('request param options should not be null');
                    }

                    let parsedValue = getRequestParam(ctx, paramType, requestParamMeta);
                    if (parsedValue == null) {
                        if (!isNotRequired(requestParamMeta)) {
                            const defaultValue = getDefault(requestParamMeta);
                            if (defaultValue == null) {
                                throw new Error('required request param is not present: ' + requestParamMeta.name);
                            }
                            parsedValue = defaultValue;
                        }
                    }
                    params.push(parsedValue);
                    break;
                default:
                    throw new Error('unsupport param injector: ' + paramMeta.decorator);
            }
        }
        return params;
    }
}

async function uploadMultipartFile(ctx: any, routerDetail: RouterDetail) {
    const fileFields = getRouterFileFields(routerDetail);
    await multer.fields(fileFields)(ctx);
}

type FileFields = { name: string, maxCount?: number }[];

function getRouterFileFields(routerDetail: RouterDetail): FileFields {
    const fileFields: FileFields = [];
    if (routerDetail.methodParamMetas != null) {
        _.each(routerDetail.methodParamMetas, (paramMeta: MethodParamMeta) => {
            if (paramMeta.decorator === 'request-param'
                && paramMeta.additionalMeta != null
                && paramMeta.additionalMeta.options != null
                && paramMeta.additionalMeta.options.file === true) {
                fileFields.push({
                    name: paramMeta.additionalMeta.name
                });
            }
        });
    }

    return fileFields;
}

function getUploadFile(ctx: any, requestParamMeta: RequestParamMeta): any {
    if (_.isObject(ctx.req.files) && _.isArray(ctx.req.files[requestParamMeta.name])) {
        const files = ctx.req.files[requestParamMeta.name];
        if (requestParamMeta.options && requestParamMeta.options.multiple) {
            return files;
        } else {
            return files[0];
        }
    }
}

function isFile(meta: RequestParamMeta): boolean {
    return !!(meta && meta.options && meta.options.file);
}

function getRequestParam(ctx: any, paramType: string, requestParamMeta: RequestParamMeta): any {
    if (isFile(requestParamMeta)) {
        return getUploadFile(ctx, requestParamMeta);
    }

    if (requestParamMeta === null) {
        return undefined;
    }

    let value: any;

    if (ctx.req.method === 'GET') {
        value = ctx.query[requestParamMeta.name];
    } else if (isWwwFormUrlencoded(ctx)) {
        value = ctx.request.body[requestParamMeta.name];
    } else if (isMultipart(ctx)) {
        value = ctx.req.body[requestParamMeta.name];
    }

    if (value != null) {
        return convertValue(value, paramType, requestParamMeta);
    }
}

function isWwwFormUrlencoded(ctx: any): boolean {
    const contentType = ctx.headers['content-type'];
    return contentType === 'application/x-www-form-urlencoded';
}

function isMultipart(ctx: any): boolean {
    const contentType = ctx.headers['content-type'];
    return typeof contentType === 'string' && contentType.indexOf('multipart/form-data') !== -1;
}

function convertValue(value: any, paramType: string, meta: RequestParamMeta): any {
    if (meta.options != null && meta.options.enum != null) {
        return meta.options.enum[value];
    }

    switch (paramType) {
        case 'number':
            if (value === '') {
                return undefined;
            } else {
                const number = +value;
                if (isNaN(number)) {
                    throw new Error('request param parse fail: invalid number: ' + value);
                }
                return number;
            }
        case 'string':
            return value;
        case 'boolean':
            if (value === 'true') {
                return true;
            } else if (value === 'false') {
                return false;
            } else {
                return !!value;
            }
        default:
            throw new Error('unsupport request param type: ' + paramType);
    }
}

function isNotRequired(meta: RequestParamMeta): boolean {
    return !!(meta && meta.options && meta.options.required === false);
}

function getDefault(meta: RequestParamMeta): any {
    if (meta && meta.options) {
        return meta.options.default;
    }
}

function getMethodParams(target: any, propertyKey: string): MethodParamMetas {
    const controllerName = target.constructor.name;
    if (controllerMethodParamMetas[controllerName] == null) {
        controllerMethodParamMetas[controllerName] = {};
    }
    if (controllerMethodParamMetas[controllerName][propertyKey] == null) {
        controllerMethodParamMetas[controllerName][propertyKey] = {};
    }
    return controllerMethodParamMetas[controllerName][propertyKey];
}

function getMethodRouters(controllerName: string): { [key: string]: RouterDetail } {
    if (controllerMethodRouters[controllerName] == null) {
        controllerMethodRouters[controllerName] = {};
    }
    return controllerMethodRouters[controllerName];
}
