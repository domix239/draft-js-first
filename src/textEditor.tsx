import React, {FC, useEffect, useState} from "react";
import {
    AtomicBlockUtils,
    ContentBlock,
    ContentState,
    Editor,
    EditorState,
    Entity,
    genKey,
    Modifier,
    RichUtils,
    SelectionState
} from "draft-js";

import {List, Map} from "immutable";
import {CustomInsertBlock} from "./insertBlock";

interface ITextEditor {
    inlineStyles: { [keys: string]: boolean },
    requestInsert: boolean,
    requestInsertBlock: boolean,
    getIsBlockInserted: (b: boolean) => void,
}

export const TextEditor: FC<ITextEditor> = ({
                                                inlineStyles,
                                                requestInsert,
                                                requestInsertBlock,
                                                getIsBlockInserted
                                            }) => {

    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty())
    const [isBold, setIsBold] = useState<boolean>()
    const [isItalic, setIsItalic] = useState<boolean>()
    const [isUnderline, setIsUnderline] = useState<boolean>()

    const [isBlockInserted, setIsBlockInserted] = useState<boolean>(false)

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

    useEffect(() => console.log(inlineStyles), [inlineStyles])

    useEffect(() => {

    }, [])

    useEffect(() => {
        getIsBlockInserted(isBlockInserted)
    }, [isBlockInserted])

    useEffect(() => {
        if (requestInsertBlock) {
            let newState = editorState
            const contentState = editorState.getCurrentContent()
            let contentStateWithEntity = contentState.createEntity(
                "customTextBlock",
                "MUTABLE", {}
            )

            const selection = newState.getSelection()

            contentStateWithEntity = Modifier.setBlockType(contentStateWithEntity, selection, "customTextBlock")

            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const newEditorState = EditorState.set(newState, {
                currentContent: contentStateWithEntity
            })
            console.log("KAJSHNDKJSAD", newEditorState.getCurrentContent().getBlocksAsArray()[0].getType())
            setEditorState(newEditorState)
            setIsBlockInserted(true)
        }
    }, [requestInsertBlock])
    const toggleGreenBackground = (contentBlock: ContentBlock) => {

        // set new editor state here
        const type = contentBlock.getType()

        if (type === "customTextBlock")
            return "makeMeGreen"

        return "default"
    }

    const renderInsertBlock = (contentBlock: ContentBlock) => {
        const type = contentBlock.getType()

        console.log("TYPE = ", type)

        if (type === "customTextBlock") {
            return {
                component: CustomInsertBlock,
                props: {}
            }
        }
    }

    return (
        <>
            <div>
                <Editor editorState={editorState} onChange={setEditorState}
                        blockStyleFn={toggleGreenBackground}
                        blockRendererFn={renderInsertBlock}
                />
            </div>
        </>
    )
}