# `webpack-loader-vdes-template`

> TODO: Using precomilation, greatly improve the performance of templates in the browser

## Installation

```
yarn add vdes-template

yarn add -D webpack-loader-vdes-template
```

## webpack rule
```js
moudle.exports = {
    module: {
        rules: [
            {
                test: /\.vdest$/,
                loader: 'webpack-loader-vdes-template',
                options: {
                    // {PreCompileOption} from 'vdes-template'
                }
            }
        ]
    }
}
```

## Usage
./yourName.vdest
```text
Hello, I am {{name}}
```

```js
import render from './yourName.vdest'

console.log(render({
    name: 'vdes-template'
})) // Hello, I am vdes-template

```
