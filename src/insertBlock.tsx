import React, {useEffect, useState} from "react";
import {EditorBlock} from "draft-js";

export const CustomInsertBlock = (props: any) => {
    return (
        <div>
            <h1>YO</h1>
            <EditorBlock {...props}/>
        </div>
    )
}
