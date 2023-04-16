import { useState, useRef, useEffect, useContext } from "react";
import { PropTypes } from "prop-types";
import TableContext from '../context/TableContext.js.jsx';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import SortableItemTest from "./SortableItemTest";
import { gsap } from "gsap";


function DragTest({ items, style4 }) {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [touch, setTouch] = useState(false)

    const { setCursor, addLine } = useContext(TableContext);

    useEffect(() => {
        setData(items)
    }, [items])
    // useEffect(() => {
    //     console.log(document.querySelectorAll('.gsappp'))
    //     const target = document.querySelectorAll('.gsappp')



    //     let ctx = gsap.context(() => {

    //         // gsap.from(senceGsap.current, {  y: -10 ,duration :1,delay: 0.5});

    //         gsap.from(target, 5, {
    //             x: -100,
    //             ease: "power1.inOut",
    //             delay: 1,//make del by id
    //             stagger: {
    //                 amount: 1.5,
    //                 grid: "auto",
    //                 axis: "y",
    //                 from: "end"
    //             }
    //         });

    //     }, document.querySelector('#container'))

    //     return () => ctx.revert();

    // }, [])



    // ========= USERREFs =========
    const dragItem = useRef(null);
    // the line that the pointer is over it after dragging a line
    const dragOverItem = useRef(null);

    useEffect(() => {
        if (addLine.type) {
            let newItems = data.slice(0, addLine.index + 1)
            newItems.push({ id: data.length, [addLine.type]: "New" })
            const test = data.slice(addLine.index + 1, data.length - 1)
            newItems = newItems.concat(test)
            setData(newItems)
        }
    }, [addLine])


    // ===========================================
    // *************** MOUSE EVENTS **************
    // ===========================================

    let x = null
    let dragFlag = false
    let dragged


    const onDragStart = (e, index) => {
        e.currentTarget.classList.add("hello")
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
            // console.log(dragItem.current, index)
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
        console.log("drag end")
        if (dragFlag) {
            e.preventDefault();
            const test = [...data];
            test.splice(dragItem.current.index, 1);
            // Adding item to the array
            test.splice(dragOverItem.current.index, 0, dragItem.current.data);
            dragItem.current = {
                ...dragItem.current,
                index: dragOverItem.current.index,
            };
            console.log(test)
            setData(test);
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
        // e.preventDefault()
        const trgt = e.currentTarget
        if (e.pointerType !== "mouse") {
            y = setTimeout(() => {
                dragFlag = true
                console.log("drag starts")
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
                    window.scrollBy(0, 30)
                }
                // scrolling when reaching the first part of the screen
                if (e.clientY < window.innerHeight * 0.1) {
                    window.scrollBy(0, -15)
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
                    //"index prop" getting the real index of the line from the set-sort custom attribute                          
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

    return (
        <div
            id="container"
            className={`relative w-full gap-y-0.5 grid grid-cols-1 ${touch ? " touch-none" : "touch-manipulation "} text-black `}
        >
            {data.map((line, index) => (
                <div
                    draggable
                    key={index}
                    id={line.id}
                    className={`w-full cursor-move draggable transition-transform draggable-line`}
                    // className={`w-full cursor-move draggable transition-transform draggable-line`}
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
        </div>)
}

DragTest.defaultProps = {
    data: [],
};

DragTest.propTypes = {
    data: PropTypes.array,
};

export default DragTest;



const onDragStart = (e, index) => {
    e.currentTarget.classList.add("hello")
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
        // console.log(dragItem.current, index)
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
    console.log("drag end")
    if (dragFlag) {
        e.preventDefault();
        const test = [...data];
        test.splice(dragItem.current.index, 1);
        // Adding item to the array
        test.splice(dragOverItem.current.index, 0, dragItem.current.data);
        dragItem.current = {
            ...dragItem.current,
            index: dragOverItem.current.index,
        };
        console.log(test)
        setData(test);
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



// react-virtualized update

// const onMouseDown = (e, index) => {
//     e.preventDefault()
//     const trgt = e.currentTarget
//     console.log("mouse down", data[index], e.target)
//     dragged = trgt
//     dragItem.current = { data: data[e.currentTarget.attributes[0].value], index: index };

//     // dragItem.current = { data: data[index], index: index };
//     x = setTimeout(() => {
//         dragFlag = true
//         setTouch(true)
//         dragOverLay.current.style.display = "block"
//         dragOverLay.current.style.width = `${e.target.offsetWidth}px`
//         dragOverLay.current.style.top = `${e.clientY}px`
//         console.log("drag starts", e.clientY)
//         // trgt.style.zIndex = "+100"
//         // trgt.style.backgroundColor = "red"
//         // e.target.style.setProperty('position', 'fixed', 'important')
//         // dragged.style.top = `${e.clientY }px`
//     }, 500);
// }

// const onMouseOver = (e, index) => {
//     e.preventDefault()
//     if (!dragFlag) {
//         // console.log(e.currentTarget.attributes[0].value)
//     }
// }

// const onMouseMove = (e, index) => {
//     // e.preventDefault()
//     if (dragFlag) {
//         dragOverLay.current.style.top = `${e.clientY}px`
//         // dragged.style.setProperty('position', 'fixed', 'important')
//         // dragged.style.top = `${e.clientY }px`
//     }
// }

// const onMouseUp = (e, index) => {
//     console.log("mouse up")
//     // setTouch(false)
//     dragOverLay.current.style.display = "none"
//     dragFlag = false
//     // dragged.style.position = `relative`
//     clearTimeout(x)
//     x = null
// }

// {data.length > 0 ? (
//     <WindowScroller>
//         {({ height, isScrolling, onChildScroll, scrollTop }) => (
//             <AutoSizer disableHeight>
//                 {({ width }) => (
//                     <List
//                         autoHeight
//                         height={height}
//                         width={width} rowHeight={50} rowCount={100} scrollTop={scrollTop}
//                         rowRenderer={({ key, index, style, parent }) => {
//                             return (
//                                 // <div key={key} style={style}>{data[index].location}</div>
//                                 <div
//                                     style={style}
//                                     key={index}
//                                     data-sort={index}
//                                     id={data[index].id}
//                                     className={`w-full cursor-move draggable transition-transform draggable-line ${touch ? " touch-none" : "touch-manipulation "}`}


//                                     // className={`w-full cursor-move draggable transition-transform draggable-line`}
//                                     // onDragStart={(e) => onDragStart(e, index)}
//                                     // onDragOver={(e) => e.preventDefault()}
//                                     // onDragEnter={(e) => onDragEnter(e, index)}
//                                     // onDragLeave={(e) => onDragLeave(e, index)}
//                                     // onDragEnd={(e) => onDragEnd(e, index)}


//                                     // onPointerDown={(e) => pointerDown(e, index)}
//                                     // onPointerMove={(e) => pointerMove(e, index)}
//                                     // onPointerUp={(e) => pointerUp(e, index)}
//                                     onPointerCancel={(e) => { onPointerCancel(e) }}
//                                 >
//                                     <SortableItemTest
//                                         key={data[index].id}
//                                         index={index}
//                                         id={data[index].id}
//                                         line={data[index]}
//                                         style4={style4}
//                                         value={`Item ${data[index].id}`}
//                                     />
//                                 </div>
//                             )
//                         }} />
//                 )}
//             </AutoSizer>
//         )}
//     </WindowScroller>
// ) : ""}