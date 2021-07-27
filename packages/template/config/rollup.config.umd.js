const common = require("./rollup.config.common")
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import inject from '@rollup/plugin-inject';
module.exports = {
    input: 'src/index.umd.ts',
    // input: 'src/precompile.ts',
    // input: 'src/test.ts',
    // input: 'lib/index.js',
    output: {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: common.name,
        banner: common.banner,
        // globals: {
        //     fs: "fs",
        //     os: "os",
        //     http: "http",
        //     https: "https",
        //     url: "url",
        //     path: "path"
        // },
        // external: ['fs', 'os', 'http', 'https', 'url', 'path']
    },
    plugins: [
        
        // nodePolyfills(),
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
        common.getCompiler({
            module: 'es2015'
        }),
       
        
        // getBabelOutputPlugin({
        //     allowAllFormats: true,
        //     presets: ['@babel/preset-env']
        //   }),
        // inject({
        //     global: 'window'
        // })
        // babel({ babelHelpers: 'bundled' }),
        common.getUglify()
    ]
}