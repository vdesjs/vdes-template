import * as path from "path"
import { template } from "../src/index"

describe('template', () => {
    test('', () => {
        expect(
            template(
                path.resolve(__dirname, "./res/file"),
                { val: '!' }
            )
        ).toMatch('hello world!')
    })


});
