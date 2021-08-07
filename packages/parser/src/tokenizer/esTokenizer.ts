import isKeyword from '../utils/isKeyword';
import { jsTokenReg, matchToToken, JsTokenTypes, JsTokenTypeString} from '../utils/jsToken';

export type EsTokenTypesArray = JsTokenTypes[]

/**
 * js expression conversion tokens
 * @param code 
 * @returns 
 */
export function esTokenizer(code: string): EsTokenTypesArray {
    const tokens: EsTokenTypesArray = code.match(jsTokenReg).map(val => {
        jsTokenReg.lastIndex = 0;
        return matchToToken(jsTokenReg.exec(val));
    }).map(token => {
        if (token.type == JsTokenTypeString.NAME && isKeyword(token.value)) {
            token.type = JsTokenTypeString.KEYWORD;
        }
        return token;
    });
    return tokens;

}

export {JsTokenTypeString};
