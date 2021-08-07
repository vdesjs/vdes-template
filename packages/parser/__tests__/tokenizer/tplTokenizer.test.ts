import { tplTokenizer, TplTokenType } from '../../src/tokenizer/tplTokenizer'

describe('tplTokenizer', () => {
    const rules = [{
        test: /{{([\w\W]*?)}}/,
        use: (match, code) => {
            return {
                code,
                output: false
            };
        }
    }];


    test(TplTokenType.STRING, () => {
        expect(tplTokenizer('hello', rules)).toEqual([{
            type: TplTokenType.STRING,
            value: 'hello',
            line: 0,
            start: 0,
            end: 5,
            script: null,
        }])
    })

    test(TplTokenType.EXPRESSION, () => {
        expect(tplTokenizer('{{value}}', rules)).toEqual([
            {
                type: TplTokenType.EXPRESSION,
                value: '{{value}}',
                line: 0,
                start: 0,
                end: 9,
                script: {
                    code: 'value',
                    output: false
                }
            }
        ])
    })

    test(TplTokenType.EXPRESSION + '&' + TplTokenType.STRING, () => {
        expect(tplTokenizer('hello\n {{va}}', rules)).toEqual([
            {
                type: TplTokenType.STRING,
                value: 'hello\n ',
                script: null,
                line: 0,
                start: 0,
                end: 7
            },
            {
                type: TplTokenType.EXPRESSION,
                value: '{{va}}',
                script: { code: 'va', output: false },
                line: 1,
                start: 1,
                end: 7
            }
        ])
    })
})

describe('tplTokenizer moreRules', () => {
    const rules = [
        {
            test: /{{{([\w\W]*?)}}}/,
            use: (match, code) => {
                return {
                    code,
                    output: 'escape'
                };
            }
        },
        {
            test: /{{([\w\W]*?)}}/,
            use: (match, code) => {
                return {
                    code,
                    output: false
                };
            }
        },

    ];

    test('hello\n {{a}} {{{aa}}}', () => {
        expect(tplTokenizer('hello\n {{a}} {{{aa}}}', rules)).toEqual([
            {
                type: TplTokenType.STRING,
                value: 'hello\n ',
                script: null,
                line: 0,
                start: 0,
                end: 7
            },
            {
                type: TplTokenType.EXPRESSION,
                value: '{{a}}',
                script: {code: 'a', output: false},
                line: 1,
                start: 1,
                end: 6
            },
            {
                type: TplTokenType.STRING,
                value: ' ',
                script: null,
                line: 1,
                start: 6,
                end: 7,
            },
            {
                type: TplTokenType.EXPRESSION,
                value: '{{{aa}}}',
                script: {code: 'aa', output: 'escape'},
                line:1,
                start: 7,
                end: 15
            }
        ])
    })

})