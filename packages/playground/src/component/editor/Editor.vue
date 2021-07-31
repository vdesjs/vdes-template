<template>
  <FileSelector />
  <div class="editor-container">
    <div class="inputData">
      <div class="hint">inputData</div>
      <CodeMirror @change="onChangeInputData" :value="activeInputData" mode="javascript" />
    </div>
    <div class="templateCode">
      <div class="hint">templateCode</div>
      <CodeMirror @change="onChangeTemplateCode" :value="activeTemplateCode" mode="javascript" />
    </div>

    <Message :err="store.errors[0]" />
  </div>
</template>

<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import CodeMirror from '../codemirror/CodeMirror.vue'
import Message from '../Message.vue'
import { store } from '../../util/store'
import { debounce } from '../../util/utils'
import { ref, watch, computed } from 'vue'

const onChangeTemplateCode = debounce((code: string) => {
  store.activeFile.templateCode = code
}, 250)
const activeTemplateCode = ref(store.activeFile.templateCode)

const onChangeInputData = debounce((code: string) => {
  store.activeFile.inputData = code
}, 250)
const activeInputData = ref(store.activeFile.inputData)

watch(
  () => store.activeFilename,
  () => {
    activeTemplateCode.value = store.activeFile.templateCode
    activeInputData.value = store.activeFile.inputData
  }
)
</script>

<style lang="scss"  scoped>
.editor-container {
  height: calc(100% - 35px);
  overflow: hidden;
  position: relative;

  .inputData {
    position: relative;
    height: 30%;
    border-bottom: 3px solid var(--color-branding);
  }
  .templateCode {
    position: relative;
    height: 70%;
  }
  .hint {
    position: absolute;
    right: 0px;
    z-index: 10;
    color: var(--color-branding);
    border: 1px solid var(--color-branding);
    background: radial-gradient(ellipse at center,rgba(122, 132, 145, 0.25),rgba(240,119,43,0) 90%);
  }
}
</style>
