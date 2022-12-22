import {EditorState, RichUtils} from "draft-js";

export class EditorClass {
    editor: EditorState | null
    callbacks: { [key: string]: (...args: any) => void } | any

    constructor() {
        this.editor = null
        this.callbacks = {}
    }

    init() {
        let state = EditorState.createEmpty()
        this.editor = state
        return state
    }

    registerCallback = (id: string, callback: (...args: any) => void) => {
        if (!(id in this.callbacks))
            this.callbacks[id] = callback
    }

    callbackById(id: string, data: any) {
        if (id in this.callbacks)
            this.callbacks[id](data)
    }

    updateState(editor: EditorState) {
        this.editor = editor
    }

    setBold() {
        if(this.editor){
            let newState = RichUtils.toggleInlineStyle(this.editor,"BOLD")
            return newState.getCurrentInlineStyle().toJS().includes("BOLD")
        }
    }
}
