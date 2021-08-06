const common = require("./rollup.config.common")
const path = require("path")
const fs = require("fs")
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.cjs.js',
        format: 'cjs',
    },
    plugins: [
        json(),
        // nodeResolve(
        //     {   
        //         extensions: ['.js', '.ts']
        //     }
        // ),
        commonjs(
            {
                extensions: ['.js', '.ts'],
            }
        ),
        common.getCompiler(),
        copyPackageJsonPlugin(),
       
        // common.getUglify()
    ]
}

function copyPackageJsonPlugin() {
    return {
        name: 'copy-package-json',
        generateBundle() {
            const filePath = path.resolve(__dirname, '../package.json')
            console.log("filePath", filePath)
            if (!fs.existsSync(filePath)) {
                throw new Error('package.json not found')
            }
            this.emitFile({
                type: 'asset',
                fileName: 'package.json',
                source: fs.readFileSync(filePath, 'utf-8')
            })
        }
    }
}