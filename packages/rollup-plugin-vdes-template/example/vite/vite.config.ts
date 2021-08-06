import { defineConfig } from 'vite'

import vdesTempate from "../../lib/index"
export default defineConfig({
    root: 'example/vite',
    plugins: [
        vdesTempate()
    ]
})