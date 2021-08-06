import { Compiler, CompilerOption, CompilerRenderFunc} from "./compiler";
import { defaultSetting } from "./default";
import { TemplateError } from "./error";
import { runtime } from "./adapter/runtime";
import { cloneDeep } from "lodash";

function debugRender(error: string, options: CompilerOption): CompilerRenderFunc {
    options.onerror(error, options);
    const render = (data, blocks) => `{Template Error}`;
    // render.mappings = [];
    // render.sourcesContent = [];
    // return render;
    return {
        render,
        mappings: [],
        sourcesContent: [],
        renderCode: '',
    };
}


function compile(source: string | CompilerOption, options: CompilerOption = {}): CompilerRenderFunc {
    if (typeof source !== "string") {
        options = source;
    } else {
        options.source = source;
    }

    options = Object.assign(cloneDeep(defaultSetting), options);
    source = options.source;

    if (options.debug == true) {
        options.cache = false;
        options.minisize = false;
        options.compileDebug = true;
    }
    if (options.compileDebug == true) {
        options.minisize = false;
    }
    // Convert to an absolute path
    if (options.filename) {
        options.filename = options.resolveFilename(options.filename, options);
    }

    const filename = options.filename;
    const cache = options.cache;
    const caches = options.caches;

    // Match cache
    if (cache && filename) {
        const render = caches.get(filename);
        if (render) {
            return render;
        }
    }

    // Loading External Templates
    if (!source) {
        try {
            source = options.loader(filename, options);
            options.source = source as string;
        } catch (error) {
            error = new TemplateError(error);
            if (options.bail) {
                throw error;
            } else {
                return debugRender(error, options);
            }
        }
    }

    let compileFunc: CompilerRenderFunc;
    const compiler = new Compiler(options);
    try {
        compileFunc = compiler.build();
    } catch (error) {
        error = new TemplateError(error);
        if (options.bail) {
            throw error;
        } else {
            return debugRender(error, options);
        }
    }

    function render(data?: object, blocks?: object) {
        try {
            return compileFunc.render(data, blocks);
        } catch (error) {
            // Runtime error to debug mode overload
            if (!options.compileDebug) {
                options.cache = false;
                options.compileDebug = true;
                return compile(options).render(data, blocks);
            }

            error = new TemplateError(error);

            if (options.bail) {
                throw error;
            } else {
                return debugRender(error, options).render(data, blocks);
            }
        }
    }

    // render.mappings = fn.mappings;
    // render.sourcesContent = fn.sourcesContent;
    // render.renderCode = fn.renderCode;
    // render.toString = () => fn.toString();

    if (cache && filename) {
        caches.set(filename, render);
    }
    return {
        render,
        mappings: compileFunc.mappings,
        sourcesContent: compileFunc.sourcesContent,
        renderCode: compileFunc.renderCode,
        toString: () => compileFunc.toString(),
    } as CompilerRenderFunc;
    // return render;
}

// compile.Compiler = Compiler;

export { compile, CompilerOption, defaultSetting, Compiler, runtime };
