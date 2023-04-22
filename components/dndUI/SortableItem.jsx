import { useState, useRef, useEffect, useContext } from 'react';
import { BiTrash, BiEditAlt, BiCross, BiTv } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdDone } from "react-icons/md"
import TableContext from '../context/TableContext.js.jsx';
import AddLine from '../AddLine.jsx';

function SortableItem(props) {

    // this is the table line "row" data
    const [formData, setFormData] = useState({})
    const [inputDisabled, setInputDisabled] = useState(true)
    // For coloring lines depending on camera column value and days lines
    const [style4, setStyle4] = useState(props.style4)

    // getting the table from the context
    const { adding, setAdding, setItems, items, selectedLine, setSelectedLine, isSaved, setIsSaved } = useContext(TableContext)

    // This for focusing on the scene input when updateing start
    const firstInputRef = useRef()
    const styleSummary = useRef()

    useEffect(() => {
        setStyle4(props.style4)
    }, [props.style4])

    useEffect(() => {
        setFormData(props.line)
    }, [props.line])

    useEffect(() => {
        setTimeout(() => {
            const trgt = [...document.querySelectorAll("textarea")]
            trgt.forEach(element => {
                element.style.height = "auto";
                element.style.height = trgt.scrollHeight + "px";
            });
        }, 1000);

    }, [inputDisabled])

    // This function is reponsible for allowing the user to save the edits that he/she made is on the row 
    const saveHandler = (e) => {
        setItems((prevState) => {
            let newItems = [...prevState]
            newItems[props.index] = { ...formData }
            return newItems
        })
        if (isSaved) {
            setIsSaved(false)
        }
        setInputDisabled(true)
    }

    const [prevValue, setPrevValue] = useState("")

    const cancelHandler = (e) => {
        setInputDisabled(true)
        setFormData(prevValue)
    }

    // This function is reponsible for allowing the user to edit the row, focusing on the first input and highliting its text 
    const onEditClick = (e) => {
        setInputDisabled(prevState => {
            if (prevState) {
                if (firstInputRef.current !== null) {
                    setTimeout(() => {
                        firstInputRef.current.focus(); // onEditClick => focus=> showing problem on click  on day or note becuase there is no text area 
                        firstInputRef.current.setSelectionRange(0, firstInputRef.current.value.length);
                    }, 0);
                }
            }
            return !prevState
        })
    }

    // This is for keeping the textarea's height equal to the value's height 
    // and avoiding the scroll bar inside the textarea 
    const onChange = (e) => {
        const trgt = e.currentTarget
        trgt.style.height = "auto";
        trgt.style.height = trgt.scrollHeight + "px";
        setFormData(prevState => ({ ...prevState, [trgt.id]: trgt.value }))
    }

    // THIS IS FOR SAVING THE ORIGINAL VALUE "FOR THE CANCEL"
    const onFocus = (e) => {
        setPrevValue(formData)
    }


    return (
        <>
            {  // ========== DAYS LINES ===========
                (props.line.day) ? (
                    <>
                        <div title="Hold to Drag!" id={`d_${props.id}`} style={style4.DAYS} className={`l_${props.id} row-grid-day touch-manipulation z-1 `}>
                            <span className=' w-auto noprintdplay m-auto flex justify-evenly'>
                                {inputDisabled ?
                                    <>
                                        <button aria-label="edit" className=' btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                        {/* delete function will be triggered from the modal */}
                                        <a aria-label="delete" className=' btn btn-xs btn-ghost text-red-600' href="#my-modal-2" onClick={() => setSelectedLine(formData)} ><BiTrash /></a>
                                    </> :
                                    <>
                                        <button aria-label="save" className=' btn btn-xs btn-ghost text-green-500 text-lg' onClick={(e) => saveHandler(e)}>
                                            <MdDone />
                                        </button>
                                        <button aria-label="undo" className=' btn btn-xs btn-ghost text-sm text-red-500' onClick={(e) => cancelHandler(e)}>
                                            x
                                        </button>
                                    </>}
                            </span>
                            <span className='my-auto'>
                                {/* Normal mode display the span when ediing display the input */}
                                {inputDisabled ?
                                    <>
                                        <span className={`font-extrabold`}>{formData.day}</span>
                                    </>
                                    :
                                    <>
                                        <input
                                            onFocus={(e) => onFocus(e)}
                                            onChange={e => onChange(e)} id="day"
                                            type="text" placeholder="" defaultValue={`${formData.day}`} ref={firstInputRef}
                                            className={`input input-ghost text-center resize-none w-full font-extrabold max-w-xs scroll-day`}
                                        />
                                    </>
                                }
                            </span>
                            <div className={`flex w-full justify-center`}>
                                {adding.isAdding ? (<button className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto '>
                                    <AiOutlinePlus aria-label="add line" onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                                </button>) : ""}
                            </div>
                        </div>
                        {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                    </>
                )
                    // ========== NOTES LINES ===========
                    : (props.line.note) ? (
                        <>
                            <div title="Hold to Drag!" id={`n_${props.id}`} className={`l_${props.id} row-grid-note touch-manipulation z-1`}>
                                <span className='w-auto noprintdplay m-auto flex justify-evenly'>
                                    {inputDisabled ?
                                        <>
                                            <button aria-label="edit" className=' btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                            <a aria-label="delete" className=' btn btn-xs btn-ghost text-red-600' href="#my-modal-2" onClick={() => setSelectedLine(formData)}><BiTrash /></a>
                                        </> :
                                        <>
                                            <button aria-label="save" className=' btn btn-xs btn-ghost text-green-500 text-lg' onClick={(e) => saveHandler(e)}>
                                                <MdDone />
                                            </button>
                                            <button aria-label="undo" className=' btn btn-xs btn-ghost text-sm text-red-500' onClick={(e) => cancelHandler(e)}>
                                                x
                                            </button>
                                        </>}
                                </span>
                                {/* Normal mode display the span when editing displays the input */}
                                {
                                    inputDisabled ?
                                        <>
                                            <span className={`scroll-day font-extrabold`}>{formData.note}</span>

                                        </> :
                                        <>
                                            <input
                                                onFocus={(e) => onFocus(e)}
                                                onChange={e => onChange(e)} id="note"
                                                type="text" placeholder="" defaultValue={formData.note} ref={firstInputRef}
                                                className={`input input-ghost text-center resize-none w-full font-extrabold max-w-xs scroll-day`}
                                            />
                                        </>
                                }
                                <span className=" w-full flex justify-end">
                                    {
                                        adding.isAdding ? (
                                            <button aria-label="add line" className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto'>
                                                <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                                            </button>) : ""
                                    }
                                </span>
                            </div>
                            {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                        </>
                    )
                        // =========== SCENE LINES ===========
                        : (
                            <>
                                <div
                                    style={formData.camera === "INT." ? style4.INT : style4.EXT}
                                    title="Hold to Drag!"
                                    className={`l_${props.id} row-grid touch-manipulation -z-10`}
                                    id={`s_${props.id}`}
                                >
                                    <span className="w-full noprintdplay m-auto flex">
                                        {inputDisabled ? (
                                            <>
                                                <button aria-label="edit" className=" btn btn-xs btn-ghost" onClick={(e) => onEditClick(e)}>
                                                    <BiEditAlt />
                                                </button>
                                                <a
                                                    className=" btn btn-xs btn-ghost text-red-600"
                                                    onClick={() => setSelectedLine(formData)}
                                                    href="#my-modal-2"
                                                    aria-label="delete"
                                                >
                                                    <BiTrash />
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <button aria-label="save" className=' btn btn-xs btn-ghost text-green-500 text-lg' onClick={(e) => saveHandler(e)}>
                                                    <MdDone />
                                                </button>
                                                <button aria-label="undo" className=' btn btn-xs btn-ghost text-sm text-red-500' onClick={(e) => cancelHandler(e)}>
                                                    x
                                                </button>
                                            </>
                                        )}
                                    </span>
                                    {inputDisabled ? (
                                        <>
                                            <span className="text-sm ">{formData.scene}</span>
                                        </>) : (
                                        <>
                                            <textarea
                                                onFocus={(e) => onFocus(e)}
                                                onChange={(e) => onChange(e)}
                                                id="scene"
                                                type="text"
                                                placeholder=""
                                                defaultValue={formData.scene}
                                                ref={firstInputRef}
                                                className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                    ? "pointer-events-none"
                                                    : "pointer-events-auto"
                                                    }`}
                                            />
                                        </>
                                    )}
                                    {inputDisabled ? (<><span className="text-sm ">{formData.camera}</span></>) : (
                                        <>
                                            <textarea
                                                onFocus={(e) => onFocus(e)}
                                                onChange={(e) => onChange(e)}
                                                id="camera"
                                                type="text"
                                                placeholder=""
                                                defaultValue={formData.camera}
                                                className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                    ? "pointer-events-none"
                                                    : "pointer-events-auto"
                                                    }`}
                                            />
                                        </>
                                    )}
                                    {inputDisabled ? (<><span className="text-sm w-32 sm:w-52 whitespace-pre-wrap break-words h-auto ">{formData.summary}</span> </>) : (
                                        <>
                                            <textarea
                                                onFocus={(e) => onFocus(e)}
                                                ref={styleSummary}
                                                onChange={(e) => onChange(e)}
                                                id="summary"
                                                type="text"
                                                placeholder=""
                                                defaultValue={formData.summary}
                                                className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                    ? "pointer-events-none"
                                                    : "pointer-events-auto"
                                                    }`}
                                            />
                                        </>
                                    )}
                                    {inputDisabled ? (<><span className="text-sm whitespace-pre-wrap break-words">{formData.location}</span> </>) : (
                                        <>
                                            <textarea
                                                onFocus={(e) => onFocus(e)}
                                                onChange={(e) => onChange(e)}
                                                id="location"
                                                type="text"
                                                placeholder=""
                                                defaultValue={formData.location}
                                                className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled
                                                    ? "pointer-events-none"
                                                    : "pointer-events-auto"
                                                    }`}
                                            />
                                        </>
                                    )}
                                    <span className={`my-auto w-full ${adding.isAdding ? "flex justify-end" : "flex justify-center"}`}>
                                        {inputDisabled ? (<><span className="text-sm ">{formData.page_length}</span> </>) : (
                                            <>
                                                <textarea
                                                    onFocus={(e) => onFocus(e)}
                                                    onChange={(e) => onChange(e)}
                                                    id="page_length"
                                                    type="text"
                                                    placeholder=""
                                                    defaultValue={formData.page_length}
                                                    className={
                                                        `textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll 
                                                ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`
                                                    }
                                                />
                                            </>
                                        )}
                                        {adding.isAdding ? (
                                            <button aria-label="add line" className="btn btn-xs btn-ghost text-blue-500 text-xl my-auto">
                                                <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                                            </button>) : ("")}
                                    </span>
                                </div>
                                {/* this is the module that will display the delete confirm when clicking on the delete button*/}
                                {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                            </>
                        )
            }

        </>
    )

}

export default SortableItem