import * as path from "path"
import {precompile} from "../src/precompile"
describe("precompile", () => {
    test("testRun", () => {
        console.log(
            precompile({
                filename: path.resolve(__dirname, "./res/file")
            })
        )
    })
})