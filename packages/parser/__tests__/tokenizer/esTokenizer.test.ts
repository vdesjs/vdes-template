import { esTokenizer, JsTokenTypeString} from "../../src/tokenizer/esTokenizer"
describe('esTokenizer', () => {
    test('empty string', () => {
        expect(esTokenizer('')).toEqual([{
            type: JsTokenTypeString.INVALID,
            value: ''
        }])
    })
    test('number', () => {
        expect(esTokenizer('0.99')).toEqual([{
            type: JsTokenTypeString.NUMBER,
            value: '0.99'
        }])
    })
    test('string', () => {
        expect(esTokenizer('"hello"')).toEqual([{
            type: JsTokenTypeString.STRING,
            value: '"hello"',
            closed: true
        }])
    })
    test('comment', () => {
        expect(esTokenizer('/*text*/')).toEqual([
            {
                type: JsTokenTypeString.COMMENT,
                value: '/*text*/',
                closed: true
            }
        ])
    })
    test('punctuator', () => {
        expect(esTokenizer('+')).toEqual([
            {
                type: JsTokenTypeString.PUNCTUATOR,
                value: '+'
            }
        ])
    })
    test('keyword', () => {
        expect(esTokenizer('if')).toEqual([
            {
                type: JsTokenTypeString.KEYWORD,
                value: 'if'
            }
        ])
    })
    test('name', () => {
        expect(esTokenizer('abc')).toEqual([
            {
                type: JsTokenTypeString.NAME,
                value: 'abc'
            }
        ])
    })
    test('expression', () => {
        expect(esTokenizer('a+b')).toEqual([
            {
                type: JsTokenTypeString.NAME,
                value: 'a',
            },
            {
                type: JsTokenTypeString.PUNCTUATOR,
                value: '+'
            },
            {
                type: JsTokenTypeString.NAME,
                value: 'b'
            }
           
        ])
    })

})