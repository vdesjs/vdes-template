
import { CompilerOption } from "../compiler";
import {compile} from "../index";
export function include(filename: string, data: object, blocks: object, options: CompilerOption) {
    options = Object.assign(options, {
        filename: options.resolveFilename(filename, options),
        bail: true,
        source: null
    });
    return compile(options).render(data, blocks);
}
