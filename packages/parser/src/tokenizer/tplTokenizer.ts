export enum TplTokenType {
    STRING = "string",
    EXPRESSION = "expression",
    RAW = "raw",
    ESCAPE = "escape"
}


export class TplToken {
    type: TplTokenType;
    value: string;
    script: object | null;
    line: number;
    start: number;
    end: number;

    constructor(type: TplTokenType, value: string, prevToken?: TplToken) {
        this.type = type;
        this.value = value;
        this.script = null;
        if (prevToken) {
            this.line = prevToken.line + prevToken.value.split(/\n/).length - 1;
            if (this.line === prevToken.line) {
                this.start = prevToken.end;
            } else {
                this.start = prevToken.value.length - prevToken.value.lastIndexOf('\n') - 1;
            }
        } else {
            this.line = 0;
            this.start = 0;
        }

        this.end = this.start + this.value.length;
    }
}

export interface TplTokenRule {
    test: RegExp,
    use(match: object, raw: string, close: string, code: string): object,
}



/**
 * 
 * @param token 
 * @returns example {0: "s", 1: "a", line: 0, start: 0, end: 1}
 */
function wrapString(token: TplToken) {
    const value: any = new String(token.value);
    value.line = token.line;
    value.start = token.start;
    value.end = token.end;
    return value;
}

/**
 * template conversion tokens
 * @param source 
 * @param rules 
 * @param context 
 * @returns 
 */
export function tplTokenizer(source: string, rules: TplTokenRule[], context = {}): TplToken[] {
    const tokens = [new TplToken(TplTokenType.STRING, source)];

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const flags = rule.test.ignoreCase ? `ig` : `g`;
        const regexp = new RegExp(rule.test.source, flags);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let prevToken = tokens[i - 1];

            if (token.type !== TplTokenType.STRING) {
                continue;
            }

            let match,
                index = 0;
            const substitute = [];
            const value = token.value;

            while ((match = regexp.exec(value)) !== null) {
                if (match.index > index) {
                    prevToken = new TplToken(TplTokenType.STRING, value.slice(index, match.index), prevToken);
                    substitute.push(prevToken);
                }

                prevToken = new TplToken(TplTokenType.EXPRESSION, match[0], prevToken);
                match[0] = wrapString(prevToken);
                prevToken.script = rule.use.apply(context, match);
                substitute.push(prevToken);

                index = match.index + match[0].length;
            }

            if (index < value.length) {
                prevToken = new TplToken(TplTokenType.STRING, value.slice(index), prevToken);
                substitute.push(prevToken);
            }

            tokens.splice(i, 1, ...substitute);
            i += substitute.length - 1;
        }

    }
    return tokens;

}
