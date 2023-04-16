import { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link'
import TableContext from './context/TableContext.js.jsx';
import Skeleton from './Skeleton.jsx';
import DragTest from './dndUI/DragTest.jsx';
import sortAccordingFor from "./functions/sort.js";
import { BiCaretDown, BiCaretup, BiBrush } from 'react-icons/bi'
import { DATA } from '../assets/data2'
import { PopOver } from './colorPallete/PopOver'



// import { VariableSizeList as List } from 'react-window';

var currentsort = []

function Table() {

    // This state is for lines colors "INT, EXT, DAYS"
    const [style4, setStyle4] = useState({
        INT: { backgroundColor: "#F0F0F0", color: "#000000" },
        EXT: { backgroundColor: "#F9D949", color: "#000000" },
        DAYS: { backgroundColor: "#3C486B", color: "#000000" }
    })
    const [sortPrimery, setSortPrimery] = useState('id');
    const [sortSecond, setSortSecond] = useState('id');
    const [itemPure, setItemPure] = useState([]) //sence with out day 
    // const [sortItem , setSortItem] = useState([]) //sence with out day 
    // const [items, setItems] = useState([])

    const { adding, setAdding, items, setItems } = useContext(TableContext)


    const cameraTag = useRef(null)
    const sceneTag = useRef(null)
    const locatiomTag = useRef(null)
    const lenthTag = useRef(null)
    const summeryTag = useRef(null)

    // ==========================================================================
    // ==========================================================================
    // ========= DELETE THIS FUNCTION IF YOU DONT NEED IT ANYMORE ===============
    // ==========================================================================
    // ==========================================================================
    function sortby(prop) {
        const arrayAfterSort = sortAccordingFor(itemPure, prop, 1, 'id', 0)
        const sortAndDay = addingDays(arrayAfterSort)
        setItems(sortAndDay)
        currentsort = [prop, 1, 'id', 0]
        console.log(currentsort)
        // console.table(itemPure)
        console.log(` sort by ${prop} `)
    }

    const onOptionChangeHandler1 = (event) => {
        setSortPrimery(event.target.value)
        console.log("User Sel- ", sortPrimery)

    }
    const onOptionChangeHandler2 = (event) => {
        setSortSecond(event.target.value)
    }
    useEffect(() => {
       if(itemPure.length > 0){
        const arrayAfterSort = sortAccordingFor(itemPure, sortPrimery, 1, sortSecond, 1)
        const sortAndDay = addingDays(arrayAfterSort)
        setItems(sortAndDay)
        // id
        // camera
        // summary
        // location
        // page_length
        console.log("done ", sortPrimery, sortSecond)
       }
    }, [sortPrimery, sortSecond])

    // const defaultSort = () => {
    //     setSortPrimery('id')
    //     setSortSecond('id')
    //     console.dir(cameraTag.current.style.display)
    //     cameraTag.current.style.display = ''
    // }

    const theadSortbyHundler = (e) => {
        setSortPrimery(`${e}`)
    }

    useEffect(() => {
        // (async () => {
        //     const test = await fetch("http://movieapp-env.eba-xgguxtgd.us-west-1.elasticbeanstalk.com/api/stripboards/10")
        //     const res = await test.json()
        //     setItemPure(res.table_content)
        //     setItems(addingDays(res.table_content))
        // })()
        setItemPure(DATA.table_content)
        setItems(addingDays(DATA.table_content))
    }, [])
    // useEffect(() => {
    //     // console.table(res.table_content)
    //     const hello = addingDays(itemPure)
    //     console.log(hello)
    //     setItems(hello)

    // }, [itemPure])


    const addingDays = (data) => {
        let counter = 0
        let dayCount = 1
        let finalArr = [{ id: `d_${1}`, day: `Day ${dayCount}`, counter: counter }]
        ++dayCount
        data.forEach((line, index) => {
            counter += line.page_length
            finalArr.push(line)
            if (counter > 4.5) {
                finalArr.push({ id: `d_${dayCount}`, day: `Day ${dayCount}`, counter: counter })
                ++dayCount
                counter = 0
            }
        })
        return finalArr
    }

    const onChangeColor = (clr, day) => {
        console.log(clr, day)
        setStyle4(prevState => ({
            ...prevState,
            [day]: { backgroundColor: clr, color: "#000000" }
        }))
    }
    const presetColors = ["#3C486B", "#F0F0F0", "#F9D949", "#F45050", "#3A98B9", "#FFF1DC", "#E8D5C4", "#EEEEEE"];

    return (
        <div>
            <h1 className=' text-3xl font-bold mx-auto w-fit my-8 '>{DATA.name} Strip Board</h1>
            <div className="noprintdplay w-60 h-18 mx-auto p-4 flex justify-between">

                {/* SAVE BUTTON */}
                <button className={`btn  border-none`}>
                    <Link href="/print"> save</Link>
                </button>

                {/* DESGIN BUTTON */}
                <label htmlFor="design-modal" className="btn btn-ghost w-32 flex flex-initial justify-evenly">
                    Design <BiBrush className='h-4 w-4' />
                </label>
            </div>

            {/* ============= SORT SELECT =============== */}
            <div className='w-fit m-auto'>
                <div className="navbar bg-base-300 rounded-box my-4">
                    <div className="flex justify-end flex-1 px-2">
                        <div className="flex  items-center  ">
                            <h2 className="btn btn-ghost rounded-btn">Sort</h2>
                            <div className='flex flex-wrap items-center'>

                                <select value={sortPrimery} onChange={onOptionChangeHandler1} className="select my-1 text-xs select-primary w-auto max-w-xs border-none"  >
                                    <option disabled>Primery</option>
                                    <option value={'id'}  >Default </option>
                                    <option value={'camera'}  >Camera </option>
                                    <option value={'summary'} >Summary</option>
                                    <option value={'location'} >Location</option>
                                    <option value={'page_length'} >Page Length </option>
                                </select>

                                <span className='mx-2'> 	&amp; </span>

                                <select value={sortSecond} onChange={onOptionChangeHandler2} className="select my-1  select-primary w-auto max-w-xs border-none">
                                    <option disabled  >Secondery</option>
                                    <option value={'id'} >Default </option>
                                    <option value={'camera'} >Camera </option>
                                    <option value={'summary'} >Summary</option>
                                    <option value={'location'} >Location</option>
                                    <option value={'page_length'} >Page Length </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*============ PLUS BUTTON FOR ADDING NEW LINES ============  */}
            <div className="noprintdplay mx-auto p-4 fixed bottom-12 right-1 opacity-100 z-50 grid justify-items-end">
                <button onClick={() => setAdding(prevState => ({ ...prevState, isAdding: !prevState.isAdding }))} className={`btn ${adding.isAdding ? "btn-error" : "btn-success"} h-16 w-16 relative rounded-full`}>
                    <span className={`font-normal ${adding.isAdding ? "text-2xl mb-1" : "text-5xl mb-2"} text-2xl rounded-full h-fit w-fit text-white`}>
                        {adding.isAdding ? "x" : "+"}
                    </span>
                </button>
            </div>

            {/* =============== TABLE =============== */}
            <main className='my-container'>
                <div draggable className='table-grid '>
                    {/* This is the main row where the columns names sits */}
                    <div id="tableTitle" className="row-grid">
                        <span className='text-white noprintdplay text-sm sm:text-lg font-bold mx-8'></span>
                        <span onClick={() => theadSortbyHundler('id')} className='text-white flex h-full items-center text-sm sm:text-lg font-bold m-auto'>
                            Scene No.
                            <span ref={sceneTag} className={`self-end ${sortPrimery == 'id' ? "" : "invisible"}`}>
                                <BiCaretDown />
                            </span>
                        </span>
                        <span onClick={() => theadSortbyHundler('camera')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold m-auto'>
                            Camera
                            <span ref={cameraTag} className={`  self-end   ${sortPrimery == 'camera' ? "" : "invisible"}       `}>
                                <BiCaretDown />
                            </span>
                        </span>
                        <span onClick={() => theadSortbyHundler('summary')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold m-auto'>
                            Summary
                            <span className={`  self-end   ${sortPrimery == 'summary' ? "" : "invisible"}`} ref={summeryTag}>
                                <BiCaretDown />
                            </span>
                        </span>
                        <span onClick={() => theadSortbyHundler('location')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold m-auto'>
                            Location
                            <span className={`self-end ${sortPrimery == 'location' ? "" : "invisible"}`} ref={locatiomTag} >
                                <BiCaretDown />
                            </span>
                        </span>
                        <span onClick={() => theadSortbyHundler('page_length')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold mx-8'>
                            Page length
                            <span className={`self-end ${sortPrimery == 'page_length' ? "" : "invisible"}`} ref={lenthTag}>
                                <BiCaretDown />
                            </span>
                        </span>

                    </div>
                    {/* This component is for displaying the rest of the table that has the DnD functionality */}
                    {items.length > 0 ? <DragTest items={items} style4  ={style4} /> : (<Skeleton />)}
                </div>
            </main>


            {/* This modal will be displayed when the design button is clicked */}
            <input type="checkbox" id="design-modal" className="modal-toggle" />
            <label htmlFor="design-modal" className="modal cursor-pointer overflow-visible">
                <label className="modal-box relative overflow-visible" htmlFor="">
                    <div className="flex flex-auto justify-between h-fit overflow-visible my-3">
                        <span>Day lines color</span>
                        <span><PopOver color="#ffffff" onChange={(clr) => onChangeColor(clr, "DAYS")} presetColors={presetColors} /></span>
                    </div>
                    <div className="flex flex-auto justify-between h-fit overflow-visible my-3">
                        <span>INT lines color</span>
                        <span><PopOver color="#ffffff" onChange={(clr) => onChangeColor(clr, "INT")} presetColors={presetColors} /></span>
                    </div>
                    <div className="flex flex-auto justify-between h-fit overflow-visible my-3">
                        <span>EXT lines color</span>
                        <span><PopOver color="#ffffff" onChange={(clr) => onChangeColor(clr, "EXT")} presetColors={presetColors} /></span>
                    </div>
                </label>
            </label>
        </div>
    )
}

export default Table