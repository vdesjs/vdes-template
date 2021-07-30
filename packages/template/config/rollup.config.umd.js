const common = require("./rollup.config.common")
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import inject from '@rollup/plugin-inject';
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/vdes-template.umd.js',
        format: 'umd',
        name: common.name,
        banner: common.banner,
    },
    plugins: [
        requireResolvePolyfills(),
        nodePolyfills(),
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
       
        
        // getBabelOutputPlugin({
        //     allowAllFormats: true,
        //     presets: ['@babel/preset-env']
        //   }),
        // inject({
        //     global: 'window'
        // })
        // babel({ babelHelpers: 'bundled' }),
        // common.getUglify()
    ]
}

function requireResolvePolyfills() {
    return {
        renderChunk(code, chunk) {
            var replaceCode = code.replace('require.resolve', '(function (path) {return path})')
            return {
                code: replaceCode
            }
        }
    }
}
