const common = require("./rollup.config.common")
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.cjs.js',
        format: 'cjs',
    },
    plugins: [
        common.getCompiler()
    ]
}