koa-controllers
===============

[![node](https://img.shields.io/node/v/koa-controllers.svg)](https://nodejs.org)
[![Build Status](https://travis-ci.org/fengcen/koa-controllers.svg?branch=master)](https://travis-ci.org/fengcen/koa-controllers)
[![Build status](https://ci.appveyor.com/api/projects/status/er7h5oy4rl5yb5b0?svg=true)](https://ci.appveyor.com/project/fengcen/koa-controllers)
[![npm](https://img.shields.io/npm/v/koa-controllers.svg)](https://www.npmjs.com/package/koa-controllers)
[![npm](https://img.shields.io/npm/dm/koa-controllers.svg)](https://www.npmjs.com/package/koa-controllers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/fengcen/koa-controllers/master/LICENSE)

Koa controllers with TypeScript Decorators.

## Prerequisites
koa 2 or above.

Node >= 7.6.0

# Table of Contents
* [Installation](#installation)
* [Usage](#usage)
    - [Router Documentation](#router-documentation)
    - [Load Controllers](#load-controllers)
    - [Controller](#controller)
    - [Inject context](#inject-context)
    - [Inject request parameters](#inject-request-parameters)
        * [Optional parameter](#optional-parameter)
        * [String parameter](#string-parameter)
        * [Number parameter](#number-parameter)
        * [Enum parameter](#enum-parameter)
        * [Multipart file parameter](#multipart-file-parameter)
        * [Multiple multipart files parameter](#multiple-multipart-files-parameter)
        * [Other RequestParam options](#other-requestparam-options)
    - [Validation](#validation)
    - [Before Middleware](#before-middleware)

## Installation
```
npm install koa-controllers --save
```
or with [yarn](https://github.com/yarnpkg/yarn):
```
yarn add koa-controllers
```

`reflect-metadata` shim is required:

`npm install reflect-metadata --save`

and make sure to import it before you use koa-controllers:

```typescript
import "reflect-metadata";
```

## Usage
### [Router Documentation](https://github.com/alexmingoia/koa-router)

### Load Controllers
Supported request method:
```
@Get('/')
@Post('/')
```

Load all controller modules:
```typescript
import * as Koa from 'koa';
import { userControllers } from 'koa-controllers';

const app = new Koa();
useControllers(app, __dirname + '/controllers/*.js', {
    multipart: {
        dest: './uploads'
    }
});
app.listen(3000);
```

### Controller
Controller files in `controllers` directory:
```typescript
import { Controller, Get, Ctx } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public async index( @Ctx ctx: any) {
        await ctx.render('/index');
    }
}
```

### Inject context

```typescript
import { Controller, Get, Ctx } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public async index( @Ctx ctx: any) {
        await ctx.render('/index');
    }
}
```

### Inject request parameters

#### Optional parameter
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('username', { required: false }) username: string) {
        console.log(username);
    }
}
```

#### String parameter
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('username') username: string) {
        console.log(username);
    }
}
```

#### Number parameter
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('count') count: number) {
        console.log(count);
    }
}
```

#### Enum parameter
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

enum Color {
    Red,
    Blue
}

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('color', { enum: Color }) color: Color) {
        console.log(color);
    }
}
```

#### Multipart file parameter
```typescript
import { Controller, Get, RequestParam, MultipartFile } from 'koa-controllers';

enum Color {
    Red,
    Blue
}

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('avatar', { file: true }) avatar: MultipartFile) {
        console.log(avatar);
    }
}
```

#### Multiple multipart files parameter
```typescript
import { Controller, Get, RequestParam, MultipartFile } from 'koa-controllers';

enum Color {
    Red,
    Blue
}

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('photos', { file: true, multiple: true }) photos: MultipartFile[]) {
        console.log(photos);
    }
}
```

#### Other RequestParam options
```javascript
{
    required: false, // Defaults to true
    default: any // The default value to use as a fallback when the request parameter is not provided or has an empty value.
                 // Supplying a default value implicitly sets required to false.
}
```

### Validation
`@ReuestParam` support validation.

Limit number value minimum and maximum:
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('count', { min: 5, max: 10 }) count: number) {
        console.log(count);
    }
}
```

Limit string minimum and maximum length:
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('username', { min: 5, max: 10 }) username: string) {
        console.log(username);
    }
}
```

Check string is email:
```typescript
import { Controller, Get, RequestParam } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    public index(@RequestParam('email', { email: true }) email: string) {
        console.log(email);
    }
}
```

### Before Middleware
```typescript
import { Controller, Before, Get, Middleware } from 'koa-controllers';

@Controller
export class MyController {
    @Get('/')
    @Before(Authenticate)
    public index(@Ctx ctx: any) {
        console.log(ctx.user);
    }
}

class Authenticate implements Middleware {
    public middleware = async (ctx: any, next: any) => {
        const user = await getUser(ctx);
        if (user == null) {
            ctx.redirect('/signin');
        } else {
            ctx.user = user;
            await next();   // Notice: Don't forget `await`, or you will get '404 NOT FOUND'.
        }
    }
}
```

## LICENSE
koa-controllers is primarily distributed under the terms of the MIT license.
See [LICENSE](LICENSE) for details.
