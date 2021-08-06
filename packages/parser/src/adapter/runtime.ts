
// Determine the object based on the runtime enviroment
const globalThis = typeof self !== 'undefined' ? self
    : typeof window !== 'undefined' ? window
    : typeof global !== 'undefined' ? global : {};

const runtime = Object.create(globalThis);


runtime.$escape = content => textEscape(toString(content));


runtime.$each = (data: any[] | object, callback: Function) => {
    if (Array.isArray(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
            callback(data[i], i);
        }
    } else {
        for (const i in data) {
            callback(data[i], i);
        }
    }
};

function toString(value) {
    if (typeof value !== 'string') {
        if (value === undefined || value === null) {
            value = '';
        } else if (typeof value === 'function') {
            value = toString(value.call(value));
        } else {
            value = JSON.stringify(value);
        }
    }

    return value;
}

// escape text
function textEscape(content: string): string {
    const text = '' + content;

    return text;
    // const regexResult = ESCAPE_REG.exec(html);
    // if (!regexResult) {
    //     return content;
    // }

    // let result = '';
    // let i, lastIndex, char;
    // for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    //     switch (html.charCodeAt(i)) {
    //         case 34:
    //             char = '&#34;';
    //             break;
    //         case 38:
    //             char = '&#38;';
    //             break;
    //         case 39:
    //             char = '&#39;';
    //             break;
    //         case 60:
    //             char = '&#60;';
    //             break;
    //         case 62:
    //             char = '&#62;';
    //             break;
    //         default:
    //             continue;
    //     }

    //     if (lastIndex !== i) {
    //         result += html.substring(lastIndex, i);
    //     }

    //     lastIndex = i + 1;
    //     result += char;
    // }

    // if (lastIndex !== i) {
    //     return result + html.substring(lastIndex, i);
    // } else {
    //     return result;
    // }
}

export {runtime};