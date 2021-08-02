
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
 #### Pre-compilation plugins
 webapck: [webpack-loader-vdes-template](https://github.com/vdesjs/vdes-template/tree/master/packages/webpack-loader-template)

vite: [vite-plguin-vdes-template](https://github.com/vdesjs/vdes-template/tree/master/packages/vite-plguin-vdes-template)

#### Editor plguins
vscode: [plugin](https://github.com/vdesjs/vdes-template/tree/master/packages/vscode-plugin)



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
     {{each target val key}}
     ```
### Variable
```
{{set temp = val}}
```

### Template inheritance
```js
{{extend './layout.vdest'}}
{{block}} ... {{/blokc}}

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


 ## API

