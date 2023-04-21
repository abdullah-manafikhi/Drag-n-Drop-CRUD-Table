import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import TableContext from './context/TableContext.js.jsx';
import Skeleton from './Skeleton.jsx';
import DragTest from './dndUI/DragZone.jsx';
import sortAccordingFor from "./functions/sort.js";
import { BiBrush } from 'react-icons/bi'
import { DATA } from '../assets/data2'
import { PopOver } from './colorPallete/PopOver'
import axios from 'axios'
import addingDays from './functions/addingDays.js';
import addingSavedDays from './functions/addingSavedDays.js';
import { toast } from 'react-toastify'


function Table() {

    const [sortPrimery, setSortPrimery] = useState('id');
    const [sortSecond, setSortSecond] = useState('id');
    const [itemPure, setItemPure] = useState([])

    const { adding, setAdding, items, setItems, style4, setStyle4, tableInfo, setTableInfo, setIsSaved, isSaved } = useContext(TableContext)

    useEffect(() => {
        if (itemPure.length > 0) {
            const arrayAfterSort = sortAccordingFor(itemPure, sortPrimery, 1, sortSecond, 1)
            // WHEN SELECTING DEFAULT PRIMARY SORT ADD DAY LINES AS IT WAS SAVED
            if (Object.keys(tableInfo.days).length > 0) {
                const sortAndDay = (sortPrimery === "id") ? addingSavedDays(arrayAfterSort, tableInfo.days) : addingDays(arrayAfterSort)
                setItems(sortAndDay)
            }
            if (isSaved) {
                setIsSaved(false)
            }
        }
    }, [sortPrimery, sortSecond])

    useEffect(() => {
        (async () => {
            try {
                const test = await fetch("http://movieapp-env.eba-xgguxtgd.us-west-1.elasticbeanstalk.com/api/stripboards/2")
                const res = await test.json()
                setTableInfo({ id: res.id, userId: res.user_id, project: res.project_id, name: res.name, days: res.days })
                setItemPure(res.table_content)
                if (Object.keys(res.days).length > 0) {
                    setItems(addingSavedDays(res.table_content, res.days))
                }
                else {
                    setItems(addingDays(res.table_content))
                }
            }
            catch (err) {
                toast.error(`${err.message}`)
            }
        })()
        // setItems(addingDays(DATA.table_content))
        // setItemPure(DATA.table_content)
    }, [])

    const onOptionChangeHandler1 = (event) => {
        setSortPrimery(event.target.value)
        console.log("User Sel- ", sortPrimery)
    }

    const onOptionChangeHandler2 = (event) => {
        setSortSecond(event.target.value)
    }

    const onChangeColor = (clr, day) => {
        console.log(clr, day)
        setStyle4(prevState => ({
            ...prevState,
            [day]: { backgroundColor: clr, color: "#000000" }
        }))
    }

    // COLOR OPTIONS FOR THE LINES
    const presetColors = ["#3C486B", "#F0F0F0", "#F9D949", "#F45050", "#3A98B9", "#FFF1DC", "#E8D5C4", "#EEEEEE"];

    const router = useRouter()

    const onSave = async (e) => {
        let days = {}
        items.forEach((item, index) => {
            if (item.hasOwnProperty("day")) {
                days = { ...days, [index]: item }
            }
        })
        console.log(days)
        const itemsNoDays = items.filter(item => !(item.hasOwnProperty("day")))
        const tableName = tableInfo.name.replaceAll('\\"', "")
        try {
            const response = await axios.put(
                `http://movieapp-env.eba-xgguxtgd.us-west-1.elasticbeanstalk.com/api/stripboards/${tableInfo.id}`,
                { name: tableName, table_content: JSON.stringify(itemsNoDays), days: {}}
            )
            if (response.status === 200) {
                toast.success("Saved successfully")
            }
            router.push("/print")
            setIsSaved(true)
        }
        catch (err) {
            console.log(err)
            toast.error(`${err.message}`)
        }
    }

    return (
        <div>
            <h1 className=' text-3xl font-bold mx-auto w-fit mt-6 mb-10 '>{tableInfo.name} Strip Board</h1>
            <div className="noprintdplay w-60 h-auto mx-auto p-2 flex justify-between">
                {/* SAVE BUTTON */}
                <button onClick={onSave} className={`btn btn-sm border-none`}>
                    save
                </button>

                {/* DESGIN BUTTON */}
                <label htmlFor="design-modal" className="btn btn-sm btn-ghost w-32 flex flex-initial justify-evenly">
                    Design <BiBrush className='h-4 w-4' />
                </label>
            </div>

            {/* ============= SORT SELECT =============== */}
            <div className='w-fit m-auto'>
                <div className="navbar bg-base-300 rounded-box my-4">
                    <div className="flex justify-end flex-1 px-2">
                        <div className="flex  items-center  ">
                            <h2 className="btn btn-ghost rounded-btn">Sort</h2>
                            <div className='flex flex-auto w-auto items-center'>
                                <select value={sortPrimery} onChange={onOptionChangeHandler1} className="select select-xs my-1 text-xs select-primary w-auto max-w-xs border-none"  >
                                    <option disabled>Primery</option>
                                    <option value={'id'}  >Default </option>
                                    <option value={'camera'}  >Camera </option>
                                    <option value={'summary'} >Summary</option>
                                    <option value={'location'} >Location</option>
                                    <option value={'page_length'} >Page Length </option>
                                </select>

                                <span className='mx-2'> 	&amp; </span>

                                <select value={sortSecond} onChange={onOptionChangeHandler2} className="select select-xs my-1  select-primary w-auto max-w-xs border-none">
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
                <button onClick={() => setAdding(prevState => ({ ...prevState, isAdding: !prevState.isAdding }))} className={`btn ${adding.isAdding ? "btn-error" : "btn-outline "} h-16 w-16 relative rounded-full`}>
                    <span className={`font-normal ${adding.isAdding ? "text-2xl mb-1 text-white" : "text-5xl mb-2"} text-2xl rounded-full h-fit w-fit `}>
                        {adding.isAdding ? "x" : "+"}
                    </span>
                </button>
            </div>

            {/* =============== TABLE =============== */}
            <main className='my-container'>
                <div draggable className='table-grid lines-width'>
                    {/* This is the main row  */}
                    <div id="tableTitle" className="row-grid">
                        <span className='text-white noprintdplay text-sm sm:text-lg font-bold mx-8'></span>
                        <span onClick={() => theadSortbyHundler('id')} className='text-white flex h-full items-center text-sm sm:text-lg font-bold m-auto'>
                            Scene No.
                        </span>
                        <span onClick={() => theadSortbyHundler('camera')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold m-auto'>
                            Camera
                        </span>
                        <span onClick={() => theadSortbyHundler('summary')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold m-auto'>
                            Summary
                        </span>
                        <span onClick={() => theadSortbyHundler('location')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold m-auto'>
                            Location
                        </span>
                        <span onClick={() => theadSortbyHundler('page_length')} className='text-white h-full flex items-center text-sm sm:text-lg font-bold mx-8'>
                            Page length
                        </span>

                    </div>
                    {/* This component is for displaying the rest of the table that has the DnD functionality */}
                    {items.length > 0 ? <DragTest items={items} style4={style4} /> : (<Skeleton />)}
                </div>
            </main>


            {/* This modal will be displayed when the design button is clicked */}
            <input type="checkbox" id="design-modal" className="modal-toggle" />
            <label htmlFor="design-modal" className="modal cursor-pointer overflow-visible">
                <label className="modal-box w-10/12 sm:w-4/12 relative overflow-visible" htmlFor="">
                    <div className="flex flex-auto justify-between h-fit overflow-visible my-3">
                        <span>Day lines</span>
                        <span><PopOver color="#ffffff" onChange={(clr) => onChangeColor(clr, "DAYS")} presetColors={presetColors} /></span>
                    </div>
                    <div className="flex flex-auto justify-between h-fit overflow-visible my-3">
                        <span>INT lines</span>
                        <span><PopOver color="#ffffff" onChange={(clr) => onChangeColor(clr, "INT")} presetColors={presetColors} /></span>
                    </div>
                    <div className="flex flex-auto justify-between h-fit overflow-visible my-3">
                        <span>EXT lines</span>
                        <span><PopOver color="#ffffff" onChange={(clr) => onChangeColor(clr, "EXT")} presetColors={presetColors} /></span>
                    </div>
                </label>
            </label>
        </div>
    )
}

export default Table