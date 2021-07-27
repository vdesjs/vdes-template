import { Compiler } from "../src/compiler"
import { defaultSetting } from "../src/default"
describe('getVariables', () => {
    // const getVariables = (code) => {
    //     const compiler = new Compiler(null)
    //     const tokens = compiler.getEsTokens(code)
    //     const variables = compiler.getVariables(tokens)
    //     return variables

    // }
    // test('var a, b.c, de', () => {
    //     expect(getVariables('var a, b.c, de')).toEqual(['a', 'b', 'de'])
    // })

    test('', () => {

    })
})

describe('importContext', () => {
    function importContext(code: string) {
        const setting = defaultSetting;
        setting.source = ''
        const compiler = new Compiler(setting);
        compiler.importContext(code);
        return compiler.CONTEXT_MAP;
    }

    expect(importContext('value')).toEqual({
        value: '$data.value',
        $$out: `''`
    })

    expect(importContext('$data')).toEqual({
        $$out: `''`
    })
    // The imponts default contains $escape
    expect(importContext('$escape')).toEqual({
        $$out: `''`,
        $escape: '$imports.$escape'
    })
})

describe('addSource', () => {
    function compileScript(sourceCode: string) {
        const options = Object.assign(defaultSetting, {
            minimize: false,
            source: sourceCode
        })
        const compiler = new Compiler(options);
        return compiler.scripts.map(script => script.code);
    }
    test('source', () => {
        expect(compileScript('hello')).toEqual(['$$out+="hello"'])
        expect(compileScript('hello{{value}}')).toEqual([
            '$$out+="hello"',
            '$$out+=$escape(value)'
        ])
    })

})

describe('parseString', () =>{
    function parseString(str: string) {
        const options = Object.assign(defaultSetting, {
            source: ''
        })
        const compiler = new Compiler(options);
        const token = compiler.getTplTokens(str, defaultSetting.rules, compiler)
        compiler.parseString(token[0])
        return compiler.scripts.map(script => script.code)

    }
    expect(parseString('hello')).toEqual([
        '$$out+="hello"'
    ])
})

describe('parseExpression', () => {
    function parseExpression(exp: string) {
        const compiler = new Compiler(defaultSetting);
        const token = compiler.getTplTokens(exp, defaultSetting.rules, compiler);
        compiler.parseExpression(token[0])
        return compiler.scripts.map(script => script.code)

    }
    expect(parseExpression('{{value}}')).toEqual([
        '$$out+=$escape(value)'
    ])
    expect(parseExpression('{{@value}}')).toEqual([
        '$$out+=value'
    ])
})

describe('checkExpression', () => {
    function checkExpression(exp: string) {
        const compiler = new Compiler(defaultSetting);
        return compiler.checkExpression(exp)
    }
    expect(checkExpression('} else if (a) {')).toEqual(true)
    expect(checkExpression('fn(function(a,b){')).toEqual(true)
    expect(checkExpression('if(a){')).toEqual(true)
    expect(checkExpression('@if')).toEqual(false)
})
