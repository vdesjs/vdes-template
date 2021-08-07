import { store, File } from "./store";
import { compile, precompile, precomileImport} from "vdes-template";
import { ref } from "vue";
import { file } from "jszip";

export const MAIN_FILE = "index.vdest";
/**
 * The default compile we are using is built from each commit
 * but we may swap it out with a version fetched from CDNs
 */
let vdesCompile = compile;
let vdesPreCompile = precompile;
let vdesPreCompileImport = precomileImport;

const defaultVdesTemplateUrl =
    process.env.NODE_ENV != "development"
        ? `${location.origin}/playground/vdes-template.esm-browser.js`
        : `${location.origin}/vdes-template.esm-browser.js`;

export const vdesTemplateUrl = ref(defaultVdesTemplateUrl);

export async function setVersion(version: string) {
    const url = `https://unpkg.com/vdes-template@${version}/dist/vdes-template.esm-browser.js`;
    // const url = `https://unpkg.com/vdes-template@1.0.3/dist/vdes-template.esm-browser.js`

    const [vdesTemplate] = await Promise.all([import(/* @vite-ignore */ url)]);
    vdesCompile = vdesTemplate.compile;
    vdesPreCompile = vdesTemplate.precompile;
    vdesPreCompileImport = vdesTemplate.precomileImport;
    console.info(`Now using vdesTemplate version: ${version}`);
}

export function resetVersion() {
    vdesCompile = compile;
    vdesPreCompile = precompile;
    vdesPreCompileImport = precomileImport
}

export async function compileFile({ filename, templateCode, inputData, compiled }: File) {
    if (!templateCode.trim()) {
        store.errors = [];
        return;
    }
    if (!filename.endsWith(".vdest")) {
        compiled.compileRenderCode = compiled.reCompileRenderCode = templateCode;
        store.errors = [];
        return;
    }
    // To clear error mesaage
    store.errors = [];

    const id = await hashId(filename);

    try {
        // compile
        const { render, renderCode } = vdesCompile({
            source: templateCode,
            filename,
        });
        compiled.compileRenderCode = renderCode;

        // render
        let res;
        if (inputData === "") {
            // Not render
            res = templateCode;
        } else {
            res = render(new Function("return " + inputData)());
        }

        createFileEle(filename, res);
        compiled.result = res;
    } catch (error) {
        console.log("error", error);
        store.errors = [error];
    }

    try {
        const preCompileCode = vdesPreCompile({
            filename,
            source: templateCode,
        }).code;
        compiled.reCompileRenderCode = preCompileCode;
    } catch (error) {
        console.log("error", error);
        store.errors = [error];
    }

    try {
        const preCompileCodeImport = vdesPreCompileImport({
            filename,
            source: templateCode,
        }).code;
        compiled.reCompileRenderCodeImport = preCompileCodeImport;
    } catch (error) {
        console.log("error", error);
        store.errors = [error];
    }
}

function createFileEle(filename: string, content: string) {
    filename = "./" + filename;
    const fileElm = document.getElementById(filename);
    const createDiv = () => {
        const div = document.createElement("div");
        div.id = filename;
        div.innerHTML = content;
        div.style.display = "none";
        return div;
    };
    if (fileElm == null) {
        document.getElementById("files")?.appendChild(createDiv());
    } else {
        fileElm.innerHTML = content;
    }
}

async function hashId(filename: string) {
    const msgUint8 = new TextEncoder().encode(filename); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex.slice(0, 8);
}
