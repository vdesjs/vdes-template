import { CompilerOption } from "../compiler";

export function onerror(error: any, options?: CompilerOption): void {
    console.log(error.name, error.message);
}