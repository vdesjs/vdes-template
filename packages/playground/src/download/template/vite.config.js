import { defineConfig } from "vite";
import vdesTemplate from "rollup-plugin-vdes-template"
export default defineConfig({
    plugins: [
        vdesTemplate()
    ]
})