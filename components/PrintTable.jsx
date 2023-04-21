import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TableContext from './context/TableContext.js';
import SortableItemForPrint from './PrintSortableItem';
import {MdDownload} from 'react-icons/md'
import {BsChevronLeft} from 'react-icons/bs'


function PrintTable() {

    // getting data from table context
    const { items, tableInfo } = useContext(TableContext);


    const handlePrint = () => {
        if (typeof (window) !== "undefinded") {
            window.print()
        }
    }

    const router = useRouter()

    return (
        <div className="container m-auto justify-center align-center flex-col">
            <>
                <button onClick={() => router.back()} className='btn btn-ghost relative top-6 noprintdplay  '> <BsChevronLeft className='mr-3' /> back </button>
                {/*  <!-- Add a button to trigger the PDF export --> */}
                <h1 className=' text-3xl font-bold mx-auto w-fit mt-8 '>{tableInfo.name} Strip Board</h1>
                <div className="flex noprintdplay justify-center p-8">
                    <button onClick={handlePrint} className='btn btn-sm btn-success text-white'>
                        Download <MdDownload className='ml-2 text-lg' />
                    </button>
                </div>
                <main className='my-container printpage'>
                    <div className='table-grid'>
                        {/* This is the main row where the columns names sits */}
                        <div id="tableTitle" className="row-grid">
                            <span className='text-white text-sm sm:text-lg font-bold m-auto'>Scene No.</span>
                            <span className='text-white text-sm sm:text-lg font-bold m-auto'>Camera</span>
                            <span className='text-white text-sm sm:text-lg font-bold m-auto'>Summary</span>
                            <span className='text-white text-sm sm:text-lg font-bold m-auto'>Location</span>
                            <span className='text-white text-sm sm:text-lg font-bold mx-8'>Scene Length</span>
                        </div>
                        {/* This component is for the rest of the table that has the DnD functionality */}
                        {items.map((line, index) =>
                            <SortableItemForPrint
                                key={line.id}
                                index={index}
                                id={line.id}
                                line={line}
                                value={`Item ${line.id}`}
                            />)}

                    </div>
                </main>
            </>
        </div>

    )

}

export default PrintTable;
