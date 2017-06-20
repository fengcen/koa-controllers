import 'source-map-support/register';
import 'jest';

import { validateNumberMax, validateNumberMin } from '../src/validation/number';
import { validateStringMax, validateStringMin } from '../src/validation/string';

import { validateEmail } from '../src/validation/email';

test('email', () => {
  const isEmail = validateEmail('email');
  expect(() => isEmail('fengcen.love@gmail.com')).not.toThrow();
  expect(() => isEmail('not email')).toThrow();
  expect(() => isEmail('fengcen.love@gmail.')).toThrow();
  expect(() => isEmail('fengcen.love@gmail')).toThrow();
  expect(() => isEmail('fengcen.love@')).toThrow();
  expect(() => isEmail('fengcen.love')).toThrow();
});


test('number min and max', () => {
  const numberMin = validateNumberMin('number', 5);
  expect(() => numberMin(2)).toThrow();
  expect(() => numberMin(7)).not.toThrow();

  const numberMax = validateNumberMax('number', 5);
  expect(() => numberMax(2)).not.toThrow();
  expect(() => numberMax(7)).toThrow();
});


test('string min and max', () => {
  const stringMin = validateStringMin('string', 5);
  expect(() => stringMin('aaaa')).toThrow();
  expect(() => stringMin('aaaaa')).not.toThrow();
  expect(() => stringMin('aaaaaa')).not.toThrow();

  const stringMax = validateStringMax('string', 5);
  expect(() => stringMax('aaaa')).not.toThrow();
  expect(() => stringMax('aaaaa')).not.toThrow();
  expect(() => stringMax('aaaaaa')).toThrow();
});
