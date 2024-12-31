import { HiDotsHorizontal } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';

export class DropdownButtonData {
    buttonText: string;
    onClicked: Function;
    isDisabled: (numSelected: number) => boolean;

    constructor(
        buttonText: string,
        onClicked: Function,
        isDisabled: (numSelected: number) => boolean, 
    ) {
        this.buttonText = buttonText;
        this.onClicked = onClicked;
        this.isDisabled = isDisabled
    }
}

export function GridHeaderDropdown(props: {
    buttonData: DropdownButtonData[],
    gridRef: any,
}) {
    const [dropdownShown, setDropdownShown] = useState(false);
    const dropdownButtonRef = useRef(null);
    const dropdownInnerButtonRefs: any[] = [];
    const [numSelected, setNumSelected] = useState(0);

    document.addEventListener('mousedown', (e: any) => {
        if (dropdownShown &&
            !dropdownButtonRef.current?.contains(e.target) &&
            dropdownInnerButtonRefs.every((innerButtonRef: any) => !innerButtonRef.current?.contains(e.target))
        ) {
            setDropdownShown(false);
        }
    });

    for (let i = 0; i < props.buttonData.length; i++) {
        dropdownInnerButtonRefs.push(useRef(null));
    }

    useEffect(() => {
        setNumSelected(props.gridRef.current.api?.getSelectedRows().length);
    }, [dropdownShown]);

    return <div className="gridHeaderDropdown">
        <button
            onClick={() => setDropdownShown(!dropdownShown)}
            ref={dropdownButtonRef}>
            <HiDotsHorizontal />
        </button>
        <div className={`gridHeaderDropdownOptionContainer ${dropdownShown ? '' : 'hidden'}`}>
            {
                props.buttonData.map((buttonData: DropdownButtonData, idx: number) =>
                    <button
                        onClick={() => {
                            buttonData.onClicked();
                            setDropdownShown(false);
                        }}
                        ref={dropdownInnerButtonRefs[idx]}
                        disabled={buttonData.isDisabled(numSelected)}
                        style={buttonData.isDisabled(numSelected) ? {color: 'gray'} : null}>
                        {buttonData.buttonText}
                    </button>
                )
            }
        </div>
    </div>
}