import * as _ from 'lodash';

import { RequestParamMeta, RequestParamOptions } from '../meta/index';
import { validateNumberMax, validateNumberMin } from './number';
import { validateStringMax, validateStringMin } from './string';

import { validateEmail } from './email';

export function validateValue(value: any, paramType: string, meta: RequestParamMeta) {
  const options = meta.options;

  if (options == null) {
    return;
  }

  if (!existsValidateOption(options)) {
    return;
  }

  _.each(getValidateRules(paramType, meta.name, options), (rule) => {
    rule(value);
  });
}

function getValidateRules(paramType: string, name: string,
  options: RequestParamOptions): Function[] {

  const rules: Function[] = [];

  if (options.email != null) { rules.push(validateEmail(name)); }

  switch (paramType) {
    case 'number':
      if (options.min != null) { rules.push(validateNumberMin(name, options.min)); }
      if (options.max != null) { rules.push(validateNumberMax(name, options.max)); }
      break;
    case 'string':
      if (options.min != null) { rules.push(validateStringMin(name, options.min)); }
      if (options.max != null) { rules.push(validateStringMax(name, options.max)); }
      break;
    default:
      break;
  }
  return rules;
}

function existsValidateOption(options: RequestParamOptions): boolean {
  return options.min != null
    || options.email != null
    || options.max != null;
}
