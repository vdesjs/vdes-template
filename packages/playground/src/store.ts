import {reactive, watchEffect} from 'vue'

import { utoa, atou } from './utils'

const welcomeCode = `
I am {{name}}
`.trim()

export class File {
    filename: string;
    templateCode: string;
    inputData: string;

    compiled = {
        renderCode: '',
        
    }
}

