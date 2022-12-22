import React, {FC, useEffect, useState} from "react";

interface IButton {
    id: string,
    displayText: string,
    getState: (b: boolean) => void,
}

export const Button: FC<IButton> = ({
                                        id,
                                        displayText,
                                        getState
                                    }) => {

    const [isActive, setIsActive] = useState<boolean>(false)

    useEffect(() => {
        if (getState) {
            getState(isActive)
        }
    }, [getState, isActive])

    return (
        <>
            <button
                    id={id}
                    type={"submit"}
                    style={isActive ? {fontWeight: "bold"} : {}}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        setIsActive(!isActive)
                    }>{displayText}</button>
        </>
    )
}
