<template>
  <div class="tab-buttons">
    <button v-for="m of modes" :class="{ active: mode === m }" @click="mode = m" alt="sdfdf">{{ m }}</button>
  </div>

  <div class="output-container">
    <div v-if="mode === 'result'">
      <textarea class="result" :value="displayResult(store.activeFile.compiled[mode])" readonly></textarea>
    </div>
    <CodeMirror v-else readonly mode="javascript" :value="store.activeFile.compiled[mode]" />
  </div>
</template>
  
<script setup lang="ts">
import CodeMirror from '../codemirror/CodeMirror.vue'
import { store } from '../../util/store'
import { ref } from 'vue'

function displayResult(code: string) {
  // code = code.replaceAll('\n', '<br/>')
  return code
}

const modes = ['result', 'compileRenderCode', 'reCompileRenderCode', 'reCompileRenderCodeImport'] as const

type Modes = typeof modes[number]
const mode = ref<Modes>('result');



</script>
  
  <style lang="scss" scoped>
.output-container {
  height: calc(100% - 35px);
  overflow: hidden;
  position: relative;
  .result {
    width: 100%;
    overflow: hidden;
    height: calc(100vh - 200px);
    border: none;
    pointer-events: none;
  }
}
.tab-buttons {
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
  background-color: white;
}
.tab-buttons button {
  font-size: 13px;
  font-family: var(--font-code);
  padding: 8px 16px 6px;
  text-transform: uppercase;
  color: #999;
  box-sizing: border-box;
}

button.active {
  color: var(--color-branding-dark);
  border-bottom: 3px solid var(--color-branding-dark);
}
</style>
  