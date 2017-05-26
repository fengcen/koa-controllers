koa-controllers
---------------

Koa controllers with TypeScript Decorators.

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

## Prerequisites
koa 2 or above.


## Installation
```
npm install koa-controllers --save
```
or with [yarn](https://github.com/yarnpkg/yarn):
```
yarn add koa-controllers
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
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
export class CloudController {
    @Get('/')
    public index(@RequestParam('email', { email: true }) email: string) {
        console.log(email);
    }
}
```
