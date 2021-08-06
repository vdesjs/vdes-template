import {compile, defaultSetting, CompilerOption, runtime} from "@vdes-template/parser";
import { render } from "./render";


/**
 * Render templates according to template name
 * @param filename 
 * @param content 
 * @returns Content is object,render template and renturn strinng. 
 *          Content is string, compile template and return function.
 * 
 */
export function template(filename: string, content: string | object): string | Function {
    if (content instanceof Object) {
        return render({filename} as CompilerOption, content);
    } else {
        return compile({
            filename,
            source: content
        }).render;
    }
}

export {defaultSetting, compile, render, CompilerOption, runtime};


export { precompile, PreCompileOption, PreCompileRetObj } from "./precompile";
export {precomileImport} from "./precompileImport"