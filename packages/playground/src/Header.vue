
<template>
    <button @click="change">改变</button>

</template>
<script setup lang="ts">
import { File, store } from "./store"
import { setVersion, resetVersion, compileFile } from "./vdesTemplateCompiler"

function change() {
    store.files['test.vdest'] = new File("test.vdest", "test", "{}")
    store.activeFilename = 'test.vdest'
}
</script>
