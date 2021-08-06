
import { exportFiles } from "../util/store";
import { saveAs } from "file-saver";

import index from './template/public/index.html?raw'
import icon from "./template/public/favicon.ico?raw"
import appVue from "./template/App.vue?raw"
import babelConfig from "./template/babel.config.js?raw"
import main from "./template/main.js?raw"
import pkg from "./template/package.json?raw"
import vueConf from "./template/vue.config.js?raw"
export async function downloadProject() {
    const {default: JSZip} = await import('jszip')
    const zip = new JSZip()

    const publicFolder = zip.folder('public')
    publicFolder?.file('index.html', index)
    publicFolder?.file('favicon.ico', icon)

    zip.file('App.vue', appVue)
    zip.file('babel.config.js', babelConfig)
    zip.file('main.js', main)
    console.log(pkg)
    zip.file('package.json', pkg)
    zip.file('vue.config.js', vueConf)

    const vdestFolder = zip.folder('vdest')
    const files = exportFiles()
    for(const file in files) {
        vdestFolder?.file(file, files[file].templateCode)
    }
    const blob = await zip.generateAsync({type: 'blob'})
    saveAs(blob, 'vde-template-starter.zip')



}