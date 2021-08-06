import {compile} from "../src/index"
import {defaultSetting} from "../src/default"
import { CompilerOption } from "../src/compiler"
const path = require('path')

describe('compile', () => {

    test('output', () => {
        expect(compile('hello {{value}}').render({
            value: 'world'
        })).toMatch('hello world')
        expect(compile('hello {{值}}').render({
            值: 'world'
        })).toMatch('hello world')
        
    })

    test('if', () => {
        const code = `
            {{if val == true}}
                hello
            {{/if}}
        
        `
        expect(compile(code).render({
            val: true
        })).toMatch('hello')
    })
    test('each', () => {
        const code = `{{each list item}}{{item}}{{/each}}`
        expect(compile(code).render({
            list: [1, 2, 3]
        })).toMatch('123')

    })

    test('runtime Error', () => {
        // console.log(compile('hello\n{{list.ffe}}')())

        expect(() => {
            compile('hello\n{{list.ffe}}').render()
        }).toThrow()

        expect(() => {
            compile({
                filename: './eewe234adsfsf.txt'
            }).render()
        }).toThrow()
    })
})

describe('file', () => {
    const myComile = (options: CompilerOption) => {
        options = Object.assign(defaultSetting, options)
        return compile(options);
    }
    expect(myComile({
        filename: path.resolve(__dirname, "./res/file.txt")
    }).render()).toMatch('hello world')

    
    expect(myComile({
        filename: path.resolve(__dirname, "./res/layout/index-include")
    }).render()).toMatch('i am include')

    expect(myComile({
        filename: path.resolve(__dirname, "./res/layout/index-extend")
    }).render()).toMatch('<head>title</head>')


})
