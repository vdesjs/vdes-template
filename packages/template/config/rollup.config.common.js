const typescript = require('@rollup/plugin-typescript');
const { uglify } = require('rollup-plugin-uglify')
const pkg = require('../package.json');
const version = pkg.version
const banner =
    `
/**
 * ${pkg.name} ${version}
 */
`
function getCompiler(opt) {
    opt = opt || {
        module: 'ES2015'

    }
    opt = Object.assign({ tsconfig: './tsconfig.json' }, opt)
    return typescript(opt)
}

function getUglify() {
    return uglify()
}

exports.name = "vdesTemplate"
exports.banner = banner
exports.getCompiler = getCompiler
exports.getUglify = getUglify