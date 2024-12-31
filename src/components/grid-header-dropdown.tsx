import { HiDotsHorizontal } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';

export class DropdownButtonData {
    buttonText: string;
    onClicked: Function;

    constructor(
        buttonText: string,
        onClicked: Function
    ) {
        this.buttonText = buttonText;
        this.onClicked = onClicked;
    }
}

export function GridHeaderDropdown(props: {
    buttonData: DropdownButtonData[],
}) {
    const [dropdownShown, setDropdownShown] = useState(false);
    const dropdownButtonRef = useRef(null);
    const dropdownInnerButtonRefs: any[] = [];

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
                        ref={dropdownInnerButtonRefs[idx]}>
                        {buttonData.buttonText}
                    </button>
                )
            }
        </div>
    </div>
}