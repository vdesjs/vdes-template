



export const jsTokenReg = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;

export interface JsTokenTypes {
  type: JsTokenTypeString,
  value: string,
  closed?: boolean
}

export enum JsTokenTypeString {
  COMMENT = "comment",
  REGEX = "regex",
  STRING = "string",
  NUMBER = "number",
  PUNCTUATOR = "punctuator",
  WHITESPACE = "whitespace",
  INVALID = "invalid",
  NAME = "name",
  KEYWORD = "keyword"
}

/**
 * 
 * @param match jsTokenReg.exec(word)
 * @returns 
 */
export function matchToToken(match: any[]): JsTokenTypes {
  const token: JsTokenTypes = { type: JsTokenTypeString.INVALID, value: match[0] };
  if (match[1]) token.type = JsTokenTypeString.STRING, token.closed = !!(match[3] || match[4]);
  else if (match[5]) token.type = JsTokenTypeString.COMMENT;
  else if (match[6]) token.type = JsTokenTypeString.COMMENT, token.closed = !!match[7];
  else if (match[8]) token.type = JsTokenTypeString.REGEX;
  else if (match[9]) token.type = JsTokenTypeString.NUMBER;
  else if (match[10]) token.type = JsTokenTypeString.NAME;
  else if (match[11]) token.type = JsTokenTypeString.PUNCTUATOR;
  else if (match[12]) token.type = JsTokenTypeString.WHITESPACE;
  return token;
}

