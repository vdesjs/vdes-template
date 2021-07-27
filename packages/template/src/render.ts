import {compile, CompilerOption} from "@vdes-template/parser";

export function render(source: string | CompilerOption, data: object, options?: CompilerOption) {
    return compile(source, options)(data);
}
