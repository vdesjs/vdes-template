// @ts-ignore
import {precompile, PreCompileOption, PreCompileRetObj} from "vdes-template";

module.exports = function (source) {
    if (this.cacheable) {
        this.cacheable();
    }
    const options: PreCompileOption = this.getOptions();

    // console.log("source", source)
    // console.log("resourcePath", this.resourcePath)
    // console.log("options", options)

    const callback = this.callback;

    options.source = source;
    options.filename = this.resourcePath;
    options.sourceMap = this.sourceMap;
    options.sourceRoot = process.cwd();
    
    if (options.ignore === undefined) {
		options.ignore = [];
	}
    options.ignore.push(`require`);

    let result: PreCompileRetObj;
    try {
        result = precompile(options);
    } catch (error) {
        callback(error);
        return;
    }
    const code = result.toString();
    const sourceMap: any = result.sourceMap;
    const ast = result.ast;

    if (sourceMap && (!sourceMap.sourcesContent || !sourceMap.sourcesContent.length)) {
		sourceMap.sourcesContent = [source];
	}

    callback(null, code, sourceMap, ast);
    return;
};