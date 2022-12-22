import React, {useEffect, useState} from "react";
import {TextEditor} from "./textEditor";
import {Button} from "./button/button";

export const EditorWrapper = () => {

    const OPTS = {
        bd: "Bold",
        it: "Italic",
        ul: "Underline"
    }

    const [isBold, setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false)
    const [isUnderlined, setIsUnderlined] = useState<boolean>(false)
    const [buttons, setButtons] = useState<Array<string>>([OPTS.bd, OPTS.it, OPTS.ul])
    const [toggleInsert, setToggleInsert] = useState<boolean>(false)
    const [toggleInsertBlock, setToggleInsertBlock] = useState<boolean>(false)

    const [inlineStyle, setInlineStyle] = useState<{ [keys: string]: boolean }>({
        isBold: false,
        isItalic: false,
        isUnderlined: false
    })

    useEffect(() => setToggleInsert(false), [toggleInsert])

    useEffect(() => {
        setInlineStyle({
            isBold,
            isItalic,
            isUnderlined
        })
    }, [isBold, isItalic, isUnderlined])

    return (
        <div>
            <div className={"button-wrapper"}>
                {
                    buttons.map((value, index) => <Button id={index.toString()} displayText={value} getState={(b) => {
                        if (value.includes("Bold"))
                            setIsBold(b)
                        else if (value.includes("Italic"))
                            setIsItalic(b)
                        else if (value.includes("Underline"))
                            setIsUnderlined(b)
                    }
                    }/>)
                }
            </div>
            <div className={"editor-wrapper"}>
                <TextEditor inlineStyles={inlineStyle} requestInsert={toggleInsert} requestInsertBlock={toggleInsertBlock}/>
            </div>
            <div>
                <button
                    onMouseDown={(e: any) => e.preventDefault()}
                    onClick={() => setToggleInsert(true)}
                >Insert Text
                </button>
                <button
                    onMouseDown={(e:any) => e.preventDefault()}
                    onClick={() => setToggleInsertBlock(!toggleInsertBlock)}
                    >Insert Block</button>
            </div>
        </div>
    )
}