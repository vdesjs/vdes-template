import { loader } from "../../src/adapter/loader"
const path = require('path');
describe('loader', () => {
    test('loader on node', () => {
        const filename = path.resolve(__dirname, '../res/file.txt')
        expect(loader(filename)).toMatch('hello world')
    })
})