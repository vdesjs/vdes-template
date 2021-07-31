import { defineConfig } from 'vite'
import { name } from './rollup.config.common'
const path = require('path')

export default defineConfig({
    build: {
        outDir: 'testdist',
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'umd'],
            name: 'vdesTemplate',
            fileName: format => `index.${format}.js`  
           
        }
    }
})