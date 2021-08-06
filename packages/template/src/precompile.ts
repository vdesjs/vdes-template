import { compile, defaultSetting, CompilerOption, Compiler } from "@vdes-template/parser";

import * as acorn from "acorn";
import * as estraverse from "estraverse";

import * as escodegen from "escodegen";
import * as sourceMap from "source-map"
import mergeSourceMap from "merge-source-map"
import *  as path from "path"

const runtimePath = require.resolve('./runtime');

export type PreCompileOption = CompilerOption & {
    sourceMap?: boolean,
    sourceRoot?: string
}

export type PreCompileRetObj = {
    code: string,
    ast: object,
    sourceMap: string,
    toString: () => string

}

const LOCAL_MODULE = /^\.+\//;


function getDefaults(options?: PreCompileOption) {
    const setting: PreCompileOption = {
        imports: runtimePath,
        cache: false,
        debug: false,
        bail: true,
        sourceMap: false,
        sourceRoot: options.sourceRoot
    };
    for (const name in options) {
        setting[name] = options[name];
    }
    return Object.assign({}, defaultSetting, setting);
}

// Convert the filename parameter node of the external template file import statement
// All absolute paths are converted to relative paths
const convertFilenameNode = (node, options: PreCompileOption) => {
    if (node.type === 'Literal') {
        const resolvePath = options.resolveFilename(node.value, options);
        const dirname = path.dirname(options.filename);
        const relativePath = path.relative(dirname, resolvePath);

        if (LOCAL_MODULE.test(relativePath)) {
            node.value = relativePath;
        } else {
            node.value = './' + relativePath;
        }

        delete node.raw;
    }

    return node;
};

// Gets the sourceMap of the original render function
const getOldSourceMap = (mappings, { sourceRoot, source, file }) => {
    const oldSourceMap: any = new sourceMap.SourceMapGenerator({
        file,
        sourceRoot
    });

    mappings.forEach(mapping => {
        mapping.source = source;
        oldSourceMap.addMapping(mapping);
    });

    return oldSourceMap.toJSON();
};



export function precompile(options: PreCompileOption = {}): PreCompileRetObj {
    if (typeof options.filename !== 'string') {
        throw Error('precompile(): "options.filename" required');
    }
    options = getDefaults(options);


    let code = null;
    let sourceMap = null;
    let ast = null;
    const imports = options.imports;
    const functions = [Compiler.INCLUDE, Compiler.EXTEND];

    if (typeof imports !== 'string') {
        throw Error(
            'precompile(): "options.imports" is a file. Example:\n' +
            'options: { imports: require.resolve("vdes-template/dist/runtime") }\n'
        );
    } else {
        const detectNode = typeof window === 'undefined';
        if (detectNode) {
            options.imports = require(imports);
        } else {
            options.imports = imports
        }
        
    }
    const isLocalModule = LOCAL_MODULE.test(imports);
    const tplImportsPath = isLocalModule
        ? imports
        : path.relative(path.dirname(options.filename), imports);
    const compileFunc = compile(options);
    code = '(' + compileFunc.toString() + ')';
    ast = acorn.parse(code, {
        locations: options.sourceMap
    });
    let extendNode = null;
    const enter = function (node) {
        if (node.type === 'VariableDeclarator' && functions.indexOf(node.id.name) !== -1) {
            // TODO 对变量覆盖进行抛错
            if (node.id.name === Compiler.INCLUDE) {
                node['init'] = {
                    type: 'FunctionExpression',
                    params: [
                        {
                            type: 'Identifier',
                            name: 'content'
                        }
                    ],
                    body: {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'AssignmentExpression',
                                    operator: '+=',
                                    left: {
                                        type: 'Identifier',
                                        name: Compiler.OUT
                                    },
                                    right: {
                                        type: 'Identifier',
                                        name: 'content'
                                    }
                                }
                            },
                            {
                                type: 'ReturnStatement',
                                argument: {
                                    type: 'Identifier',
                                    name: Compiler.OUT
                                }
                            }
                        ]
                    }
                };
                return node;
            } else {
                this.remove();
            }
        } else if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            functions.indexOf(node.callee.name) !== -1
        ) {
            let replaceNode;
            switch (node.callee.name) {
                case Compiler.EXTEND:
                    extendNode = convertFilenameNode(node.arguments[0], options);
                    replaceNode = {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'Identifier',
                            name: Compiler.FROM
                        },
                        right: {
                            type: 'Literal',
                            value: true
                        }
                    };

                    break;

                case Compiler.INCLUDE:
                    const filename = node.arguments.shift();
                    const filenameNode =
                        filename.name === Compiler.FROM
                            ? extendNode
                            : convertFilenameNode(filename, options);
                    const paramNodes = node.arguments.length
                        ? node.arguments
                        : [
                            {
                                type: 'Identifier',
                                name: Compiler.DATA
                            }
                        ];

                    replaceNode = node;
                    replaceNode['arguments'] = [
                        {
                            type: 'CallExpression',
                            callee: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'require'
                                },
                                arguments: [filenameNode]
                            },
                            arguments: paramNodes
                        }
                    ];

                    break;
            }

            return replaceNode;
        }
    };
    ast = estraverse.replace(ast, {
        enter: enter
    });

    if (options.sourceMap) {
        const sourceRoot = options.sourceRoot;
        const source = path.relative(sourceRoot, options.filename);
        const file = path.basename(source);
        const gen = escodegen.generate(ast, {
            sourceMap: source,
            file: file,
            sourceMapRoot: sourceRoot,
            sourceMapWithCode: true
        });
        code = gen.code;

        const newSourceMap = gen.map.toJSON();
        const oldSourceMap = getOldSourceMap(compileFunc.mappings, {
            sourceRoot,
            source,
            file
        });
        sourceMap = mergeSourceMap(oldSourceMap, newSourceMap);
        sourceMap.file = file;
        sourceMap.sourcesContent = compileFunc.sourcesContent;
    } else {
        code = escodegen.generate(ast);
    }

    code = code.replace(/^\(|\)[;\s]*?$/g, '');
    code =
        'var ' +
        Compiler.IMPORTS +
        ' = require(' +
        JSON.stringify('./' + tplImportsPath) +
        ');\n' +
        'module.exports = ' +
        code +
        ';';

    return {
        code,
        ast,
        sourceMap,
        toString: () => code
    };



}

// console.log(precompile({
//     filename: path.resolve(__dirname, "../__tests__/res/include")
// }).toString())

// console.log(getDefaults({
//     sourceMap: true
// }).resoveFilename())



