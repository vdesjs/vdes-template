const common = require("./rollup.config.common")
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.esm.js',
        format: 'es',
        banner: common.banner
    },
    plugins: [
        requireResolvePolyfills(),
        json(),
        commonjs(),
        common.getCompiler(),
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