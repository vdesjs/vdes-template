import {compile, defaultSetting, CompilerOption} from "@vdes-template/parser";
import { render } from "./render";



export function template(filename: string, content: string | object) {
    if (content instanceof Object) {
        return render({filename} as CompilerOption, content);
    } else {
        return compile({
            filename,
            source: content
        });
    }
}

export {defaultSetting, compile, render, CompilerOption};


export { precompile, PreCompileOption, PreCompileRetObj } from "./precompile";