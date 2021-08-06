import { CompilerOption } from "../compiler";

const detectNode = typeof window === 'undefined';
const LOCAL_MODULE = /^\.+\//;

export function resolveFilename(filename: string, options: CompilerOption): string {
    if (detectNode) {
        const path = require('path');
        const root = options.root;
        const extname = options.extname;

        if (LOCAL_MODULE.test(filename)) {
            const from = options.filename;
            const self = !from || filename === from;
            const base = self ? root : path.dirname(from);
            filename = path.resolve(base, filename);
        } else {
            filename = path.resolve(root, filename);
        }

        if (!path.extname(filename)) {
            filename = filename + extname;
        }
    }

    return filename;
}

