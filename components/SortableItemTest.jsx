import { useState, useRef, useEffect, useContext } from 'react';
import { BiTrash, BiEditAlt, BiCross, BiTv } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import TableContext from './context/TableContext.js';
import { PopOver } from '../components/PopOver'
import AddLine from './AddLine.jsx';

function SortableItemTest(props) {

    // this is the table line "row" data
    const [formData, setFormData] = useState(props.line)

    const [inputDisabled, setInputDisabled] = useState(true)

    const [style3, setStyle3] = useState({ backgroundColor: "" })

    // getting the table from the context
    const { cursor, daysMap, setDaysMap, adding, setAdding } = useContext(TableContext)
    // This for focusing on the scene input when updateing start
    const firstInputRef = useRef()

    const styleSummary = useRef()
    useEffect(() => {
        setTimeout(() => {
            const trgt = [...document.querySelectorAll("textarea")]
            trgt.forEach(element => {
                console.log(element)
                element.style.height = "auto";
                element.style.height = trgt.scrollHeight + "px";
            });
        }, 1000);
    }, [inputDisabled])

    useEffect(() => {
        if (daysMap !== null) {
            // console.log("its getting there")
            const LsColors = JSON.parse(localStorage.getItem("colors"))
            let l = 0
            let r = daysMap.data.length - 1
            let mid = 0

            // =====================================
            // *********** BINARY SEARCH ************
            // ======================================

            // This loop determines the line colors useing dpending on the day line color using binary search
            while (l + 1 < r) {
                mid = Math.floor((l + r) / 2)
                if (props.index <= daysMap.data[mid].index) {
                    r = mid
                }
                else if (props.index >= daysMap.data[mid].index) {
                    l = mid
                }
            }
            // console.log(l, r)
            if (daysMap.data[l] !== undefined) {
                setStyle3(prevState => (
                    {
                        ...prevState,
                        backgroundColor: daysMap.colors[daysMap.data[l].id] === "white" ? LsColors[daysMap.data[l].id] : daysMap.colors[daysMap.data[l].id]
                    }
                ))
            }

            if (Object.hasOwn(formData, "day")) {
                setStyle3(prevState => (
                    {
                        ...prevState,
                        backgroundColor: daysMap.colors[formData.id] === "white" ? LsColors[formData.id] : daysMap.colors[formData.id]
                    }
                ))
            }
        }
    }, [daysMap])

    // functions start here
    // This function is reponsible for allowing the user to save the edits that he/she made is on the row 
    const saveIconHundler = (e) => {
        console.log("save me pls im :", e.currentTarget)
        // do some save action here 
        window.alert("you edit the sence number (XX) saved ")

        setInputDisabled(prevState => {
            console.log(prevState)
            return true
        })
    }

    const cancelIconHundler = (e) => {
        console.log("cancel me pls im :", e.currentTarget)
        setInputDisabled(prevState => {
            console.log(prevState)
            return true
        })
    }

    // This function is reponsible for allowing the user to edit the row, focusing on the first input and highliting its text 
    const onEditClick = (e) => {
        console.log(e.currentTarget)
        setInputDisabled(prevState => {
            if (prevState) {
                console.log(firstInputRef.current)
                if (firstInputRef.current !== null) {
                    setTimeout(() => {
                        firstInputRef.current.focus(); // onEditClick => focus=> showing problem on click  on day or note becuase there is no text area 
                        firstInputRef.current.setSelectionRange(0, firstInputRef.current.value.length);
                        console.log("focused");
                    }, 100);
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

    const onChangeColor = (clr) => {
        setDaysMap(prevState => {
            localStorage.setItem("colors", JSON.stringify({ ...prevState.colors, [formData.id]: clr }))
            return {
                data: prevState.data,
                colors: { ...prevState.colors, [formData.id]: clr }
            }
        })
    }


    if (daysMap === null) {
        return (<><h2>hellp</h2></>)
    }
    else {
        // ========== DAYS LINES ===========
        if (props.line.day) {
            return (
                <>
                    <div title="Hold to Drag!" style={style3} className={`row-grid-day touch-manipulation bg-red-600 z-1 ${cursor} `}>
                        <span className=' w-auto noprintdplay m-auto flex justify-evenly'>
                            {inputDisabled ?
                                <>
                                    <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                    <label className='z-50 btn btn-xs btn-ghost text-red-600' htmlFor="my-modal-3" onClick={() => console.log("dleete")}><BiTrash /></label>
                                </> :
                                <>
                                    <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => saveIconHundler(e)}>save</button>
                                    <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => cancelIconHundler(e)}>cancel</button>
                                </>}
                        </span>

                        <span className='my-auto'>
                            {/* Normal mode display the span when ediing display the input */}
                            <input
                                onChange={e => onChange(e)} id="day"
                                type="text" placeholder="" defaultValue={`Day ${formData.day}`} ref={firstInputRef}
                                className={`input input-ghost text-center resize-none w-full font-extrabold max-w-xs scroll-day ${inputDisabled ? "pointer-events-none hidden" : "pointer-events-auto"}`}
                            />
                            <span className={`${inputDisabled ? "" : "hidden"} scroll-day font-extrabold`}>Day {formData.day}</span>
                        </span>
                        <div className="flex w-full justify-end">
                            <PopOver color={daysMap.colors[formData.id]} onChange={onChangeColor} />
                            {adding.isAdding ? (<button className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto '>
                                <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                            </button>) : ""}
                        </div>
                    </div>
                    {/* this is the module that will display the delete confirm when clicking on the delete button*/}
                    <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <p className="py-4">Are you sure you want to delete <strong>{formData.scene}</strong>!</p>
                            <div className="modal-action">
                                <label htmlFor="my-modal-3" className="btn btn-ghost">Cancel</label>
                                <label htmlFor="my-modal-3" className="btn bg-red-500 border-none">Delete</label>
                            </div>
                        </div>
                    </div>
                    {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                </>
            )
        }
        // ========== NOTES LINES ===========
        else if (props.line.note) {
            return (
                <>
                    <div title="Hold to Drag!" style={style3} className={`row-grid-note touch-manipulation z-1 ${cursor}`}>
                        <span className='w-auto noprintdplay m-auto flex justify-evenly'>
                            {/* inputDisable ?  *** ENOUGH *** */}
                            {inputDisabled === true ?
                                <>
                                    <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                    <label className='z-50 btn btn-xs btn-ghost text-red-600' htmlFor="my-modal-3" onClick={() => console.log("dleete")}><BiTrash /></label>
                                </> :
                                <>
                                    <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => saveIconHundler(e)}>save</button>
                                    <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => cancelIconHundler(e)}>cancel</button>
                                </>}
                        </span>
                        <span className='my-auto'>
                            {inputDisabled ? (
                                <input
                                    onChange={e => onChange(e)} id="note"
                                    type="text" placeholder="" defaultValue={formData.note} ref={firstInputRef}
                                    className={`input input-ghost text-center resize-none w-full font-extrabold max-w-xs scroll-day ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`}
                                />) : <span className="text-sm ">{formData.note}</span>}
                        </span>
                        <span className=" w-full flex justify-end">

                            {adding.isAdding ? (<button className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto'>
                                <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />                        </button>) : ""}
                        </span>
                    </div>
                    {/* this is the module that will display the delete confirm when clicking on the delete button*/}
                    <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <p className="py-4">Are you sure you want to delete <strong>{formData.scene}</strong>!</p>
                            <div className="modal-action">
                                <label htmlFor="my-modal-3" className="btn btn-ghost">Cancel</label>
                                <label htmlFor="my-modal-3" className="btn bg-red-500 border-none">Delete</label>
                            </div>
                        </div>
                    </div>
                    {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                </>
            )
        }

        // =========== SCENE LINES ===========
        else {
            return (
                <>
                    <div title="Hold to Drag!" style={style3} className={`row-grid touch-manipulation z-1 ${cursor}`}>
                        <span className='w-full  noprintdplay m-auto flex'>

                            <span>
                                {inputDisabled ?
                                    <>
                                        <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => onEditClick(e)}><BiEditAlt /></button>
                                        <label className='z-50 btn btn-xs btn-ghost text-red-600' htmlFor="my-modal-3" onClick={() => console.log("dleete")}><BiTrash /></label>
                                    </> :
                                    <>
                                        <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => saveIconHundler(e)}>save</button>
                                        <button className='z-50 btn btn-xs btn-ghost' onClick={(e) => cancelIconHundler(e)}>cancel</button>
                                    </>}
                            </span>
                        </span>
                        <span className='my-auto'>
                            {inputDisabled ?
                                <>
                                    <span className="text-sm ">{formData.scene}</span>
                                </> :
                                <>
                                    <textarea
                                        onChange={e => onChange(e)} id="scene"
                                        type="text" placeholder="" defaultValue={formData.scene} ref={firstInputRef}
                                        className={`textarea textarea-ghost bg-none textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`}
                                    />
                                </>
                            }
                        </span>
                        <span className='my-auto'>
                            {inputDisabled ?
                                <>
                                    <span className="text-sm ">{formData.camera}</span>
                                </> :
                                <>
                                    <textarea
                                        onChange={e => onChange(e)} id="camera"
                                        type="text" placeholder="" defaultValue={formData.camera}
                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`}
                                    />
                                </>
                            }
                        </span>
                        <span className='my-auto'>
                            {inputDisabled ?
                                <>
                                    <span className="text-sm ">{formData.summary}</span>
                                </> :
                                <>
                                    <textarea
                                        ref={styleSummary}
                                        onChange={e => onChange(e)} id="summary"
                                        type="text" placeholder="" defaultValue={formData.summary}
                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`}
                                    />
                                </>
                            }
                        </span>
                        <span className='my-auto'>
                            {inputDisabled ?
                                <>
                                    <span className="text-sm">{formData.location}</span>
                                </> :
                                <>
                                    <textarea
                                        onChange={e => onChange(e)} id="location"
                                        type="text" placeholder="" defaultValue={formData.location}
                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`}
                                    />
                                </>}
                        </span>
                        <span className='my-auto w-full flex justify-end'>
                            {inputDisabled ?
                                <>
                                    <span className="text-sm ">{formData.page_length}</span>
                                </> :
                                <>
                                    <textarea
                                        onChange={e => onChange(e)} id="page_whole"
                                        type="text" placeholder="" defaultValue={formData.page_length}
                                        className={`textarea textarea-ghost textarea-xs resize-none w-full max-w-xs scroll ${inputDisabled ? "pointer-events-none" : "pointer-events-auto"}`}
                                    />
                                </>}
                            {adding.isAdding ? (<button className='btn btn-xs btn-ghost text-blue-500 text-xl my-auto'>
                                <AiOutlinePlus onClick={() => setAdding({ isAdding: true, id: formData.id })} />
                            </button>) : ""}
                        </span>
                    </div>
                    {/* this is the module that will display the delete confirm when clicking on the delete button*/}
                    <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <p className="py-4">Are you sure you want to delete <strong>{formData.scene}</strong>!</p>
                            <div className="modal-action">
                                <label htmlFor="my-modal-3" className="btn btn-ghost">Cancel</label>
                                <label htmlFor="my-modal-3" className="btn bg-red-500 border-none">Delete</label>
                            </div>
                        </div>
                    </div>
                    {adding.isAdding && formData.id === adding.id ? (<AddLine index={props.index} />) : ""}
                </>
            )
        }

    }

}

export default SortableItemTest