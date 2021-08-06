
<template>
    <nav>
        <h1>
          <img alt="logo" class="logo" src="/logo.svg">
            <span>vdes-template playground</span>
        </h1>
        <div class="links">
            <div class="version"  @click.stop>
                <span class="active-version" @click="toggle">Version: {{ activeVersion }}</span>
                <ul class="versions" :class="{ expanded }">
                    <li v-if="!publishedVersions">loading version....</li>
                    <li v-for="version of publishedVersions">
                        <a @click="setVdesTemplateVersion(version)">v{{ version }}</a>
                    </li>
                    <li>
                        <a @click="resetVdesTemplateVersion">This Commit ({{ currentCommit }})</a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/vdesjs/vdes-template/releases"
                            target="_blank"
                        >Commits History</a>
                    </li>
                </ul>
            </div>
            <button class="share" @click="copyLink">
                <svg width="1.4em" height="1.4em" viewBox="0 0 24 24">
                    <g
                        fill="none"
                        stroke="#626262"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <path d="M8.59 13.51l6.83 3.98" />
                        <path d="M15.41 6.51l-6.82 3.98" />
                    </g>
                </svg>
            </button>
            <button class="download" @click="downloadProject">
                <svg width="1.7em" height="1.7em" viewBox="0 0 24 24">
                    <g fill="#626262">
                        <rect x="4" y="18" width="16" height="2" rx="1" ry="1" />
                        <rect
                            x="3"
                            y="17"
                            width="4"
                            height="2"
                            rx="1"
                            ry="1"
                            transform="rotate(-90 5 18)"
                        />
                        <rect
                            x="17"
                            y="17"
                            width="4"
                            height="2"
                            rx="1"
                            ry="1"
                            transform="rotate(-90 19 18)"
                        />
                        <path
                            d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39a1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"
                        />
                        <path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z" />
                    </g>
                </svg>
            </button>
        </div>
    </nav>
</template>
<script setup lang="ts">
import { downloadProject } from '../download/download'
import { File, store } from "../util/store"
import { setVersion, resetVersion, compileFile } from "../util/vdesTemplateCompiler"
import { ref, onMounted } from 'vue'

const currentCommit = __COMMIT__
const activeVersion = ref(`@${currentCommit}`)
const publishedVersions = ref<string[]>()
const expanded = ref(false)

async function toggle() {
    expanded.value = !expanded.value
    if (!publishedVersions.value) {
        publishedVersions.value = await fetchVersions()
    }
}
async function setVdesTemplateVersion(v: string) {
    activeVersion.value = `loading...`
    await setVersion(v)
    activeVersion.value = `v${v}`
    expanded.value = false
}

async function resetVdesTemplateVersion() {
    resetVersion()
    activeVersion.value = `@${currentCommit}`
    expanded.value = false
}

async function copyLink() {
    await navigator.clipboard.writeText(location.href)
    alert('Sharaable url has been copied to cliborad.')
}

onMounted(async () => {
    window.addEventListener('click', () => {
        expanded.value = false
    })
})


async function fetchVersions(): Promise<string[]> {
    const res = await fetch(`https://api.github.com/repos/vdesjs/vdes-template/releases?per_page=100`)
    const releases: any[] = await res.json()
    console.log(releases)
    const versions = releases.map(r => {
        return /^v/.test(r.tag_name) ? r.tag_name.substr(1) : r.tag_name
    })
    const minVersion = versions.findIndex(v => v === '1.0.3')
    return versions.slice(0, minVersion + 1)
}

</script>

<style>
.logo {
  height: 35px;
}
nav {
  height: var(--nav-height);
  box-sizing: border-box;
  padding: 0 1em;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.33);
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}

h1 {
  margin: 0;
  line-height: var(--nav-height);
  font-weight: 500;
  display: inline-block;
  vertical-align: middle;
}

h1 img {
  height: 24px;
  vertical-align: middle;
  margin-right: 10px;
  position: relative;
  top: -2px;
}

@media (max-width: 480px) {
  h1 span {
    display: none;
  }
}

.links {
  display: flex;
}

.version {
  display: inline-block;
  margin-right: 12px;
  position: relative;
}

.active-version {
  cursor: pointer;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  line-height: var(--nav-height);
  padding-right: 15px;
}

.active-version:after {
  content: '';
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #aaa;
  position: absolute;
  right: 0;
  top: 22px;
}

.version:hover .active-version:after {
  border-top-color: var(--base);
}

.versions {
  display: none;
  position: absolute;
  left: 0;
  top: 40px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  list-style-type: none;
  padding: 8px;
  margin: 0;
  width: 200px;
  max-height: calc(100vh - 70px);
  overflow: scroll;
}

.versions a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
  cursor: pointer;
  color: var(--base);
}

.versions a:hover {
  color: var(--color-branding);
}

.versions.expanded {
  display: block;
}

.share,
.download {
  margin: 0 2px;
}
</style>