<template>
  <Header />
  <div class="wrapper">
    <SplitPane>
      <template #left>
        <Editor />
      </template>
    </SplitPane>
  </div>
</template>

<script setup lang="ts">
import Header from './component/Header.vue'
import SplitPane from './component/SplitPane.vue'
import Editor from './component/editor/Editor.vue'

</script>

<style>
body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: var(--base);
  margin: 0;
  background-color: #f8f8f8;
  --base: #444;
  --nav-height: 50px;
  --font-code: "Source Code Pro", monospace;
  --color-branding: #302eb1;
  --color-branding-dark: #416f9c;
}

* {
  box-sizing: border-box;
}

.wrapper {
  height: calc(100vh - var(--nav-height));
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
