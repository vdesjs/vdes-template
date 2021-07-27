import { resolveFilename } from "../../src/adapter/resolveFilename"
const path = require('path')
describe("resolveFilename", () => {
    test('reslove', () => {
        expect(resolveFilename('header.html', {
            root: '/'
        })).toMatch(path.resolve('/', 'header.html'))

        expect(resolveFilename('./header.html', {
            filename: '/a/w/f.html'
        })).toMatch(path.resolve('/a/w/header.html'))

        expect(resolveFilename('C:\\ffe\\wet\\dd.html', {
            root: '/'
        })).toMatch(path.resolve('C:\\ffe\\wet\\dd.html'))

    })

})