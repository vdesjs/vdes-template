import { CompilerOption } from "../compiler";


const detecNode = typeof  window === 'undefined';
export function loader(filename: string, options?: CompilerOption): string {
    if (detecNode) {
        // Node enviorment
        const fs = require('fs');
        return fs.readFileSync(filename, 'utf8');
    } else {
        const elem: any = document.getElementById(filename);
        if (elem == null) {
            throw new Error(`Not Found id is ${filename} Element`);
        }
        return elem.value || elem.innerHTML;
    }
}