import {compile, defaultSetting, CompilerOption, runtime} from "@vdes-template/parser";
import { render } from "./render";



export function template(filename: string, content: string | object) {
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