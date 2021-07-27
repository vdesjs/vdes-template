import {htmlMinifier} from "../../src/adapter/htmlMinifier"

describe("htmlMinifier", () => {
    const rules = [];
    const htmlMinifierOptions = {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        ignoreCustomFragments: []
    };

    test('html', () => {
        expect(htmlMinifier("hello world", {
            rules,
            htmlMinifierOptions
        })).toMatch('hello world')

        expect(htmlMinifier("<div></div>   <a></a>", {
            rules,
            htmlMinifierOptions
        })).toMatch('<div></div><a></a>')
    })
})