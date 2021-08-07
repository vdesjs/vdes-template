import * as path from "path"
import { template, runtime, compile} from "../src/index"

describe('template', () => {
    test('', () => {
        expect(
            template(
                path.resolve(__dirname, "./res/file"),
                { val: '!' }
            )
        ).toMatch('hello world!')
    })

    test('extend runtime', () => {
        const myRuntime = runtime
        myRuntime.$hello = () => {
           return "hello world"
        }
        const text = compile({
            source: '{{$imports.$hello()}}',
            imports: myRuntime 
        }).render()
        expect(text).toMatch('hello world')
    })


});
