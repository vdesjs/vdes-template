const common = require("./rollup.config.common")
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.esm.js',
        format: 'esm',
        banner: common.banner
    },
    plugins: [
        common.getCompiler(),
        // common.getUglify()
    ]
}