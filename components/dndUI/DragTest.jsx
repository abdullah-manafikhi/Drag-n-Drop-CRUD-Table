import { useState, useRef, useEffect, useContext } from "react";
import { PropTypes } from "prop-types";
import TableContext from '../context/TableContext.js.jsx';
import SortableItemTest from "./SortableItemTest";


function DragTest({ items, style4 }) {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [touch, setTouch] = useState(false)

    const { setCursor, addLine, setAddLine, setItems, selectedLine } = useContext(TableContext);

    useEffect(() => {
        setData(items)
    }, [items])

    // ========= USERREFs =========
    const dragItem = useRef(null);
    // the line that the pointer is over it after dragging a line
    const dragOverItem = useRef(null);

    useEffect(() => {
        if (addLine.type) {
            let newItems = data.slice(0, addLine.index + 1)
            newItems.push({ id: items.length, [addLine.type]: "New" })
            const secondPart = data.slice(addLine.index + 1, data.length - 1)
            newItems = newItems.concat(secondPart)
            setItems(newItems)
        }
    }, [addLine])

    // This effect is for preventing the user from reloading before he saves the table
    useEffect(() => {
        const beforeunload = (e) => {
            e.preventDefault();
            e.returnValue = ""
        };

        window.addEventListener("beforeunload", beforeunload);

        return () => {
            window.removeEventListener("beforeunload", beforeunload);
            // router.events.off("routeChangeStart", shit);
        };
    }, []);


    // ===========================================
    // *************** MOUSE EVENTS **************
    // ===========================================

    let x = null
    let dragFlag = false

    const onDragStart = (e, index) => {
        e.currentTarget.classList.add("hello")

        // check the clearTimout in the dragEnd event 
        x = setTimeout(() => {
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

    const onDragEnter = (e, index) => {
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
            // after dragging a line when leaving an enteed line remove "dragging class"
            e.currentTarget.classList.remove("dragging");
        }
    };

    const onDragEnd = (e) => {
        if (dragFlag) {
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
        }
        else {
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
    }

    return (
        <div
            id="container"
            className={`relative w-full gap-y-0.5 grid grid-cols-1 ${touch ? " touch-none" : "touch-manipulation "} text-black `}
        >
            <>
                {/* ========================== DELETE modal =================== */}
                <div className="modal" id="my-modal-2">
                    <div className="modal-box">
                        <p className="py-4">Are you sure you want to delete <strong>{selectedLine.scene || selectedLine.day || selectedLine.note}</strong>!</p>
                        <div className="modal-action">
                            <a href={`#cls`} className="btn btn-ghost">Cancel</a>
                            <a href="#cls" className="btn bg-red-500 border-none" onClick={(e) => onDelete(e)}>Delete</a>
                        </div>
                    </div>
                </div>
                {data.map((line, index) => (
                    <div
                        draggable
                        key={index}
                        id={line.id}
                        className={`w-full cursor-move draggable transition-transform draggable-line`}
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => onDragEnter(e, index)}
                        onDragLeave={(e) => onDragLeave(e, index)}
                        onDragEnd={(e) => onDragEnd(e, index)}

                        onPointerDown={(e) => pointerDown(e, index)}
                        onPointerMove={(e) => pointerMove(e, index)}
                        onPointerUp={(e) => pointerUp(e, index)}
                        onPointerCancel={(e) => { onPointerCancel(e) }}
                    >
                        <SortableItemTest
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
        </div >)
}

DragTest.defaultProps = {
    data: [],
};

DragTest.propTypes = {
    data: PropTypes.array,
};

export default DragTest;
