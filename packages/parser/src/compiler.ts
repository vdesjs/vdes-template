
import { Caches } from "./adapter/caches";
import { esTokenizer, EsTokenTypesArray, JsTokenTypeString } from "./tokenizer/esTokenizer";
import { TplToken, tplTokenizer, TplTokenRule, TplTokenType } from "./tokenizer/tplTokenizer";
export interface CompilerOption {
    // Template content. If haven't the field, the content is loaded according to the filename
    source?: string,
    filename?: string,
    rules?: TplTokenRule[],
    // Whether to enable automatic encoding of template output statements
    escape?: boolean,

    debug?: boolean,
    // If ture, both the compile and runtime errors throw exceptions
    bail?: boolean,
    cache?: boolean,
    minisize?: boolean,
    compileDebug?: boolean,
    // Transition template path
    resolveFilename?: (filename: string, options: CompilerOption) => string,
    // Include sub template
    include?: (filename: string, data: object, blocks: object, options: CompilerOption) => string,
    // Html compression, effect only nodejs
    htmlMinifier?: (source: string, options: CompilerOption) => string,
    htmlMinifierOptions?: {
        collapseWhitespace?: boolean,
        minifyCSS?: boolean,
        minifyJS?: boolean,
        ignoreCustomFragments?: any[]
    },
    // Effect only bail=false
    onerror?: (error: any, options?: CompilerOption) => void,
    // Template file loader
    loader?: (filename: string, options?: CompilerOption) => string,
    caches?: Caches,
    root?: string,
    extname?: string,
    ignore?: string[],
    // runtime
    imports?: Object

}

export type CompilerRenderFunc = {
    render: (data?: object, blocks?: object) => string;
    mappings: any[];
    sourcesContent: any[];
    renderCode: string;
    toString: () => string;
};


export class Compiler {
    // The data refrence passed to the template
    static DATA = '$data';
    // All global variable refrences to external imports
    static IMPORTS = '$imports';
    static ESCAPE = '$escape';
    static EACH = '$each';
    static PRINT = 'print';
    // Include sub template function
    static INCLUDE = 'include';
    // Extend layout template function
    static EXTEND = 'extend';
    // Bock read and write function
    static BLOCK = 'block';
    // String concatenation variable
    static OUT = '$$out';
    // The runtime debugs logging variables line by line
    static LINE = '$$line';
    // All block variable
    static BLOCKS = '$$blocks';
    // A function that intercepts a template output stream
    static SLICE = '$$slice';
    // The file address variable of the inherited layout template
    static FROM = '$$from'
    // Compile setting variable
    static OPTIONS = '$$options'

    options: CompilerOption;
    // Stacks for transition code
    stacks: string[];
    // Context for runtime injection
    context: { name: string, value: string }[];
    // The compiled code for the template statement
    scripts: {
        source: string,
        tplToken: TplToken,
        code: string
    }[];
    // Context map caches
    CONTEXT_MAP: object;
    ignore: string[];
    // Build-in variables that are compiled on demand into the template rendering function 
    internal: object;
    // Build-in function dependency declarations
    dependencies: object;
    // source
    source: string;

    constructor(options: CompilerOption) {
        let source = options.source;
        const minisize = options.minisize;
        const htmlMinifier = options.htmlMinifier;

        this.options = options;
        this.stacks = [];
        this.context = [];
        this.scripts = [];
        this.CONTEXT_MAP = {};
        this.ignore = [Compiler.DATA, Compiler.IMPORTS, Compiler.OPTIONS, ...options.ignore];

        this.internal = {
            [Compiler.OUT]: '\'\'',
            [Compiler.LINE]: '[0, 0]',
            [Compiler.BLOCKS]: 'arguments[1]||{}',
            [Compiler.FROM]: 'null',
            [Compiler.PRINT]: `function(){var s=''.concat.apply('',arguments);${Compiler.OUT}+=s;return s}`,
            [Compiler.INCLUDE]: `function(src,data){var s=${Compiler.OPTIONS}.include(src,data||${Compiler.DATA},arguments[2]||${Compiler.BLOCKS},${Compiler.OPTIONS});${Compiler.OUT}+=s;return s}`,
            [Compiler.EXTEND]: `function(from){${Compiler.FROM}=from}`,
            [Compiler.SLICE]: `function(c,p,s){p=${Compiler.OUT};${Compiler.OUT}='';c();s=${Compiler.OUT};${Compiler.OUT}=p+s;return s}`,
            [Compiler.BLOCK]: `function(){var a=arguments,s;if(typeof a[0]==='function'){return ${Compiler.SLICE}(a[0])}else if(${Compiler.FROM}){if(!${Compiler.BLOCKS}[a[0]]){${Compiler.BLOCKS}[a[0]]=${Compiler.SLICE}(a[1])}else{${Compiler.OUT}+=${Compiler.BLOCKS}[a[0]]}}else{s=${Compiler.BLOCKS}[a[0]];if(typeof s==='string'){${Compiler.OUT}+=s}else{s=${Compiler.SLICE}(a[1])}return s}}`
        };
        this.dependencies = {
            [Compiler.PRINT]: [Compiler.OUT],
            [Compiler.INCLUDE]: [Compiler.OUT, Compiler.OPTIONS, Compiler.DATA, Compiler.BLOCKS],
            [Compiler.EXTEND]: [Compiler.FROM, Compiler.INCLUDE],
            [Compiler.BLOCK]: [Compiler.SLICE, Compiler.FROM, Compiler.OUT, Compiler.BLOCKS]
        };
        this.importContext(Compiler.OUT);

        if (options.compileDebug) {
            this.importContext(Compiler.LINE);
        }

        if (minisize) {
            try {
                source = htmlMinifier(source, options);
            } catch (error) { }
        }

        this.source = source;
        this.getTplTokens(source, options.rules, this).forEach(tokens => {
            if (tokens.type === TplTokenType.STRING) {
                this.parseString(tokens);
            } else {
                this.parseExpression(tokens);
            }
        });

    }

    build(): CompilerRenderFunc {
        const options = this.options;
        const context = this.context;
        const scripts = this.scripts;
        const stacks = this.stacks;
        const source = this.source;
        const filename = options.filename;
        const imports = options.imports;
        const mappings = [];
        const extendMode = this.has(this.CONTEXT_MAP, Compiler.EXTEND);

        let offsetLine = 0;

        // Create SourceMap: mapping
        const mapping = (code, { line, start }) => {
            const node = {
                generated: {
                    line: stacks.length + offsetLine + 1,
                    column: 1
                },
                original: {
                    line: line + 1,
                    column: start + 1
                }
            };

            offsetLine += code.split(/\n/).length - 1;
            return node;
        };

        // Trim code
        const trim = code => {
            return code.replace(/^[\t ]+|[\t ]$/g, '');
        };

        stacks.push(`function(${Compiler.DATA}){`);
        stacks.push(`'use strict'`);
        stacks.push(`${Compiler.DATA}=${Compiler.DATA}||{}`);
        stacks.push(`var ` + context.map(({ name, value }) => `${name}=${value}`).join(`,`));

        if (options.compileDebug) {
            stacks.push(`try{`);

            scripts.forEach(script => {
                if (script.tplToken.type === TplTokenType.EXPRESSION) {
                    stacks.push(
                        `${Compiler.LINE}=[${[script.tplToken.line, script.tplToken.start].join(',')}]`
                    );
                }

                mappings.push(mapping(script.code, script.tplToken));
                stacks.push(trim(script.code));
            });

            stacks.push(`}catch(error){`);

            stacks.push(
                'throw {' +
                [
                    `name:'RuntimeError'`,
                    `path:${this.stringify(filename)}`,
                    `message:error.message`,
                    `line:${Compiler.LINE}[0]+1`,
                    `column:${Compiler.LINE}[1]+1`,
                    `source:${this.stringify(source)}`,
                    `stack:error.stack`
                ].join(`,`) +
                '}'
            );

            stacks.push(`}`);
        } else {
            scripts.forEach(script => {
                mappings.push(mapping(script.code, script.tplToken));
                stacks.push(trim(script.code));
            });
        }

        if (extendMode) {
            stacks.push(`${Compiler.OUT}=''`);
            stacks.push(`${Compiler.INCLUDE}(${Compiler.FROM},${Compiler.DATA},${Compiler.BLOCKS})`);
        }

        stacks.push(`return ${Compiler.OUT}`);
        stacks.push(`}`);

        const renderCode = stacks.join(`\n`);

        try {
            const render = new Function(Compiler.IMPORTS, Compiler.OPTIONS, `return ${renderCode}`)(imports, options);
            // result.mappings = mappings;
            // result.renderCode = renderCode;
            // result.sourcesContent = [source];
            // return result;
            return {
                render,
                mappings,
                renderCode,
                sourcesContent: [source],
                toString: () => renderCode
            }
        } catch (error) {
            let index = 0;
            let line = 0;
            let start = 0;
            let generated;

            while (index < scripts.length) {
                const current = scripts[index];
                if (!this.checkExpression(current.code)) {
                    line = current.tplToken.line;
                    start = current.tplToken.start;
                    generated = current.code;
                    break;
                }
                index++;
            }

            throw {
                name: `CompileError`,
                path: filename,
                message: error.message,
                line: line + 1,
                column: start + 1,
                source,
                generated,
                stack: error.stack
            };
        }
    }

    checkExpression(script) {
        // 没有闭合的块级模板语句规则
        // 基于正则规则来补全语法不能保证 100% 准确，
        // 但是在绝大多数情况下足以满足辅助开发调试的需要
        const rules: any = [
            // <% } %>
            // <% }else{ %>
            // <% }else if(a){ %>
            [/^\s*}[\w\W]*?{?[\s;]*$/, ''],

            // <% fn(c,function(a,b){ %>
            // <% fn(c, a=>{ %>
            // <% fn(c,(a,b)=>{ %>
            [/(^[\w\W]*?\([\w\W]*?(?:=>|\([\w\W]*?\))\s*{[\s;]*$)/, '$1})'],

            // <% if(a){ %>
            // <% for(var i in d){ %>
            [/(^[\w\W]*?\([\w\W]*?\)\s*{[\s;]*$)/, '$1}']
        ];

        let index = 0;
        while (index < rules.length) {
            if (rules[index][0].test(script)) {
                script = script.replace(...rules[index]);
                break;
            }
            index++;
        }

        try {
            new Function(script);
            return true;
        } catch (e) {
            return false;
        }
    }

    importContext(name: string) {
        let value = ``;
        const internal = this.internal;
        const dependencies = this.dependencies;
        const ignore = this.ignore;
        const context = this.context;
        const options = this.options;
        const imports = options.imports;
        const contextMap = this.CONTEXT_MAP;

        if (!this.has(contextMap, name) && ignore.indexOf(name) === -1) {
            if (this.has(internal, name)) {
                value = internal[name];

                if (this.has(dependencies, name)) {
                    dependencies[name].forEach(name => this.importContext(name));
                }
            } else if (name === Compiler.ESCAPE || name === Compiler.EACH || this.has(imports, name)) {
                value = `${Compiler.IMPORTS}.${name}`;
            } else {
                value = `${Compiler.DATA}.${name}`;
            }

            contextMap[name] = value;
            context.push({
                name,
                value
            });
        }

    }

    has(object, key) {
        // determine whether an object has thesspecified property as a direct property of that object
        return Object.hasOwnProperty.call(object, key);
    }


    getTplTokens(source: string, rules: TplTokenRule[], context: Compiler): TplToken[] {
        return tplTokenizer(source, rules, context);
    }

    parseExpression(tplToken: TplToken) {
        const source = tplToken.value;
        const script = tplToken.script;
        const output = script.output;
        const escape = this.options.escape;
        let code = script.code;

        if (output) {
            if (escape === false || output === TplTokenType.RAW) {
                code = `${Compiler.OUT}+=${script.code}`;
            } else {
                code = `${Compiler.OUT}+=${Compiler.ESCAPE}(${script.code})`;
            }
        }

        const esToken = this.getEsTokens(code);
        this.getVariables(esToken).forEach(name => this.importContext(name));

        this.scripts.push({
            source,
            tplToken,
            code
        });
    }

    parseString(tplToken: TplToken) {
        let source = tplToken.value;

        if (!source) {
            return;
        }
        
        const commentReg = /(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)/g
        // Remove annotation
        source.match(commentReg)?.map( comment => {
            source = source.replace(comment, '')
        })
    

        const code = `${Compiler.OUT}+=${this.stringify(source)}`;
        this.scripts.push({
            source,
            tplToken,
            code
        });
    }
    stringify(str: string) {
        return JSON.stringify(str);
    }

    /**
     * tempalte expression conversion esTokens
     * @param source 
     * @returns 
     */
    getEsTokens(source: string): EsTokenTypesArray {
        return esTokenizer(source);
    }

    /**
     * get Variable List
     * @param esTokens 
     * @returns 
     */
    getVariables(esTokens: EsTokenTypesArray) {
        let ignore = false;
        return esTokens.filter(esToken => {
            return esToken.type !== JsTokenTypeString.WHITESPACE && esToken.type !== JsTokenTypeString.COMMENT;

        }).filter(esToken => {
            if (esToken.type == JsTokenTypeString.NAME && !ignore) {
                return true;
            }
            ignore = esToken.type == JsTokenTypeString.PUNCTUATOR && esToken.value === '.';
            return false;
        }).map(esToken => esToken.value);
    }


}

// const options = Object.assign(defaultSetting, {
//     minimize: false,
//     source: `{{block 'head'}}hello{{/block}}`
// })

// const compiler = new Compiler(options)

// console.log(compiler.build().renderCode)