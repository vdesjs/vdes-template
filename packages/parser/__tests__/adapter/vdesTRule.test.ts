import { VdesTRule } from "../../src/adapter/vdesTRule"
import { esTokenizer } from "../../src/tokenizer/esTokenizer"
function callRule(code): {
    code: string,
    output: any,
} {
    const compiler = {
        options: {},
        getEsTokens: esTokenizer
    }
    const vdesRule = new VdesTRule()
    const list = code.match(vdesRule.test)
    // wrapString
    list[0] = new String(list[0]);
    list[0].line = 0;
    list[0].start = 0;
    return vdesRule.use.apply(compiler, list); 

}

describe('vdestRule', () => {
    test("set", () => {
        expect(callRule('{{set a = b}}')).toEqual({
            code: 'var a = b',
            output: false
        })
        expect(callRule('{{ set a = b }}')).toEqual({
            code: 'var a = b',
            output: false
        })
        expect(callRule('{{set a = b, c = 1}}')).toEqual({
            code: 'var a = b, c = 1',
            output: false
        })
    })

    test("if", () => {
        expect(callRule('{{if value}}')).toEqual({
            code: 'if(value){',
            output: false
        })
        expect(callRule('{{ if value }}')).toEqual({
            code: 'if(value){',
            output: false
        })
        expect(callRule('{{if a + b === 4}}')).toEqual({
            code: 'if(a + b === 4){',
            output: false
        })
        expect(callRule('{{ if (a + b) * c}}')).toEqual({
            code: 'if((a + b) * c){',
            output: false
        })
        expect(callRule('{{/if}}')).toEqual({
            code: '}',
            output: false
        })

    })
    test('else if', () => {
        expect(callRule('{{else if value}}')).toEqual({
            code: '}else if(value){',
            output: false
        })
        expect(callRule('{{ else if value }}')).toEqual({
            code: "}else if(value){",
            output: false
        })
        expect(callRule('{{else if (a + b) * c}}')).toEqual({
            code: '}else if((a + b) * c){',
            output: false
        })
    })
    test('else', () => {
        expect(callRule('{{else}}')).toEqual({
            code: '}else{',
            output: false
        })
    })

    test('each', () => {
        expect(callRule('{{each}}')).toEqual({
            code: '$each($data,function($value,$index){',
            output: false
        })
        expect(callRule('{{each list}}')).toEqual({
            code: '$each(list,function($value,$index){',
            output: false
        })
        expect(callRule('{{each list item}}')).toEqual({
            code: '$each(list,function(item,$index){',
            output: false
        })
        expect(callRule('{{each list item i}}')).toEqual({
            code: '$each(list,function(item,i){',
            output: false
        })
        expect(callRule('{{/each}}')).toEqual({
            code: '})',
            output: false
        })

    })
    test('block', () => {
        expect(callRule(`{{block 'header'}}`)).toEqual({
            code: `block('header',function(){`,
            output: false
        })
    })

    test('include', () => {
        expect(callRule(`{{include 'header'}}`)).toEqual({
            code: `include('header')`,
            output: false
        })
        expect(callRule(`{{include 'header' data}}`)).toEqual({
            code:`include('header',data)`,
            output: false
        })
    })

    test('extend', () => {
        expect(callRule(`{{extend 'header'}}`)).toEqual({
            code: `extend('header')`,
            output: false
        })
        expect(callRule(`{{extend('header')}}`)).toEqual({
            code: `extend('header')`,
            output: 'escape'
        })
    })

    test('output', () => {
        expect(callRule(`{{value}}`)).toEqual({
            code: 'value',
            output: 'escape'
        })
        expect(callRule(`{{@value}}`)).toEqual({
            code: 'value',
            output: 'raw'
        })
    })

    test('filter', () => {
        expect(callRule(`{{a | b | c}}`)).toEqual({
            code: `$imports.c($imports.b(a))`,
            output: 'escape'
        })

        expect(callRule(`{{time | dateFormat 'yyyy-MM-dd'}}`)).toEqual({
            code: `$imports.dateFormat(time,'yyyy-MM-dd')`,
            output: 'escape'
        })
    })

    test('_split', () => {
        expect(VdesTRule._split(esTokenizer(` a b c`))).toEqual([
            'a',
            'b',
            'c'
        ])
        expect(VdesTRule._split(esTokenizer(` a[b]   c `))).toEqual([
            'a[b]',
            'c',
        ])
    })

})