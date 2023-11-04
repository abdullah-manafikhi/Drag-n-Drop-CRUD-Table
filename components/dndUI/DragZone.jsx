import { useState, useRef, useEffect, useLayoutEffect, useContext } from "react";
import { PropTypes } from "prop-types";
import TableContext from '../context/TableContext.js.jsx';
import SortableItem from "./SortableItem";
import PrintSortableItem from "../PrintSortableItem.jsx";
import { MdSettingsEthernet } from "react-icons/md";
import { toast } from 'react-toastify'
import axios from 'axios'


function DragZone({ items, style4 }) {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [touch, setTouch] = useState(false)

    const { addLine, setAddLine, setItems, tableInfo, selectedLine, isSaved, setIsSaved } = useContext(TableContext);

    useEffect(() => {
        setData(items)
    }, [items])


    // ========= USERREFs =========
    const dragItem = useRef(null);
    // the line that the pointer is over it after dragging a line
    const dragOverItem = useRef({data: {id: "0"}});

    useEffect(() => {
        if (addLine.type) {
            let newItems = data.slice(0, addLine.index + 1)
            newItems.push({ id: data.length + 1, [addLine.type]: "New" })
            const secondPart = data.slice(addLine.index + 1, data.length)
            newItems = newItems.concat(secondPart)
            setItems(newItems)
            let params = {}
            newItems.forEach((item, index) => {
                if (item.hasOwnProperty("day") || item.hasOwnProperty("note")) {
                    params = { ...params, [index]: item }
                }
            })
            params = { days: JSON.stringify(params) }
            putApiCall(params)
        }
    }, [addLine])

    // This effect is for preventing the user from reloading before he saves the table
    // useEffect(() => {
    //     const beforeunload = (e) => {
    //         e.preventDefault();
    //         e.returnValue = ""
    //     };
    //     if (!isSaved) {
    //         window.addEventListener("beforeunload", beforeunload);
    //     }
    //     else {
    //         window.removeEventListener("beforeunload", beforeunload)
    //     }
    //     return () => {
    //         window.removeEventListener("beforeunload", beforeunload);
    //         // router.events.off("routeChangeStart", shit);
    //     };
    // }, [isSaved]);


    // ===========================================
    // *************** MOUSE EVENTS **************
    // ===========================================



    useEffect(() => {
        // defining x and dragFlag globaly
        globalThis.x = null
        globalThis.dragFlag = false
    }, [])

    const [dragOverlay, setDragOverlay] = useState(null)

    const animatedLine = useRef(null)

    const onDragStart = (e, index) => {
        // e.currentTarget.classList.add("hello")
        const trgt = e.currentTarget
        animatedLine.current = e.currentTarget.id
        x = setTimeout(() => {
            trgt.classList.add("hello")
            dragFlag = true
            // e.target.classList.add("dragging")
            dragItem.current = { data: data[index], index: index }
            dragOverItem.current = { data: data[index], index: index };
            // getting all the lines
            globalThis.lines = [...document.querySelectorAll(".draggable-line")];
            // creating array of objects that cotains the folowing info
            globalThis.heights = lines.map((line, index) => {
                let rec = line.getBoundingClientRect();
                return { id: line.id, index: index, Y: rec.height + rec.top };
            });
        }, 300)
    };  

    const [overlayStyle, setOverlayStyle] = useState({})

    const onDragOver = (e) => {
        e.preventDefault()
    }

    const onDragEnter = (e) => {
        console.log("its enterring: ", e.currentTarget.getAttribute("data-index"))
        // this condition is for preventing the overlay element from blocking the drag scroll
        // if (e.clientY < window.innerHeight * 0.9 && e.clientY > window.innerHeight * 0.1) {
        //     setOverlayStyle(prev => ({ top: e.clientY - 30, transition: "300ms" }))
        // }
        if (dragFlag) {
            e.preventDefault();
            if ((animatedLine.current) !== e.currentTarget.id) {
                const index = e.currentTarget.getAttribute("data-index")
                // const index = data.findIndex(item => {
                //    return item.id === Number(e.currentTarget.id)})
                dragOverItem.current = { data: data[index], index: index };
                console.log("its enterring: ", e.currentTarget.id, index)
                const oldOverItem = document.getElementById(animatedLine.current)
                oldOverItem.classList.remove("dragging")
                animatedLine.current = e.currentTarget.id
                e.currentTarget.classList.add("dragging")

            }
            // after dragging a line when entering new line add "dragging class"
        }
    };

    const onDragLeave = (e) => {
        // e.preventDefault();
        if (dragFlag) {
            // after dragging a line when leaving an entered line remove "dragging class"
            
        }
    };

    const onDragEnd = (e, index) => {
        setDragOverlay(null)
        // dragOverlay.current = null
        if (dragFlag) {
            e.currentTarget.classList.remove("hello")
            e.preventDefault();
            const newData = [...data];
            newData.splice(dragItem.current.index, 1);
            // Adding item to the array
            const over = dragOverItem.current.index
            if(dragItem.current.index < over){
                newData.splice(over === 0 ? over : over-1, 0, dragItem.current.data);
            }
            else{
                newData.splice(over, 0, dragItem.current.data);
            }
            console.log("over: ", over,"data length: ",  data.length , "dragged: ", dragItem.current.data.id)
            dragItem.current = {
                ...dragItem.current,
                index: dragOverItem.current.index,
            };
            setData(newData);
            setItems(newData)
            if (isSaved) {
                setIsSaved(false)
            }
            onSave(newData)
            setRefresh((prev) => !prev);
        }
        clearTimeout(x)
        dragItem.current = null
        const draggings = [...document.querySelectorAll(".dragging")]
        draggings.forEach(dragging => {
            dragging.classList.remove("dragging")
        })
        dragFlag = false
        clearTimeout(x)
    };


    // ===========================================
    // *************** TOUCH EVENTS **************
    // ===========================================

    let y = null
    const pointerDown = (e, index) => {
        const trgt = e.currentTarget
        if (e.pointerType !== "mouse") {
            // check the clearTimout in the pointerup event 
            y = setTimeout(() => {
                dragFlag = true
                trgt.classList.add("dragging")
                dragItem.current = { data: data[index], index: index };
                setTouch(true)
            }, 300)
        }
    }


    const pointerMove = (e, index) => {
        if (e.pointerType !== "mouse") {
            if (dragFlag) {
                e.currentTarget.style.position = "fixed"
                e.currentTarget.style.width = "80%"
                e.currentTarget.style.top = `${e.clientY}px`
                e.currentTarget.style.zIndex = `+1000`
                // scrolling when reaching the last part of the screen
                if (e.clientY > window.innerHeight * 0.9) {
                    window.scrollBy(0, 20)
                }
                // scrolling when reaching the first part of the screen
                if (e.clientY < window.innerHeight * 0.1) {
                    window.scrollBy(0, -20)
                }
            }
        }
    }

    const pointerUp = (e, index) => {
        e.preventDefault()
        if (e.pointerType !== "mouse") {
            e.currentTarget.style.position = "relative"
            e.currentTarget.style.width = "100%"
            e.currentTarget.style.top = "0px"
            if (dragFlag) {
                globalThis.lines = [...document.querySelectorAll(".draggable-line")];
                // creating array of objects that cotains the following info
                globalThis.heights = lines.map((line, indx) => {
                    let rec = line.getBoundingClientRect();
                    //"index parameter" getting the real index of the line from the set-sort custom attribute                          
                    return { id: line.id, index: indx, Y: indx === index ? 0 : rec.height + rec.top };
                });
                const current = heights.find((line) => { return (e.clientY) - (line.Y) < -10 });
                dragOverItem.current = { data: data[current.index], index: current.index }
                if (dragOverItem.current.data) {
                    const newData = [...data];
                    newData.splice(Number(dragItem.current.index), 1);
                    // Adding item to the array
                    newData.splice(dragOverItem.current.index, 0, dragItem.current.data);
                    dragItem.current = {
                        ...dragItem.current,
                        index: dragOverItem.current.index,
                    };
                    setData(newData);
                    setItems(newData)
                    setRefresh((prev) => !prev);
                    onSave(newData)
                    dragItem.current = null
                }
                if (isSaved) {
                    setIsSaved(false)
                }
            }
            const draggings = [...document.querySelectorAll(".dragging")]
            draggings.forEach(dragging => {
                dragging.classList.remove("dragging")
                dragging.classList.remove("hello")
            })
            clearTimeout(y)
            setTouch(false)
            dragFlag = false
            dragItem.current = null
        };

    }

    const onPointerCancel = (e) => {
        if (e.pointerType !== "mouse") {
            if (dragItem.current === null) {
                setRefresh((prev) => !prev);
                clearTimeout(y)
                clearTimeout(x)
                dragItem.current = null
                dragFlag = false
                const draggings = [...document.querySelectorAll(".dragging")]
                draggings.forEach(dragging => {
                    dragging.classList.remove("dragging")
                    dragging.classList.remove("hello")
                })
            }
        }
    }

    const onSave = async (newData) => {
        let days = {}
        newData.forEach((item, index) => {
            if (item.hasOwnProperty("day")) {
                days = { ...days, [index]: item }
            }
        })
        if ((dragItem.current.data).hasOwnProperty("day")) {
            const params = { days: JSON.stringify(days) }
            putApiCall(params)
        }
        else if ((dragItem.current.data).hasOwnProperty("scene")) {
            let itemsNoDays = []
            let originalIndex
            let newIndex

            items.forEach((item, index) => {
                if (!item.hasOwnProperty("day")) {
                    itemsNoDays.push(item)
                }
            })

            originalIndex = itemsNoDays.findIndex(item => (Number(item.id) === Number(dragItem.current.data.id)))
            if ((dragOverItem.current.data).hasOwnProperty("day")) {
                // IF THE DRAGGED OVER ITEM IS DAY OR NOTE LINE THEN WORK WITH PREVIOUS SCENE LINE
                newIndex = itemsNoDays.findIndex(item => (Number(item.id) === Number(items[Number(dragOverItem.current.index) - 1].id)))
            }
            else {
                newIndex = itemsNoDays.findIndex(item => (Number(item.id) === Number(dragOverItem.current.data.id)))
            }
            const params = { original_index: originalIndex, new_index: newIndex, days: JSON.stringify(days) }
            putApiCall(params)
        }
    }

    const onDelete = (e) => {
        let days = {}

        // IF THE DELETED LINE IS DAY OR NOTE LINE
        if (!selectedLine.hasOwnProperty("scene")) {
            // PUTTING THE DAYS & NOTE LINE IN AN OBJECT
            data.forEach((item, index) => {
                if (!selectedLine.hasOwnProperty("scene") && selectedLine.id !== item.id) {
                    days = { ...days, [index]: item }
                }
            })
            // DELETING IT FORM THE CLIENT SIDE
            setItems(prevState => {
                return prevState.filter(item => item.id !== selectedLine.id)
            })
            // DELETING IT ON FROM THE SERVER SIDE
            const params = { days: JSON.stringify(days) }
            putApiCall(params, true)
        }

        // IF THE DELETED LINE IS SCENE LINE
        else if (selectedLine.hasOwnProperty("scene")) {
            let itemsNoDays = []
            items.forEach((item, index) => {
                if (item.hasOwnProperty("scene")) {
                    itemsNoDays.push(item)
                }
            })
            const noDaysArrLen = itemsNoDays.length
            // DELETING IT FROM THE CLIENT SIDE
            setItems(prevState => {
                let newItems = [...prevState]
                newItems = newItems.filter((item, index) => {
                    if ((index < noDaysArrLen && itemsNoDays[index]).id === selectedLine.id) {
                        const params = { original_index: index, new_index: -1 }
                        // DELETING FROM THE SERVER SIDE
                        putApiCall(params, true)
                    }
                    if (item.id === selectedLine.id) {
                        return false
                    }
                    else {
                        return true
                    }
                })
                return newItems
            })
        }
    }

    const putApiCall = async (params, isDelete) => {
        setIsSaved(false)
        try {
            const response = await axios.put(
                `http://movieapp-env.eba-xgguxtgd.us-west-1.elasticbeanstalk.com/api/stripboards/${tableInfo.id}`, params)
            if (response.status === 200) {
                if (isDelete) {
                    toast.success(`Deleted successfully!`)
                }

                setIsSaved(true)
            }
        }
        catch (err) {
            console.log(err)
            toast.error(`${err.message}`)
        }
    }

    return (
        <div
            id="container"
            className={`relative w-full gap-y-0.5 grid grid-cols-1 pb-12 ${touch ? " touch-none" : "touch-manipulation "} text-black `}
        >
            <span className="fixed bottom-0 left-6 animate-pulse">{!isSaved ? "Saving..." : ""}</span>
            {/* <span
                style={overlayStyle}
                className={`${dragOverlay !== null ? "fixed" : "hidden"} overflow-visible lines-width mx-auto`}
            >
                {dragOverlay !== null ? (
                    <PrintSortableItem
                        key={dragOverlay.id}
                        index={1000}
                        id={dragOverlay.id}
                        line={dragOverlay}
                        value={`Item ${dragOverlay.id}`}
                    />
                ) : ""}
            </span> */}

            {data.map((line, index) => (
                <div
                    draggable
                    data-index={index}
                    key={index}
                    id={line.id}
                    className={`w-full cursor-move transition-transform draggable-line`}
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragEnter={(e) => onDragEnter(e, index)}
                    onDragLeave={(e) => onDragLeave(e, index)}
                    onDragOver={(e) => onDragOver(e)}
                    onDragEnd={(e) => onDragEnd(e, index)}

                    onPointerDown={(e) => pointerDown(e, index)}
                    onPointerMove={(e) => pointerMove(e, index)}
                    onPointerUp={(e) => pointerUp(e, index)}
                    onPointerCancel={(e) => { onPointerCancel(e) }}
                >
                    <SortableItem
                        key={line.id}
                        index={index}
                        id={line.id}
                        line={line}
                        style4={style4}
                        value={`Item ${line.id}`}
                    />
                </div>
            ))}
            {/* ========================== DELETE MODAL =================== */}
            <div className="modal" id="my-modal-2">
                <div className="modal-box">
                    <p className="py-4">Are you sure you want to delete <strong>{selectedLine.scene || selectedLine.day || selectedLine.note}</strong>!</p>
                    <div className="modal-action">
                        <a href={`#cls`} className="btn btn-ghost">Cancel</a>
                        <a href="#cls" className="btn bg-red-500 border-none" onClick={(e) => onDelete(e)}>Delete</a>
                    </div>
                </div>
            </div>
        </div >)
}

DragZone.defaultProps = {
    data: [],
};

DragZone.propTypes = {
    data: PropTypes.array,
};

export default DragZone;
