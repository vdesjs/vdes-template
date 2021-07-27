const common = require("./rollup.config.common")
module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        banner: common.banner
    },
    plugins: [
        common.getCompiler(),
        // common.getUglify()
    ]
}