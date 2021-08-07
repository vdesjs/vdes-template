import {runtime} from "../../src/adapter/runtime"

describe('runtime', () => {

    test('$escape', () => {
        const escape = content => {
            return runtime.$escape(content)
        }
        expect(escape(1)).toMatch('1')
        expect(escape(null)).toMatch('')
        expect(escape(undefined)).toMatch('')
        expect(escape([0, 1])).toMatch(JSON.stringify([0, 1]))

        expect(escape('<')).toMatch('&#60;')
        expect(escape('>')).toMatch('&#62;')
        expect(escape('"')).toMatch('&#34;')
        expect(escape("'")).toMatch('&#39;')
        expect(escape('&')).toMatch('&#38;')
    })
    
})