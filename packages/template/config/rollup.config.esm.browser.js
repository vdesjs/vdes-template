const common = require("./rollup.config.common")
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/vdes-template.esm-browser.js',
        format: 'es',
    },
    plugins: [
        requireResolvePolyfills(),
        nodePolyfills({exclude: 'node_modules/**/*'}),
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

function requireResolvePolyfills() {
    return {
        renderChunk(code, chunk) {
            var replaceCode = code.replace(/require\.resolve/g, '(function (path) {return path})')
            return {
                code: replaceCode
            }
        }
    }
}
