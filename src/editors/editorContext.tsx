import React, {createContext, useEffect, useRef, useState} from "react";
import {EditorClass} from "./editor";

export const EditorContext = createContext<EditorClass | any>(undefined)

export const EditorContextProvider = (props: any) => {
    const editor_state = useRef<any>()

    useEffect(() => {
        if (!(editor_state.current instanceof EditorClass)) {
            editor_state.current = new EditorClass()
        }
    }, [])

    return (
        <EditorContext.Provider value={editor_state}>
            {props.children}
        </EditorContext.Provider>
    )
}