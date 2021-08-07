import {CompilerOption} from "./compiler";
import {include} from "./adapter/include";
import { onerror } from "./adapter/onerror";
import { Caches } from "./adapter/caches";
import { loader } from "./adapter/loader";
import {VdesTRule} from "./adapter/vdesTRule";
import { htmlMinifier } from "./adapter/htmlMinifier";
import { resolveFilename } from "./adapter/resolveFilename";
import { runtime } from "./adapter/runtime";
const detectNode = typeof window === 'undefined';

export const defaultSetting: CompilerOption = {
    source: null,
    filename: null,

    rules: [new VdesTRule()],
    escape: true,
    debug: detectNode ? process.env.NODE_ENV !== 'production' : false,
    bail: true,
    cache: true,
    minisize: false,
    compileDebug: false,
    resolveFilename: resolveFilename,
    include: include,
    htmlMinifier: htmlMinifier,
    htmlMinifierOptions: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        ignoreCustomFragments: []
    },
    onerror: onerror,
    loader: loader,
    caches: new Caches(),
    root: '/',
    extname: '.vdest',
    ignore: [],
    imports: runtime

};