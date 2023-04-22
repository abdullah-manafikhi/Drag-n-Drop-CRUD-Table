import { useState, useRef, useEffect, useContext, useLayoutEffect } from "react";
import { PropTypes } from "prop-types";
import TableContext from '../context/TableContext.js.jsx';
import SortableItem from "./SortableItem";
import PrintSortableItem from "../PrintSortableItem.jsx";
import { gsap } from "gsap";


function DragZone({ items, style4 }) {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [touch, setTouch] = useState(false)

    const { addLine, setAddLine, setItems, selectedLine, isSaved, setIsSaved } = useContext(TableContext);

    useEffect(() => {
        setData(items)
    }, [items])
    // start gsap animation 
    const container = useRef(null);
    useLayoutEffect(() => {
        let theTargetAnimation = gsap.utils.toArray("#container  div.gsapTargetLol")
        function getFirstTenItems(arr) {
            console.log(arr.slice(0, 10))
            return arr.slice(0, 10);
        }
        let ctx = gsap.context(() => {

            gsap.fromTo(getFirstTenItems(theTargetAnimation), { y: 10, duration: 1, stagger: 0.1 }, { y: 0, duration: 0.5, stagger: 0.1 })

        }, container);
        return () => ctx.revert();
    }, [items])
    // end gsap animation 

    // ========= USERREFs =========
    const dragItem = useRef(null);
    // the line that the pointer is over it after dragging a line
    const dragOverItem = useRef(null);

    useEffect(() => {
        if (addLine.type) {
            let newItems = data.slice(0, addLine.index + 1)
            newItems.push({ id: data.length + 1, [addLine.type]: "New" })
            const secondPart = data.slice(addLine.index + 1, data.length)
            newItems = newItems.concat(secondPart)
            setItems(newItems)

            // TO PREVENT REFRESHING
            if (isSaved) {
                setIsSaved(false)
            }
        }
    }, [addLine])

    // This effect is for preventing the user from reloading before he saves the table
    useEffect(() => {
        const beforeunload = (e) => {
            e.preventDefault();
            e.returnValue = ""
        };
        if (!isSaved) {
            window.addEventListener("beforeunload", beforeunload);
        }
        else {
            window.removeEventListener("beforeunload", beforeunload)
        }
        return () => {
            window.removeEventListener("beforeunload", beforeunload);
            // router.events.off("routeChangeStart", shit);
        };
    }, [isSaved]);

    // ===========================================
    // *************** MOUSE EVENTS **************
    // ===========================================

    // let x = null
    // let dragFlag = false

    useEffect(() => {
        console.log("shit")
        globalThis.x = null
        globalThis.dragFlag = false
    }, [])

    const [dragOverlay, setDragOverlay] = useState(null)
    // const dragOverlay = useRef(null)
    const fuckshit = useRef()

    const onDragStart = (e, index) => {
        e.currentTarget.classList.add("hello")
        e.dataTransfer.setDragImage(e.target, window.outerWidth, window.outerHeight)
        setDragOverlay(items[index])
        setOverlayStyle(prev => ({ top: e.clientY, transition: "100ms" }))
        // dragOverlay.current = (items[index])
        // check the clearTimout in the dragEnd event 
        x = setTimeout(() => {
            console.log("drag start")
            dragFlag = true
            e.target.classList.add("dragging")
            dragItem.current = { data: data[index], index: index };
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

    const onDragEnter = (e, index) => {
        // this condition is for preventing the overlay element from blocking the drag scroll
        if (e.clientY < window.innerHeight * 0.9 && e.clientY > window.innerHeight * 0.1) {
            setOverlayStyle(prev => ({ top: e.clientY - 30, transition: "300ms" }))
        }
        dragOverItem.current = { data: data[index], index: index };
        if (dragFlag) {
            e.preventDefault();
            // after dragging a line when entering new line add "dragging class"
            e.currentTarget.classList.add("dragging");
        }
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        if (dragFlag) {
            // after dragging a line when leaving an entered line remove "dragging class"
            e.currentTarget.classList.remove("dragging");
        }
    };

    const onDragEnd = (e) => {
        setDragOverlay(null)
        // dragOverlay.current = null
        console.log(dragFlag)
        if (dragFlag) {
            console.log(e.currentTarget)
            e.currentTarget.classList.remove("hello")
            console.log(dragOverItem.current)
            e.preventDefault();
            const newData = [...data];
            newData.splice(dragItem.current.index, 1);
            // Adding item to the array
            newData.splice(dragOverItem.current.index, 0, dragItem.current.data);
            dragItem.current = {
                ...dragItem.current,
                index: dragOverItem.current.index,
            };
            setData(newData);
            setItems(newData)
            setRefresh((prev) => !prev);
            if (isSaved) {
                setIsSaved(false)
            }
        }
        else {
            console.log("its fucking")
            setDragOverlay(null)
            // dragOverlay.current = null
            clearTimeout(x)
            dragItem.current = null
        }
        const draggings = [...document.querySelectorAll(".dragging")]
        draggings.forEach(dragging => {
            dragging.classList.remove("dragging")
        })
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
                    const test = [...data];
                    test.splice(Number(dragItem.current.index), 1);
                    // Adding item to the array
                    test.splice(dragOverItem.current.index, 0, dragItem.current.data);
                    dragItem.current = {
                        ...dragItem.current,
                        index: dragOverItem.current.index,
                    };
                    setData(test);
                    setItems(test)
                    setRefresh((prev) => !prev);
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
            console.log("pointer cancel")
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

    const onDelete = (e) => {
        setItems(prevState => {
            let newItems = [...prevState]
            newItems = newItems.filter(item => item.id !== selectedLine.id)
            return newItems
        })
        if (isSaved) {
            setIsSaved(false)
        }
    }

    console.log(items)

    return (
        <div
            id="container"
            ref={container}
            className={`relative w-full gap-y-0.5 grid grid-cols-1 ${touch ? " touch-none" : "touch-manipulation "} text-black `}
        >
            <>
                <span
                    style={overlayStyle}
                    className={`${dragOverlay !== null ? "fixed" : "hidden"} lines-width mx-auto`}
                    ref={fuckshit}
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
                </span>

                {data.map((line, index) => (
                    <div
                        draggable
                        key={index}
                        id={line.id}
                        className={`w-full gsapTargetLol cursor-move draggable transition-transform draggable-line`}
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
            </>
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
