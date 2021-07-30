const common = require("./rollup.config.common")
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/vdes-template.esm-browser.js',
        format: 'es',
        banner: common.banner
    },
    plugins: [
        json(),
        nodeResolve(
            {   
                extensions: ['.js', '.ts']
            }
        ),
        commonjs(
            {
                extensions: ['.js', '.ts'],
            }
        ),
        common.getCompiler(),
        // common.getUglify()
    ]
}