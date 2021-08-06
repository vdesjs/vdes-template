import vdesTempate from "../../lib/index"


module.exports = {
    input: 'example/rollup/src/index.js',
    output: {
        file: 'example/rollup/dist/index.js',
        format: 'iife',
    },
    plugins: [
        vdesTempate()
    ]
}