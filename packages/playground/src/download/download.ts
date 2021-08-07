
import { exportFiles } from "../util/store";
import { saveAs } from "file-saver";

import index from './template/index.html?raw'
import icon from "./template/public/logo.svg?raw"
import main from "./template/src/main.js?raw"
import pkg from "./template/package.json?raw"
import viteConf from "./template/vite.config.js?raw"
export async function downloadProject() {
    const {default: JSZip} = await import('jszip')
    const zip = new JSZip()

    const publicFolder = zip.folder('public')
    publicFolder?.file('logo.svg', icon)

    zip.file('index.html', index)

    const srcFolder = zip.folder('src')
    srcFolder?.file('main.js', main)


    zip.file('package.json', pkg)
    zip.file('vite.config.js', viteConf)

    const vdestFolder = zip.folder('vdest')
    const files = exportFiles()
    for(const file in files) {
        vdestFolder?.file(file, files[file].templateCode)
    }
    const blob = await zip.generateAsync({type: 'blob'})
    saveAs(blob, 'vdes-template-starter.zip')



}