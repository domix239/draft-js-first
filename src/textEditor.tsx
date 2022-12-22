import React, {FC, useEffect, useState} from "react";
import {ContentBlock, ContentState, Editor, EditorState, Entity, Modifier, RichUtils, SelectionState} from "draft-js";
import {stat} from "fs";

interface ITextEditor {
    inlineStyles: { [keys: string]: boolean },
    requestInsert: boolean,
    requestInsertBlock: boolean
}

export const TextEditor: FC<ITextEditor> = ({
                                                inlineStyles,
                                                requestInsert,
                                                requestInsertBlock
                                            }) => {

    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty())
    const [isBold, setIsBold] = useState<boolean>()
    const [isItalic, setIsItalic] = useState<boolean>()
    const [isUnderline, setIsUnderline] = useState<boolean>()

    const findEntityRanges = (content = editorState.getCurrentContent()) => {
        let block = content.getBlocksAsArray()[0];
        let result = [];

        for (let i = 0; i < block.getText().length;) {
            let key = block.getEntityAt(i);
            if (key == null) {
                i += 1;
                continue;
            }

            let data = Entity.get(key).getData();
            result.push(data);
            i = data.end + 1;
        }
        return result;
    }

    const findClosestTag = (pos: number) => {
        return findEntityRanges().reduce(
            function (prev, curr) {
                return Math.abs(pos - prev.end) < Math.abs(pos - curr.end) ? prev : curr;
            },
            {end: -1, start: 0}
        );
    }

    const applyTag = (start: number, end: number, content: ContentState = editorState.getCurrentContent()) => {
        let blockKey = content.getBlocksAsArray()[0].getKey();

        // apply entity to the tag
        const entityKey = Entity.create('TAG', 'IMMUTABLE', {start: start, end: end});
        let targetRange = newSelection(start, end, blockKey);
        let newContentState = Modifier.applyEntity(content, targetRange, entityKey);

        // apply decorator to the tag
        return Modifier.applyInlineStyle(newContentState, targetRange, 'TAGBOX');
    };

    const newSelection = (start: number, end: number, blockKey: string) => {
        console.log("Start:", start)
        console.log("End:", end)
        console.log("blockKey:", blockKey)
        return new SelectionState({
            anchorKey: blockKey,
            anchorOffset: start,
            focusKey: blockKey,
            focusOffset: end
        })
    }

    useEffect(() => {
        if (requestInsert) {
            let state = editorState
            let content = state.getCurrentContent()
            let selection = state.getSelection()
            let block = content.getBlocksAsArray()[0]
            let cursorPosition = state.getSelection().getEndOffset()

            console.log("State", state)
            console.log("Content", content)
            console.log("Selection", selection)
            console.log("Block", block)
            console.log("CursorPosition", cursorPosition)

            let targetRange = newSelection(cursorPosition, cursorPosition, block.getKey())
            let newContent = Modifier.insertText(content, targetRange, "HELLO ASD AWDAWDAWD AWD  ASDWA JKAHDJ G JG JWHALHKL")

            let startPos = cursorPosition === 0 ? 0 : findClosestTag(cursorPosition).end + 1
            newContent = applyTag(startPos, cursorPosition, newContent)

            let newState = EditorState.push(state, newContent, state.getLastChangeType())

            newState = EditorState.moveFocusToEnd(newState)
            setEditorState(newState)

            /*
            let newState = EditorState.createWithContent(newContent)
            newState = EditorState.moveFocusToEnd(newState)
            setEditorState(newState)*/
        }
    }, [requestInsert])

    useEffect(() => {
        Object.keys(inlineStyles).map((value) => {
            let toggle: boolean = inlineStyles[value]
            if (value === "isBold")
                setIsBold(toggle)
            if (value === "isItalic")
                setIsItalic(toggle)
            if (value === "isUnderlined")
                setIsUnderline(toggle)
        })
    }, [inlineStyles])

    useEffect(() => {
        console.log("BOLD USE EFFECT")
        setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"))
    }, [isBold])
    useEffect(() => {
        console.log("ITALIC USE EFFECT")
        setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"))
    }, [isItalic])
    useEffect(() => {
        console.log("UNDERLINE USE EFFECT")
        setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"))
    }, [isUnderline])

    /*useEffect(() => {
        /!*console.log(editorState.getCurrentInlineStyle().map((value) => console.log(value)))*!/
        /!*
                let newState = RichUtils.toggleInlineStyle(editorState, "BOLD")
                console.log(newState.getCurrentInlineStyle().size)*!/

        let state = editorState
        for (let [k] of Object.entries(inlineStyles)) {
            switch (k) {
                case "isBold":
                    console.log("BOLD:", inlineStyles[k])
                    if (inlineStyles[k])
                        state = RichUtils.toggleInlineStyle(editorState, "BOLD")
                    break
                case "isItalic":
                    if (inlineStyles[k])
                        state = RichUtils.toggleInlineStyle(editorState, "ITALIC")
                    break
                case "isUnderlined":
                    if (inlineStyles[k])
                        state = RichUtils.toggleInlineStyle(editorState, "UNDERLINE")
            }
        }
        setEditorState(state)
    }, [inlineStyles])*/

    useEffect(() => console.log(inlineStyles), [inlineStyles])

    useEffect(() => console.log(requestInsertBlock), [requestInsertBlock])
    const toggleGreenBackground = (contentBlock: ContentBlock) => {

        // set new editor state here
        const type = contentBlock.getType()
        console.log("Type", type)

        if (requestInsertBlock)
            return "makeMeGreen"
        else
            return "default"
    }

    return (
        <>
            <div>
                <Editor editorState={editorState} onChange={setEditorState} blockStyleFn={toggleGreenBackground}/>
                <button>AHSDVBJBAJHSBD</button>
            </div>
        </>
    )
}