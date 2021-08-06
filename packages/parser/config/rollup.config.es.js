const common = require("./rollup.config.common")
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.es.js',
        format: 'es',
    },
    plugins: [
        // nodeResolve(
        //     {   
        //         extensions: ['.js', '.ts']
        //     }
        // ),
        // commonjs(
        //     {
        //         extensions: ['.js', '.ts'],
        //     }
        // ),
        common.getCompiler(),
        // common.getUglify()
    ]
}