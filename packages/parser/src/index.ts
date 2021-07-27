import { Compiler, CompilerOption } from "./compiler";
import { defaultSetting } from "./default";
import { TemplateError } from "./error";
import { runtime } from "./adapter/runtime";
import {cloneDeep} from "lodash";


const debugRender = (error: string, options: CompilerOption) => {
    options.onerror(error, options);
    const render = () => `{Template Error}`;
    render.mappings = [];
    render.sourcesContent = [];
    return render;
};

function compile(source: string | CompilerOption, options: CompilerOption = {}) {

    if (typeof source !== 'string') {
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

    let fn;
    const compiler = new Compiler(options);
    try {
        fn = compiler.build();
    } catch (error) {
        error = new TemplateError(error);
        if (options.bail) {
            throw error;
        } else {
            return debugRender(error, options);
        }
    }

    const render = (data, blocks) => {
        try {
            return fn(data, blocks);
        } catch (error) {
            // Runtime error to debug mode overload
            if (!options.compileDebug) {
                options.cache = false;
                options.compileDebug = true;
                return compile(options)(data, blocks);
            }

            error = new TemplateError(error);

            if (options.bail) {
                throw error;
            } else {
                return debugRender(error, options)();
            }
        }
    };



    render.mappings = fn.mappings;
    render.sourcesContent = fn.sourcesContent;
    render.renderCode = fn.renderCode;
    render.toString = () => fn.toString();

    if (cache && filename) {
        caches.set(filename, render);
    }

    return render;
}

compile.Compiler = Compiler;

export {compile, CompilerOption, defaultSetting, Compiler, runtime};

