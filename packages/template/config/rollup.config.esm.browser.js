const common = require("./rollup.config.common")
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
module.exports = {
    input: 'src/index.umd.ts',
    output: {
        file: 'dist/index.esm-browser.js',
        format: 'esm',
        banner: common.banner
    },
    plugins: [
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