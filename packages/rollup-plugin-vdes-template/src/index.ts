import { precomileImport, PreCompileOption, PreCompileRetObj } from "vdes-template";

const vdesFileRegex = /\.(vdest)$/;

export default function vdesTempalte(options: PreCompileOption = {}) {
    return {
        name: "vdes-template",
        transform(code, id) {
            if (vdesFileRegex.test(id)) {
                options.filename = id;

                let result: PreCompileRetObj;
                try {
                    result = precomileImport(options);
                } catch (error) {
                    return;
                }
                return {
                    code:  result.toString(),
                };
            }
        },
    };
}
