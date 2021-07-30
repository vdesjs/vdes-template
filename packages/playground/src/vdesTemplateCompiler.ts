
import { store, File } from "./store";
import { compile, precompile } from "vdes-template";
import { ref } from 'vue'




export const MAIN_FILE = "index.vdest";
/**
 * The default compile we are using is built from each commit
 * but we may swap it out with a version fetched from CDNs
 */
let vdesCompile = compile;
let vdesPreCompile = precompile;

const defaultVdesTemplateUrl = process.env.NODE_ENV != "development"
  ? `${location.origin}/playground/vdes-template.esm-browser.js`
  : `${location.origin}/vdes-template.esm-browser.js`;

export const vdesTemplateUrl = ref(defaultVdesTemplateUrl);

export async function setVersion(version: string) {
  const url = `https://unpkg.com/vdejs/vdes-template@${version}/dist/vdes-template.esm-browser.js`

  const [vdesTemplate] = await Promise.all([
    import( /* @vite-ignore */ url)
  ])
  vdesCompile = vdesTemplate.compile
  vdesPreCompile = vdesTemplate.precompile
  console.info(`Now using vdesTemplate version: ${version}`)
}

export function resetVersion() {
  vdesCompile = compile;
  vdesPreCompile = precompile
}

export async function compileFile({filename, templateCode, inputData, compiled}: File) {
  if (!templateCode.trim()) {
    store.errors = []
    return
  }
  if (!filename.endsWith('.vdest')) {
    compiled.compileRenderCode = compiled.reCompileRenderCode = templateCode
    store.errors = [];
    return
  }

  const id = await hashId(filename);
  const {render, renderCode} = compile({
    source: templateCode,
    filename,

  })
  console.log("renderCode", renderCode)

  compiled.compileRenderCode = renderCode

  const preCompileCode = precompile({
    filename,
    source: templateCode
  }).code
  compiled.reCompileRenderCode = preCompileCode

  try {
    const res = render(new Function("return " + inputData)())
    compiled.result = res
  } catch (error) {
    console.log("error", error)
    store.errors = [error]
  }


}

async function hashId(filename: string) {
  const msgUint8 = new TextEncoder().encode(filename) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex.slice(0, 8)
}


