import { CompilerOption } from "../compiler";

const detectNode = typeof window === 'undefined';

export function htmlMinifier(source: string, options: CompilerOption): string {
    if (detectNode) {
        const htmlMinifier = require('html-minifier').minify;
        const htmlMinifierOptions = options.htmlMinifierOptions;
        const ignoreCustomFragments = options.rules.map(rule => rule.test);
        htmlMinifierOptions.ignoreCustomFragments.push(...ignoreCustomFragments);
        source = htmlMinifier(source, htmlMinifierOptions);
    }

    return source;
}