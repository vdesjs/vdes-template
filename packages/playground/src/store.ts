import { reactive, watchEffect } from "vue";
import { compileFile, MAIN_FILE } from "./vdesTemplateCompiler";
import { utoa, atou } from "./utils";

const welcomeCode = `
I am {{name}}
`.trim();

const welcomeInputData = `
    {
        name: 'vdesTemplate'
    }
`.trim();

export class File {
  filename: string;
  templateCode: string;
  inputData: string;

  compiled = {
    compileRenderCode: "",
    reCompileRenderCode: "",
    result: "",
  };
  constructor(filename: string, templateCode: string, inputData: string) {
    this.filename = filename;
    this.templateCode = templateCode;
    this.inputData = inputData;
  }
}

interface Store {
  files: Record<string, File>;
  activeFilename: string;
  readonly activeFile: File;
  readonly importMap: string | undefined;
  errors: (string | Error)[];
}

let files: Store["files"] = {};

const savedFiles = location.hash.slice(1);

if (savedFiles) {
  const saved = JSON.parse(atou(savedFiles));
  for (const filename in saved) {
    files[filename] = new File(
      filename,
      saved[filename]["templateCode"],
      saved[filename]["inputData"]
    );
  }
} else {
  files = {
    "index.vdest": new File(MAIN_FILE, welcomeCode, welcomeInputData),
  };
}

export const store: Store = reactive({
    files,
    activeFilename: MAIN_FILE,
    get activeFile() {
        return store.files[store.activeFilename]
    },
    get importMap() {
        const file = store.files['import-map.json']
        return file && file.templateCode
    },
    errors: []
    
})

watchEffect(() => compileFile(store.activeFile))


