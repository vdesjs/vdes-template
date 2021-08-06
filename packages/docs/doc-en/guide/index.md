
## Introduction

### What is vdes-template?

 vdes-template is a javascript template engine, It rewrite in typescript based on the [art-template](https://github.com/aui/art-template).

It uses a tempalte and a input object to genearte any you want code!

If you want use vdes-template in the node enviroment.

```html
// ./aaa.vdest

hello! I am {{name}}
```

```js
// use before make sure run commond: yarn add vdes-template
const vdesTemplate = require('vdes-template') // or import {template} from 'vdes-template'
const genCode = vdesTemplate.template('./aaa.vdest', {
     name: 'vdes-template'
})
console.lgo(genCode) // hello! I am vdes-template
```
If you want use vdes-template in the browser enviroment

```html
<script src='https://unpkg.com/vdes-template@latest/dist/vdes-template.umd.js'> </script>

<script id='aaa.vdest'>
    hello! I am {{name}}
</script>

<script>
const genCode = vdesTemplate.template('./aaa.vdest', {
     name: 'vdes-template'
})
console.log(genCode)
</script>

```


The above code just is an example to help you understand, It is not  recommended to play. 

 ### How to implement?
If the template code is this: 
```text
I am {{name}}
```
First, The code should be converted to an array of text and expression combinnations using a regular expression, like this:

```js
['I am ', '{{name}}']

```
Then, The expression will be parsed and to genarte render function like this:
```js
var render = function ($data) {
     $data = $data || {}
     var $$out = '', name = $data.name
     $$out += "I am "
     $$out += name
     return $$out
}

render({
     name: 'vdes-template'
}) // I am vdes-template
```
Read the render function carefully, I think you should read about how it works. But this is simple example. You want a more detailled understanding of how it works. Please try click the top of menu itme `Playground` to online running!


 ### Installation

 #### npm
 ```shell
 npm install vdes-template

// or
yarn add vdes-template

 ```
 #### browser
 ```js
 <script src='https://unpkg.com/vdes-template@latest/dist/vdes-template.umd.js'> </script>

 ```




 ## Syntax

 ### Output
 ```js
 // inputData: {value}
 {{value}} 
 // inputData: {data: {key}}
 {{data.key}} or {{data['key']}}
// inputData: {arr: ['eeee']}
{{arr[0]}}

{{a ? b : c}}
{{a || b}}
{{a && b}}
{{a + b}}
{{a - b}}

 ```
### Raw output
```js
{{@ value}}

```

### Condition

```js
{{if v1}} .... {{/if}}

{{if v1}} ... {{else if v2}}... {{else}}...  {{/if}}
```

### Loop
```js
{{each target}}
     {{$index}} : {{$value}}
{{/each}}
```
1. `target` supports iteration of array and object.
2. $value and $index can be customized: 
     ```text
     {{each target val index}}
     ```
### Variable
```
{{set temp = val}}
```

### Template inheritance
```js
{{extend './layout.vdest'}}
{{block}} ... {{/block}}

```
Template inheritance allows you to build a basic templating "skeleton" that conaints common parts of your site. Example:
```html
<!-- layout.vdest -->
<head>
     <meat charset="utf-8">
     <title> {{block 'title'}} My site title {{/block}} </title>
</head>
```

```html
<!-- index.vdest -->
{{extend './layout.vdest'}}
{{block 'title'}}vdes-template{{/block}}
```
If render index.vdest. That will output this:
```html
<head>
     <meat charset="utf-8">
     <title>vdes-template</title>
</head>
```
### Sub template
```
{{include './header.vdest'}}
```

### Comments
Support line comments and block comments
```js
// ...

/*...*/
```


## Advanced

### extend runtime
We can extend or modify the runtime to achieve what we want:
```js
import {compile, runtime} from "vdes-template"
const myRuntime = runtime
myRuntime.$hello = () => {
     return "hello world"
}
const text = compile({
     source: '{{$imports.$hello()}}',
     imports: myRuntime 
}).render()
console.log(text) // hello world

```

### Parsing rules
You can customize template parsing rules in vdes-template. The default sysntx:
```
defaultSetting.rules[0].test = /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/
```


 ## options
 ### CompileOptions
 ```javascript
 export interface CompilerOption {
    // Template content. If haven't the field, the content is loaded according to the filename
    source?: string,
    // Template filename
    filename?: string,
    // An array of rules of template syntax
    rules?: TplTokenRule[],
    // Whether to enable automatic encoding of template output statements
    escape?: boolean,
    // Whether to enable to debug mode
    debug?: boolean,
    // If ture, both the compile and runtime errors throw exceptions
    bail?: boolean,
    
    cache?: boolean,
    // Whether to enable minization, It will execute htmlMinifier and minimize HTML, CSS, JS. Only take effect with node enviroment
    minisize?: boolean,
    // Whether to compile in debug mode
    compileDebug?: boolean,
    // Transition template path
    resolveFilename?: (filename: string, options: CompilerOption) => string,
    // Include sub template
    include?: (filename: string, data: object, blocks: object, options: CompilerOption) => string,
    // Html compression, effect only nodejs
    htmlMinifier?: (source: string, options: CompilerOption) => string,
    htmlMinifierOptions?: {
        collapseWhitespace?: boolean,
        minifyCSS?: boolean,
        minifyJS?: boolean,
        ignoreCustomFragments?: any[]
    },
    // Effect only bail=false
    onerror?: (error: any, options?: CompilerOption) => void,
    // Template file loader
    loader?: (filename: string, options?: CompilerOption) => string,
    // Cache adapter
    caches?: Caches,
    // Root directory of template. If filename field is not a local path, template will be found in root directory
    root?: string,
    // Default extension. If no extensions, Extname will be automatically added
    extname?: string,
    // An array of template variables ignored by template compiler
    ignore?: string[],
    // runtime
    imports?: Object

}

 ```

 ### PreCompileOption
```javascript
export type PreCompileOption = CompilerOption & {
    sourceMap?: boolean,
    sourceRoot?: string
}

```

### defaultSetting
```javascript
export const defaultSetting: CompilerOption = {
    source: null,
    filename: null,

    rules: [new VdesTRule()],
    escape: true,
    debug: detectNode ? process.env.NODE_ENV !== 'production' : false,
    bail: true,
    cache: true,
    minisize: false,
    compileDebug: false,
    resolveFilename: resolveFilename,
    include: include,
    htmlMinifier: htmlMinifier,
    htmlMinifierOptions: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        ignoreCustomFragments: []
    },
    onerror: onerror,
    loader: loader,
    caches: new Caches(),
    root: '/',
    extname: '.vdest',
    ignore: [],
    imports: runtime

};


```

 ## API

 ### template

 #### Define:
 * Render templates according to template name
* Content is object,render template and renturn strinng. Content is string, compile template and return function.

 ```javascript
export function template(filename: string, content: string | object): string | Function
```



#### Usages:
```javascript
import {template} from 'vdes-template'

// From local to load template
const text = template('./hello.vdest', {
     val: 'aaaaa'
})

// Compile template and cache it
template('./hello.vdest', 'I am {{val}}')
const text = template('./hello.vdest', {
     val: 'aaaaaa'
})
```

### compile

#### Define
Compile template and renturn a rendering function
```javascript
function compile(source: string | CompilerOption, options: CompilerOption = {}): CompilerRenderFunc

```

#### Usages:
```
import {compile} from "vdes-template"
compile({
     filename: './hello.vdest'
}).render({
     val: 'aaaa'
})
```
### render

#### Define:
Compile and return rendering results
```
export function render(source: string | CompilerOption, data: object, options?: CompilerOption)
```

#### Usages:

```
import {render} from "vdes-template"
render('I am {{val}}', {val: 'aaaa'})

```