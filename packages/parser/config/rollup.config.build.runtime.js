const common = require("./rollup.config.common")
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
module.exports = {
    // input: 'src/runtime.ts',
    input: 'src/adapter/runtime.ts',
    output: {
        file: 'dist/runtime.js',
        format: 'umd',
        banner: common.banner,
        name: "runtime"
    },
    plugins: [
        // nodePolyfills(),
        // nodeResolve(
        //     {
        //         extensions: ['.js', '.ts'],
        //         resolveOnly: [/^@vdes-template.*$/]
        //     }
        // ),
        // commonjs(
        //     {
        //         extensions: ['.js', '.ts'],
        //     }
        // ),
        common.getCompiler({
            module: 'ES6'
        }),
        // common.getUglify()
    ]
}